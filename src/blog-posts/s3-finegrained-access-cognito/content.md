## Introduction

When you're building a multi-tenant application that stores files in Amazon S3, one question comes up fast: *how do you make sure each client can only see their own data?*

Bucket-level permissions won't cut it. You will need something more surgical. In this guide, I'll walk you through setting up **fine-grained, prefix-level S3 access** using **Amazon Cognito User Pools**, **Identity Pools**, and **IAM Roles** with least privilege principles. Each client gets scoped down to their own folder inside a shared bucket, and they can't peek at anyone else's files.

By the end, you'll have a fully working identity-based access control system where authenticated users automatically receive temporary AWS credentials scoped to their specific S3 prefix. 
<!-- — no hardcoded keys, no over-permissioned roles. -->

> **This is Part 1** of a two-part series. In [Part 2: Accessing Isolated S3 Files from an Angular App Using Cognito Federated Credentials](/blog/angular-s3-cognito-federated-access), we'll integrate this setup into a frontend Angular application and demonstrate it end to end. Stay tuned.

---

## Architecture Overview

Here's the general flow of what we're building:

1. Users authenticate via a **Cognito User Pool**
2. Each user belongs to a **group** (e.g., `clientA`, `clientB`)
3. Each group is mapped to an **IAM Role** with a policy scoped to a specific S3 prefix
4. A **Cognito Identity Pool** exchanges the user's token for **temporary AWS credentials**
5. The user can only access their own prefix in S3

This pattern is commonly used in SaaS platforms, backup portals, and document management systems where tenant isolation is critical.

---

## Step 1: Create the S3 Bucket and Client Prefixes

The first step is to create an **S3 bucket** that will store files for all clients. Inside this bucket, each client gets a designated prefix (think of it as a folder-like structure) to isolate their data. For example:

- `ClientA/`
- `ClientB/`

These prefixes are the foundation of our access control strategy. IAM policies will scope permissions down to these paths.

![S3 bucket overview](/blog/s3-finegrained-access-cognito/s3_bucket_overview.png)

Here's what the bucket looks like with both client prefixes created:

![S3 prefixes for ClientA and ClientB](/blog/s3-finegrained-access-cognito/s3_bucket_client_a_b.png)

> **Important:** Keep **Block Public Access** enabled on this bucket. Unlike a static website hosting scenario, we don't want any of these objects publicly accessible. All access will be mediated through temporary Cognito credentials.

---

## Step 2: Create IAM Policies for Prefix-Scoped Access

Next, we need **IAM policies** that grant fine-grained, prefix-specific access to the S3 bucket. Each policy allows access **only** to the respective client's prefix. This is the principle of least privilege in action.

