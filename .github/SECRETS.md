# GitHub Secrets Configuration

All secrets live in **Settings → Secrets and variables → Actions** in your GitHub repository.

---

## Environment Overview

| Environment | Branch    | GitHub Environment name | AWS Role secret          |
|-------------|-----------|-------------------------|--------------------------|
| DEV         | `develop` | `development`           | `AWS_ROLE_ARN_DEV`       |
| STAGING     | `staging` | `staging`               | `AWS_ROLE_ARN_STAGING`   |
| UAT         | `uat`     | `uat`                   | `AWS_ROLE_ARN_UAT`       |
| PRD         | `main`    | `production`            | `AWS_ROLE_ARN_PRD`       |

> **Tip:** Configure required reviewers on the `uat` and `production` GitHub Environments
> (Settings → Environments) so deployments need manual approval before they run.

---

## Required Secrets

### One-click provision and deploy workflow

The `Provision AWS Infra and Deploy Website` workflow creates the Terraform state bucket, provisions AWS infrastructure, builds the frontend, deploys to S3, and invalidates CloudFront.

| Secret | Source |
|--------|--------|
| `AWS_ACCESS_KEY_ID` | Bootstrap AWS IAM access key allowed to assume `arn:aws:iam::713678752742:role/OrganizationAccountAccessRole` |
| `AWS_SECRET_ACCESS_KEY` | Matching AWS IAM secret access key |
| `VITE_SUPABASE_PROJECT_ID` | Supabase Dashboard -> Settings -> General |
| `VITE_SUPABASE_URL` | Supabase Dashboard -> Settings -> API |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | Supabase Dashboard -> Settings -> API |

The workflow always verifies that AWS credentials resolve to target account `713678752742` before it creates infrastructure.

Workflow inputs:

| Input | Example |
|-------|---------|
| `environment` | `dev` |
| `action` | Start with `plan`, then run `apply` |
| `domain_name` | `dev.example.com` |
| `certificate_domain` | `*.example.com` |
| `state_bucket` | Leave blank to auto-create `cloud-it-control-tf-state-<env>-<account-id>` |

After a successful apply, add the printed CNAME record in Cloudflare:

```text
Type: CNAME
Name: <domain_name>
Target: <cloudflare_cname_target output>
```

### AWS — IAM OIDC Roles (one per environment)

| Secret | Value source |
|--------|-------------|
| `AWS_ROLE_ARN_DEV` | `terraform output github_actions_role_arn` (dev stack) |
| `AWS_ROLE_ARN_STAGING` | `terraform output github_actions_role_arn` (staging stack) |
| `AWS_ROLE_ARN_UAT` | `terraform output github_actions_role_arn` (uat stack) |
| `AWS_ROLE_ARN_PRD` | `terraform output github_actions_role_arn` (prd stack) |

### AWS — S3 Bucket Names

| Secret | Example value |
|--------|--------------|
| `AWS_S3_BUCKET_DEV` | `cloud-it-control-dev-123456789012` |
| `AWS_S3_BUCKET_STAGING` | `cloud-it-control-staging-123456789012` |
| `AWS_S3_BUCKET_UAT` | `cloud-it-control-uat-123456789012` |
| `AWS_S3_BUCKET_PRD` | `cloud-it-control-prd-123456789012` |

### AWS — CloudFront Distribution IDs

| Secret | Example value |
|--------|--------------|
| `AWS_CLOUDFRONT_DISTRIBUTION_DEV` | `E1A2B3C4D5E6F7` |
| `AWS_CLOUDFRONT_DISTRIBUTION_STAGING` | `E2A3B4C5D6E7F8` |
| `AWS_CLOUDFRONT_DISTRIBUTION_UAT` | `E3A4B5C6D7E8F9` |
| `AWS_CLOUDFRONT_DISTRIBUTION_PRD` | `E4A5B6C7D8E9G0` |

### Supabase — Build-time variables (shared across envs unless you use separate projects)

| Secret | Source |
|--------|--------|
| `VITE_SUPABASE_PROJECT_ID` | Supabase Dashboard → Settings → General |
| `VITE_SUPABASE_URL` | Supabase Dashboard → Settings → API |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | Supabase Dashboard → Settings → API (anon key) |

### Supabase — PRD database migrations (optional)

| Secret | Source |
|--------|--------|
| `SUPABASE_PROJECT_ID_PRD` | PRD Supabase project ID |
| `SUPABASE_DB_PASSWORD_PRD` | Supabase Dashboard → Settings → Database |

---

## Getting values from Terraform

After `terraform apply` for each environment:

```bash
cd terraform

# UAT
terraform init -backend-config="bucket=cloud-it-control-tf-state-uat" \
               -backend-config="key=uat/terraform.tfstate" \
               -backend-config="region=us-east-1"
terraform output github_actions_role_arn   # → AWS_ROLE_ARN_UAT
terraform output s3_bucket_name            # → AWS_S3_BUCKET_UAT
terraform output cloudfront_distribution_id # → AWS_CLOUDFRONT_DISTRIBUTION_UAT

# PRD
terraform init -backend-config="bucket=cloud-it-control-tf-state-prd" \
               -backend-config="key=prd/terraform.tfstate" \
               -backend-config="region=us-east-1"
terraform output github_actions_role_arn   # → AWS_ROLE_ARN_PRD
terraform output s3_bucket_name            # → AWS_S3_BUCKET_PRD
terraform output cloudfront_distribution_id # → AWS_CLOUDFRONT_DISTRIBUTION_PRD
```

---

## Security best practices

1. Use GitHub OIDC — no long-lived AWS access keys stored anywhere.
2. Each environment has its own IAM role with least-privilege permissions.
3. Enable required reviewers on `uat` and `production` GitHub Environments.
4. Rotate Supabase keys quarterly; update secrets immediately after rotation.
5. Never commit `.env` or any secret value to Git.
6. Audit secret access via AWS CloudTrail.

---

## Troubleshooting

| Symptom | Fix |
|---------|-----|
| `AccessDenied` on deploy | Verify the correct `AWS_ROLE_ARN_*` secret is set and the OIDC provider exists |
| `Secret not found` | Secret names are case-sensitive — check exact spelling |
| CloudFront shows stale content | Invalidation is async; wait ~60 s or check distribution status |
| Build fails with missing env var | Ensure all `VITE_*` secrets are set in the repository |
