## Introduction

In [Part 1](/blog/fine-grained-s3-access-cognito-iam-identity-pools) of this series, we set up the AWS infrastructure for multi-tenant S3 access: a shared bucket with client prefixes, IAM policies scoped to each prefix, Cognito User Pool groups, and an Identity Pool that maps group membership to IAM roles. Everything was wired together so that each client can only touch their own data.

Now it's time to put that infrastructure to work. In this guide, I'll show you how to use the **AWS SDK** and the **amazon-cognito-identity-js** library inside an **Angular 18 application** to authenticate users through Cognito, obtain temporary AWS credentials via the Identity Pool, and fetch S3 files scoped to the authenticated user's tenant prefix. This is not a tutorial on building the Angular app itself, but rather a focused walkthrough of the key service methods that connect the frontend to the AWS backend we set up in Part 1. If you haven't read Part 1 yet, I'd recommend starting there since this guide assumes the AWS setup is already in place.

By the end, you'll understand how each piece of the authentication and file retrieval flow works, and you'll be able to integrate these patterns into your own Angular application.

---

## Project Setup

### Creating the Angular Project

This project uses **Angular 18**. Start by generating a new application:

```bash
ng new backup-app
```

The full source lives inside the `backup-app` directory.

### Installing Dependencies

We need three key libraries to connect Angular with AWS:

- **aws-sdk** — The AWS SDK for interacting with S3, Cognito Identity, and other AWS services
- **amazon-cognito-identity-js** — Handles user authentication against a Cognito User Pool
- **crypto-js** — Provides encryption utilities for securing data stored in the browser

Install them all at once:

```bash
npm install aws-sdk@^2.1692.0 amazon-cognito-identity-js@^6.3.15 crypto-js@^4.2.0
```

> **Version matters.** The versions listed above are the ones used and tested in this project with Angular 18. Different versions of these libraries may have compatibility issues with specific Angular versions, so if you run into unexpected build or runtime errors, double check that your installed versions align with these.

> **Note:** If you encounter a global reference error when running the app (something like `global is not defined`), it's because `amazon-cognito-identity-js` relies on Node.js globals. Add the following line to your `polyfills.ts` file:
>
> ```typescript
> (window as any).global = window;
> ```
>
> Then make sure `polyfills.ts` is included in the `scripts` build section of your `angular.json`.

---

## Encrypting Sensitive Data in Local Storage

Storing authentication tokens and user identifiers in `localStorage` as plain text is a security risk. Anyone with access to the browser's developer tools could read them. To mitigate this, the application encrypts all data before writing it to `localStorage` and decrypts it upon retrieval.

This is handled by two helper methods that leverage the **crypto-js** library under the hood.

### Encrypting Data

The `encryptToLocalStorage` method encrypts both the key and the value before storing them. This means even the storage key itself is not human readable, adding an extra layer of obfuscation:

```typescript
encryptToLocalStorage(key: any, data: any) {
  localStorage.setItem(
    this.encryptData(key, this.encryptDecryptKeyPassword),
    this.encryptData(data, this.encryptDecryptValuePassword)
  );
}
```

### Decrypting Data

The `decryptFromLocalStorage` method retrieves an item from `localStorage`, decrypts the key to locate it, then decrypts the value. It supports returning the result as a parsed JSON object or as a raw string, depending on the `json` parameter:

```typescript
decryptFromLocalStorage(key: any, json = true) {
  let encryptedKey = this.encryptData(key, this.encryptDecryptKeyPassword);
  if (!this.isEmptyOrNull(localStorage.getItem(encryptedKey))) {
    if (json == true)
      return JSON.parse(
        this.decryptData(
          localStorage.getItem(encryptedKey),
          this.encryptDecryptValuePassword
        )
      );
    else
      return this.decryptData(
        localStorage.getItem(encryptedKey),
        this.encryptDecryptValuePassword
      );
  } else {
    return "";
  }
}
```

> Throughout the rest of this guide, every interaction with `localStorage` uses these encrypted methods rather than the native `setItem` / `getItem` APIs. This ensures tokens and prefixes are never stored in plain text.

---

## Configuring AWS Credentials from Cognito Tokens

Before the application can interact with S3, it needs temporary AWS credentials. The `configureAWSCredentials` method handles this by exchanging a Cognito ID token for temporary IAM credentials through the **Cognito Identity Pool** (Federated Identities).

```typescript
private async configureAWSCredentials(idToken: string): Promise<void> {
  AWS.config.region = environment.region;

  this.credentials = new AWS.CognitoIdentityCredentials({
    IdentityPoolId: environment.identityPoolId,
    Logins: {
      [`cognito-idp.${environment.region}.amazonaws.com/${environment.userPoolId}`]: idToken,
    },
  });

  AWS.config.credentials = this.credentials;
  await this.credentials.getPromise();
}
```

Here's what happens step by step:

