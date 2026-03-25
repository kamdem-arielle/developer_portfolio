## Introduction

Deploying a Single Page Application (SPA) shouldn't feel like navigating a labyrinth — but when you're wiring together S3 buckets, CloudFront distributions, DNS records, and CI/CD pipelines for the first time, it can certainly feel that way.

In this guide, I'll walk you through the entire process of taking a static frontend application and deploying it on AWS with production-grade infrastructure: **S3** for hosting, **CloudFront** for global CDN and HTTPS, **Route 53** for DNS, **ACM** for SSL certificates, and **GitHub Actions** for automated deployments.

By the end, you'll have a fully automated deployment pipeline that pushes your latest code to the world every time you merge to `main`.

---

## Step 1: Create and Secure Your AWS Account

### 1.1 — Create an AWS Account

Head over to the [AWS Console](https://aws.amazon.com/) and create a new account if you haven't already. You'll need a credit card on file, but everything we'll use falls comfortably within the free tier.

### 1.2 — Enable Multi-Factor Authentication (MFA)

Security first. Navigate to the **IAM** dashboard, select your root user, and enable MFA under the **Security credentials** tab. Use an authenticator app like Google Authenticator or Authy—this is non-negotiable for any production AWS account.

### 1.3 — Create a Dedicated Administrator IAM User

Never use the root account for day-to-day operations. Instead, create an administrator user:

1. In the IAM dashboard, go to **Users → Add user**
2. Enter a username (e.g., `admin-user`)
3. Enable **Programmatic access** and **AWS Management Console access**
4. Attach the `AdministratorAccess` policy directly
5. Download the credentials CSV — you'll need the access key and secret key later

> **Pro tip:** Store these credentials securely in a password manager. They grant full access to your AWS account.

### 1.4 — Switch to the Administrator Account

Log out of the root account and log back in with your new administrator credentials. From this point forward, all operations should be performed under this account.

---

## Step 2: Create and Configure Your S3 Bucket

Amazon S3 will serve as the origin for your static files. Think of it as a managed file server purpose-built for the web.

### 2.1 — Create the Bucket

1. Open the [S3 Console](https://s3.console.aws.amazon.com/)
2. Click **Create bucket**
3. Enter a globally unique bucket name (e.g., `my-awesome-spa`)
4. Choose a region close to your target audience
5. Leave all other settings as default and click **Create bucket**

### 2.2 — Allow Public Access

By default, S3 blocks all public access — which is great for private data, but we need to serve a website.

1. Select your bucket → **Permissions** tab
2. Under **Block public access (bucket settings)**, click **Edit**
3. **Uncheck** "Block *all* public access"
4. Confirm and save

![S3 bucket public access settings](/blog/spa-deployment-aws/allow_public_access.png)

### 2.3 — Configure the Bucket Policy

Still in the **Permissions** tab, scroll to **Bucket policy** and paste the following, replacing `your-bucket-name` with your actual bucket name:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::your-bucket-name/*"
    }
  ]
}
```

This policy allows anyone to read objects from your bucket — exactly what you need for a public website.

### 2.4 — Enable Static Website Hosting

1. Navigate to the **Properties** tab
2. Scroll to **Static website hosting** → click **Edit**
3. Select **Enable**
4. Set the **Index document** to `index.html`
5. Set the **Error document** to `index.html` (this is critical for SPAs — it ensures client-side routing works)
6. Save changes

Once enabled, AWS will provide a bucket website endpoint URL. You can use this to verify your deployment before setting up a custom domain.

![S3 static website hosting configuration](/blog/spa-deployment-aws/enable_static_website_hosting.png)

### 2.5 — Upload Your Build Files

Navigate to the **Objects** tab and upload your production build output (`dist/` or `build/` folder contents). Make sure `index.html` is at the root level.

> **Heads up:** If your CSS files aren't being applied, check the **Metadata** of the uploaded file. The `Content-Type` must be set to `text/css`. AWS sometimes misidentifies file types during manual uploads. The same applies to JavaScript files — ensure they have `application/javascript` as their content type.

![S3 object metadata showing Content-Type](/blog/spa-deployment-aws/file_meta_data.png)

---

## Step 3: Configure Route 53 for Custom Domain

If you want your app served from a custom domain (e.g., `app.yourdomain.com`) instead of an S3 endpoint URL, Route 53 is the way to go.

### 3.1 — Create a Hosted Zone

1. Open the [Route 53 Console](https://console.aws.amazon.com/route53/)
2. Go to **Hosted zones → Create hosted zone**
3. Enter your domain name (e.g., `yourdomain.com`)
4. Select **Public Hosted Zone** and create it

### 3.2 — Update Your Domain's Nameservers

Route 53 will generate four **NS records**. Copy these and update the nameservers at your domain registrar (Namecheap, GoDaddy, Google Domains, etc.). This tells the internet that AWS is now managing DNS for your domain.

> DNS propagation can take anywhere from a few minutes to 48 hours — though it's usually much faster.

### 3.3 — Create a DNS Record

We'll create this record after setting up CloudFront (next section), since the A record needs to point to the CloudFront distribution as an alias target.

---

## Step 4: Secure Your Domain with HTTPS (ACM)

No modern web application should be served over plain HTTP. AWS Certificate Manager (ACM) provides free SSL/TLS certificates.

1. Open [AWS Certificate Manager](https://console.aws.amazon.com/acm/)
2. **Important:** Make sure you're in the `us-east-1` (N. Virginia) region — CloudFront requires certificates from this region
3. Click **Request a certificate → Public certificate**
4. Enter your domain (e.g., `app.yourdomain.com`)
5. Choose **DNS validation**
6. ACM will provide a CNAME record — add it to your Route 53 hosted zone
7. Wait for the status to change to **Issued**

---

## Step 5: Set Up CloudFront for CDN & HTTPS

CloudFront is AWS's content delivery network. It caches your static files at edge locations worldwide, dramatically reducing latency for your users, and serves them over HTTPS.

### 5.1 — Create a Distribution

1. Open the [CloudFront Console](https://console.aws.amazon.com/cloudfront/)
2. Click **Create distribution**
3. Configure the origin:
   - **Origin domain:** Select your S3 bucket's *website endpoint* (not the REST API endpoint)
   - **Protocol:** HTTP only (CloudFront handles HTTPS on the viewer side)
4. Configure behavior:
   - **Viewer protocol policy:** Redirect HTTP to HTTPS
   - **Cache policy:** CachingOptimized (recommended for static sites)
5. Configure settings:
   - **Alternate domain name (CNAME):** `app.yourdomain.com`
   - **Custom SSL certificate:** Select the ACM certificate you created
   - **Default root object:** `index.html`
6. Click **Create distribution** and wait for it to deploy

### 5.2 — Configure Custom Error Pages for SPA Routing

Since SPAs use client-side routing, direct URL access to routes like `/about` or `/blog/my-post` will return a 404 from S3. To fix this:

1. In your CloudFront distribution, go to **Error pages**
2. Create a custom error response:
   - HTTP error code: `403`
   - Custom error response: Yes
   - Response page path: `/index.html`
   - HTTP response code: `200`
3. Repeat for error code `404`

This ensures all routes are handled by your SPA's router.

### 5.3 — Complete the Route 53 Record

Now go back to Route 53 and create the A record:

1. Name: `app` (or your subdomain)
2. Type: **A — IPv4 address**
3. Toggle **Alias:** Yes
4. Alias target: Select your **CloudFront distribution**
5. Create the record

Your application is now accessible at `https://app.yourdomain.com`.

---

## Step 6: Automate Deployments with GitHub Actions

Manual uploads to S3 don't scale. Let's set up a CI/CD pipeline that automatically builds and deploys your application on every push to `main`.

### 6.1 — Store AWS Credentials as GitHub Secrets

In your GitHub repository, go to **Settings → Secrets and variables → Actions** and add:

| Secret Name | Value |
|---|---|
| `AWS_ACCESS_KEY_ID` | Your IAM user's access key |
| `AWS_SECRET_ACCESS_KEY` | Your IAM user's secret key |
| `BUCKET_ID` | Your S3 bucket name |
| `DISTRIBUTION_ID` | Your CloudFront distribution ID |

### 6.2 — Create the Workflow File

Create a file at `.github/workflows/deploy.yml` in your repository:

```yaml
name: Deploy Website

on:
  push:
    branches:
      - main

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Configure AWS Credentials
        uses: aws-actions/configure-aws-credentials@v4
        with:
          aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
          aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          aws-region: us-east-1

      - name: Install dependencies
        run: npm ci

      - name: Build application
        run: npm run build

      - name: Deploy to S3
        run: aws s3 sync ./dist/ s3://${{ secrets.BUCKET_ID }} --delete

      - name: Invalidate CloudFront cache
        run: |
          aws cloudfront create-invalidation \
            --distribution-id ${{ secrets.DISTRIBUTION_ID }} \
            --paths "/*"
```

### 6.3 — How the Pipeline Works

Here's what happens every time you push to `main`:

1. **Checkout** — GitHub pulls your latest code
2. **AWS Authentication** — The runner authenticates using your stored secrets
3. **Install & Build** — Dependencies are installed and the production build is generated
4. **S3 Sync** — The build output replaces the existing files in your bucket (`--delete` removes stale files)
5. **Cache Invalidation** — CloudFront's edge caches are purged so users immediately see the latest version

> **What is CloudFront Invalidation?** When CloudFront serves content, it caches files at edge locations worldwide for performance. After deploying new files, the cached versions would still be served until they expire. An invalidation request forces CloudFront to fetch fresh content from S3, ensuring users always get the latest version of your application.

---

## Summary

Here's the full architecture at a glance:

| Component | Role |
|---|---|
| **S3** | Stores and serves your static build files |
| **CloudFront** | CDN for global caching, HTTPS termination |
| **Route 53** | DNS management, maps your domain to CloudFront |
| **ACM** | Free SSL/TLS certificate for HTTPS |
| **GitHub Actions** | Automated build and deploy on every push |

This setup gives you:

- **High availability** through AWS's global infrastructure
- **Automatic HTTPS** for secure browsing
- **Sub-second load times** via CloudFront edge caching
- **Zero-downtime deployments** through automated GitHub workflows
- **Cost efficiency** — the entire stack runs within or near the AWS free tier for most SPAs

---

## Final Thoughts

What started as a simple "how do I put my website online" question quickly reveals the depth of modern cloud infrastructure. But the beauty of this setup is that once configured, it's entirely hands-off. Push your code, and the pipeline handles the rest.

If you have questions or run into issues following this guide, don't hesitate to reach out. Happy deploying!