Here's an example policy for **Client A**:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "AllowGetObjectInClientAPrefix",
      "Effect": "Allow",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::backuptesbucket/ClientA/*"
    },
    {
      "Sid": "AllowListBucketUnderClientAPrefix",
      "Effect": "Allow",
      "Action": "s3:ListBucket",
      "Resource": "arn:aws:s3:::backuptesbucket",
      "Condition": {
        "StringEquals": {
          "s3:prefix": "ClientA/"
        }
      }
    }
  ]
}
```

Let's break down what each statement does:

| Statement | Purpose |
|---|---|
| `s3:GetObject` on `backuptesbucket/ClientA/*` | Allows downloading any object within the `ClientA/` prefix |
| `s3:ListBucket` with condition `s3:prefix = ClientA/` | Allows listing objects, but **only** those under the `ClientA/` folder |

The key insight here is that `ListBucket` operates at the bucket level (not the object level), so we use an **IAM condition** to restrict which prefixes the user can enumerate. Without this condition, the user could list the entire bucket and discover other clients' file names, even if they couldn't download them.

You would create an equivalent policy for **Client B**, replacing `ClientA` with `ClientB` throughout.

---

## Step 3: Create IAM Roles for Cognito Federated Access

To allow federated identities (authenticated through Cognito) to assume roles and access their respective S3 prefixes, I created **two IAM roles**, one per client group.

Here's the catch: at this stage, the **Identity Pool doesn't exist yet**. But Identity Pool creation requires you to specify which roles to assign to groups, and those roles need a trust policy that references the Identity Pool. It's a bit of a chicken-and-egg problem.

The workaround is simple; create the roles first with a **placeholder Identity Pool ID** in the trust relationship. We'll come back and update it once the Identity Pool is created.

![IAM role created with a dummy web identity trust](/blog/s3-finegrained-access-cognito/role_with_dummy_web_identity.png)

Here are the two IAM roles, each with their respective prefix-scoped policy attached:

![IAM roles for ClientA and ClientB](/blog/s3-finegrained-access-cognito/iam_role_a_b.png)

Each role has the corresponding S3 policy (from Step 2) attached, so when a user assumes `clientA-role`, they can only interact with the `ClientA/` prefix.

---

## Step 4: Set Up the Cognito User Pool and Groups

With the roles ready, it's time to create the identity layer. I created an **Amazon Cognito User Pool**. This is where your users will be registered and authenticated.

After the User Pool was in place, I created two **user groups**:

- `clientA`
- `clientB`

Each group is associated with the corresponding IAM role created in Step 3. When a user is added to the `clientA` group, they'll inherit the permissions of `clientA-role` which imply they can only access the `ClientA/` prefix in S3.

This is the glue that connects your user identity to their AWS permissions.

---

## Step 5: Create the Cognito Identity Pool with Role Mapping

This is where everything comes together. The **Identity Pool** (also called a Federated Identity) is responsible for exchanging a user's Cognito token for temporary AWS credentials.

I configured the Identity Pool to:

1. Use the **Cognito User Pool** as its authentication provider
2. Apply **role mapping rules** based on group membership

The role mapping ensures that:

- Users in the `clientA` group → assume `clientA-role`
- Users in the `clientB` group → assume `clientB-role`

![Identity Pool configuration with Cognito User Pool as identity source](/blog/s3-finegrained-access-cognito/identity_pool_config.png)

Here are the role mapping rule settings that tie group membership to IAM roles:

![Role mapping rules configuration](/blog/s3-finegrained-access-cognito/role_mapping_rules_settings.png)

Once this is configured, a user who authenticates through the User Pool and belongs to `clientA` will automatically receive temporary credentials that only permit access to the `ClientA/` prefix in S3. No additional authorization logic needed in your application code.

---

## Step 6: Update IAM Role Trust Policies with the Real Identity Pool ID

Remember that placeholder Identity Pool ID from Step 3? Now that the Identity Pool exists, it's time to go back and update the **trust relationship** on each IAM role with the actual Identity Pool ID.

Here's what the updated trust policy looks like:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "Federated": "cognito-identity.amazonaws.com"
      },
      "Action": "sts:AssumeRoleWithWebIdentity",
      "Condition": {
        "StringEquals": {
          "cognito-identity.amazonaws.com:aud": "us-east-1:1ded7e88-eefe-474e-a33e-ddfaf5345bbc"
        }
      }
    }
  ]
}
```

The critical part is the `cognito-identity.amazonaws.com:aud` condition which must match your **Identity Pool ID exactly**. This ensures that only your specific Identity Pool can assume this role, preventing cross-pool role assumption.

![Updated trusted entity with the final Identity Pool ID](/blog/s3-finegrained-access-cognito/updated_trusted_identity.png)

> **Double-check this value.** If the Identity Pool ID doesn't match, users will get an `AccessDenied` error when trying to obtain credentials.

---

## Important Considerations

Before calling it done, there are a few additional configurations worth highlighting:

### Block Public Access

Make sure **Block Public Access** is enabled on the S3 bucket. This is your safety net as it will ensure no objects are publicly accessible even if a bucket policy or ACL is misconfigured.

### Enable CORS on the S3 Bucket

If your frontend application will be making direct requests to S3 (e.g., downloading files via pre-signed URLs), you need to configure CORS on the bucket. Here's a sample configuration:

```json
[
  {
    "AllowedHeaders": ["*"],
    "AllowedMethods": ["GET"],
    "AllowedOrigins": ["https://yourdomain.com"],
    "ExposeHeaders": [],
    "MaxAgeSeconds": 3000
  }
]
```

> **Security note:** Avoid using `"*"` as the `AllowedOrigins` value in production. Always specify your actual domain(s) to prevent unauthorized cross-origin requests. For local development, you can temporarily add `http://localhost:4200` as an additional origin.

<!-- ### Use Pre-Signed URLs for Object Access

Rather than exposing raw S3 endpoints to your frontend, generate **pre-signed URLs** on the server side. These URLs are time-limited and scoped to specific objects, adding another layer of security on top of IAM policies.

### Set Appropriate Expiry Times

Configure the expiry time for pre-signed URLs based on your use case. For document viewing, a few minutes may suffice. For large file downloads, you might need longer — but avoid setting excessively long expiry times that could be exploited if a URL is shared. -->

---

## Summary

Here's a recap of the full architecture:

| Component | Role |
|---|---|
| **S3 Bucket** | Stores client files in isolated prefixes (`ClientA/`, `ClientB/`) |
| **IAM Policies** | Grant prefix-scoped `GetObject` and `ListBucket` permissions |
| **IAM Roles** | Assumed by federated identities via `sts:AssumeRoleWithWebIdentity` |
| **Cognito User Pool** | Manages user authentication and group membership |
| **Cognito Identity Pool** | Exchanges tokens for temporary AWS credentials via role mapping |

This setup gives you:

- **True multi-tenant isolation** — each client is walled off at the IAM level
- **Temporary credentials** — no long-lived access keys to rotate or leak
- **Least privilege access** — users can only perform the exact operations they need, on the exact resources they own
- **Scalability** — adding a new client is as simple as creating a new prefix, policy, role, and user group

---

## What's Next

This guide covered the AWS infrastructure side of things. In **Part 2**, [Accessing Isolated S3 Files from an Angular App Using Cognito Federated Credentials](/blog/angular-s3-cognito-federated-access), I'll show you how to use the AWS SDK inside an Angular application to authenticate users, obtain federated credentials, and fetch files from the correct S3 prefix based on the logged-in user's group.

If you have questions or run into issues setting this up, feel free to reach out. Happy building!