1. **Sets the AWS region** from the environment configuration
2. **Creates a `CognitoIdentityCredentials` object**, passing the Identity Pool ID and a `Logins` map that associates the Cognito User Pool provider with the user's ID token
3. **Assigns the credentials** to `AWS.config.credentials` so all subsequent SDK calls (such as S3 operations) automatically use them
4. **Calls `getPromise()`** to asynchronously resolve the credentials. Behind the scenes, this triggers an STS `AssumeRoleWithWebIdentity` call that returns temporary `AccessKeyId`, `SecretAccessKey`, and `SessionToken` values

The IAM role assumed through the Identity Pool is determined by the role mapping rules we configured in Part 1. This is what enforces tenant isolation at the AWS level.

---

## Extracting the Client Prefix from the User Session

This application follows a **multi-tenant architecture** where each tenant's data lives under a dedicated prefix in a shared S3 bucket. To enforce data isolation, the application needs to know which prefix belongs to the currently authenticated user.

In Cognito, users are assigned to **User Pool Groups**, and each group corresponds to a specific tenant. The `extractClientPrefixFromSession` method retrieves the authenticated user's session, decodes the ID token payload, and reads the `cognito:groups` claim. The first group in the list becomes the S3 prefix:

```typescript
private async extractClientPrefixFromSession(
  cognitoUser: CognitoUser
): Promise<void> {
  return new Promise((resolve, reject) => {
    cognitoUser.getSession(
      (err: Error | null, session: CognitoUserSession | null) => {
        if (err || !session) {
          console.error('Session retrieval error:', err);
          return reject(err);
        }

        const payload = session.getIdToken().decodePayload();
        const groups = payload['cognito:groups'];

        if (groups && groups.length > 0) {
          this.clientPrefix = `${groups[0]}/`;
          this.core.encryptToLocalStorage('clientPrefix', this.clientPrefix);
        } else {
          console.warn('User does not belong to any Cognito group');
        }

        resolve();
      }
    );
  });
}
```

The extracted prefix is encrypted and persisted in `localStorage` so it remains available across page navigations without requiring another round trip to Cognito.

---

## The Authentication Flow

With the two helper methods above in place (`configureAWSCredentials` for obtaining temporary credentials and `extractClientPrefixFromSession` for determining the tenant prefix), we can now look at the `authenticate` method that ties everything together.

```typescript
async authenticate(
  username: string,
  password: string
): Promise<AWS.Credentials> {
  this.userPool = new CognitoUserPool({
    UserPoolId: environment.userPoolId,
    ClientId: environment.userPoolWebClientId,
  });

  const userData = { Username: username, Pool: this.userPool };
  const authDetails = new AuthenticationDetails({
    Username: username,
    Password: password,
  });
  const cognitoUser = new CognitoUser(userData);

  return new Promise((resolve, reject) => {
    cognitoUser.authenticateUser(authDetails, {
      onSuccess: async (result: CognitoUserSession) => {
        const idToken = result.getIdToken().getJwtToken();
        this.core.encryptToLocalStorage('idToken', idToken);

        await this.configureAWSCredentials(idToken);
        await this.extractClientPrefixFromSession(cognitoUser);

        resolve(AWS.config.credentials as AWS.Credentials);
      },

      newPasswordRequired: (
        userAttributes: Record<string, string>,
        requiredAttributes: string[]
      ) => {
        cognitoUser.completeNewPasswordChallenge(environment.challenge, {
          onSuccess: async (session: CognitoUserSession) => {
            const idToken = session.getIdToken().getJwtToken();
            this.core.encryptToLocalStorage('idToken', idToken);

            await this.configureAWSCredentials(idToken);
            await this.extractClientPrefixFromSession(cognitoUser);

            resolve(AWS.config.credentials as AWS.Credentials);
          },
          onFailure: (err: Error) => reject(err),
        });
      },

      onFailure: (err: Error) => {
        console.error('Authentication failed:', err);
        reject(err);
      },
    });
  });
}
```

The flow works as follows:

1. A `CognitoUserPool` and `CognitoUser` are instantiated using environment configuration
2. `authenticateUser` sends the credentials to Cognito
3. **On success**, the ID token is encrypted and stored, AWS credentials are configured, and the client prefix is extracted
4. **On failure**, the error is propagated to the caller

### Handling the `newPasswordRequired` Challenge

When a user is created through the AWS Cognito Console (or via the Admin API) with a temporary password, Cognito marks the account as **FORCE_CHANGE_PASSWORD**. The first time that user signs in, Cognito does not return a session. Instead, it triggers the `newPasswordRequired` callback, signaling that a new permanent password must be set.

In this implementation, `completeNewPasswordChallenge` is called to programmatically fulfill that requirement. Once the challenge is resolved, the flow mirrors the standard `onSuccess` path.

> **In a production environment**, you would typically redirect the user to a "Change Password" form and let them choose their own permanent password rather than using a hardcoded value.

---

## Listing S3 Objects by Client Prefix

Once authentication is complete and the client prefix has been resolved, the application can fetch the tenant's files from S3. The `listObjectsInPrefix` method uses the AWS S3 SDK to list all objects under the authenticated user's prefix.

```typescript
listObjectsInPrefix(bucket: string): Promise<AWS.S3.ObjectList> {
  this.clientPrefix = this.clientPrefix
    ? this.clientPrefix
    : this.core.decryptFromLocalStorage('clientPrefix', false);
  let clientPrefix = this.clientPrefix;
  const s3 = new AWS.S3();

  return new Promise((resolve, reject) => {
    s3.listObjectsV2(
      { Bucket: bucket, Prefix: this.clientPrefix },
      (err: AWS.AWSError, data: AWS.S3.ListObjectsV2Output) => {
        if (err) reject(err);
        else {
          const files = (data.Contents || [])
            .filter((obj: AWS.S3.Object) => obj.Size && obj.Size > 0)
            .map((obj: AWS.S3.Object) => {
              if (obj.Size > 0) {
                return {
                  key: obj.Key!.replace(clientPrefix, ''),
                  url: this.generateSignedUrl(bucket, obj.Key!),
                  LastModified: obj.LastModified,
                  Size: obj.Size ? obj.Size / (1024 * 1024) : 0,
                  type: 'file',
                  name: obj.Key!.replace(clientPrefix, ''),
                };
              } else {
                return {
                  key: obj.Key!.replace(clientPrefix, '').replace(/\/$/, ''),
                  url: obj.Key,
                  LastModified: obj.LastModified,
                  Size: 0,
                  type: 'folder',
                  name: obj.Key!.replace(clientPrefix, '').replace(/\/$/, ''),
                };
              }
            });

          resolve(files);
        }
      }
    );
  });
}
```

Here's what the method does:

1. **Resolves the client prefix** either from the in-memory variable (set during authentication) or by decrypting it from `localStorage` (useful after a page reload)
2. **Calls `listObjectsV2`** with the bucket name and client prefix, so S3 only returns objects belonging to the current tenant
3. **Maps each S3 object** into a structured result with its key, a signed download URL, last modified date, size, and type

The `type` field distinguishes between files and folders:

- **Files** (`Size > 0`) — The client prefix is stripped from the key to produce a clean relative path. The size is converted from bytes to megabytes, and a time limited signed URL is generated for secure download
- **Folders** (`Size === 0`) — S3 represents folders as zero byte objects with a trailing `/`. The key is cleaned by removing both the prefix and the trailing slash

This demonstrates the core benefit of the architecture: by scoping the S3 query to the user's prefix, each tenant only ever sees their own data, even though all tenants share the same bucket.

---

## Session Persistence on Page Reload

When a user reloads the browser or navigates back to the application, the authentication state would normally be lost because Cognito sessions are held in memory. The `initSession` method restores the session by retrieving the encrypted ID token from `localStorage` and reconfiguring AWS credentials:

```typescript
async initSession(): Promise<boolean> {
  const idToken = this.core.decryptFromLocalStorage('idToken', false);
  if (!idToken) return false;

  try {
    await this.configureAWSCredentials(idToken);
    return true;
  } catch (err) {
    console.error('Session expired or invalid token:', err);
    this.logout();
    return false;
  }
}
```

The flow is straightforward:

1. **Decrypts the stored ID token** from `localStorage`. If no token is found, the user is not authenticated and the method returns `false`
2. **Attempts to configure AWS credentials** using the recovered token
3. **If successful**, returns `true` and the application proceeds normally
4. **If the token has expired** or is invalid, the credential exchange will fail. The method calls `logout()` to clear all stored data and returns `false`

This method is typically invoked by a route guard on application startup, ensuring that protected routes are only accessible when the user holds a valid session.

---

## Summary

Here's a recap of the full flow from the Angular application's perspective:

| Step | What Happens |
|---|---|
| **User logs in** | Credentials are verified against the Cognito User Pool |
| **Token exchange** | The ID token is passed to the Identity Pool, which returns temporary IAM credentials |
| **Role assumption** | The Identity Pool's role mapping rules assign the correct IAM role based on group membership |
| **Prefix resolution** | The `cognito:groups` claim is decoded to determine the S3 prefix |
| **S3 access** | All S3 operations are scoped to the user's prefix using the temporary credentials |
| **Session persistence** | Encrypted tokens in `localStorage` allow session restoration on page reload |

Combined with the AWS infrastructure from Part 1, this gives you:

- **Seamless authentication** through Cognito with automatic credential management
- **Tenant isolation enforced at two levels**: IAM policies on the AWS side and prefix scoping on the application side
- **Encrypted local storage** so sensitive tokens are never exposed in plain text
- **Session resilience** across page reloads without re-authentication

---

## Final Thoughts

What makes this architecture compelling is that the security enforcement doesn't live in your application code alone. Even if someone bypassed the frontend entirely and tried to call S3 directly with the temporary credentials, the IAM policy would still block access to any prefix outside their group. The Angular app is simply a convenient interface on top of a fundamentally secure backend.

If you missed the infrastructure setup, head back to [Part 1: Fine-Grained S3 Access per Client Using AWS Cognito, IAM Roles & Identity Pools](/blog/fine-grained-s3-access-cognito-iam-identity-pools) to get the AWS side configured.

If you have questions or run into issues, feel free to reach out. Happy building!
