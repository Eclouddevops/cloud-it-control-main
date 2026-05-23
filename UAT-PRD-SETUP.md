# UAT & PRD Environment Setup Guide

This guide walks you through setting up **UAT** (User Acceptance Testing) and **PRD** (Production) environments for Cloud IT Control.

---

## Environment Strategy

| Environment | Branch    | Purpose | WAF | Approval Required |
|-------------|-----------|---------|-----|-------------------|
| **DEV**     | `develop` | Active development | ❌ | No |
| **STAGING** | `staging` | Integration testing | ✅ | No |
| **UAT**     | `uat`     | Business validation | ✅ | Optional |
| **PRD**     | `main`    | Live production | ✅ | **Yes** |

---

## Prerequisites

1. **AWS Account** with admin access
2. **AWS CLI** configured (`aws configure`)
3. **Terraform** installed (v1.5+)
4. **GitHub** repository admin access
5. **Supabase** projects for UAT and PRD (recommended: separate projects)
6. **Route 53** hosted zone
7. **ACM certificate** (must be in `us-east-1` for CloudFront)

---

## Step 1: Create Terraform State Buckets

Run this for **each** environment (uat, prd):

```bash
# UAT
aws s3 mb s3://cloud-it-control-tf-state-uat --region us-east-1
aws s3api put-bucket-versioning \
  --bucket cloud-it-control-tf-state-uat \
  --versioning-configuration Status=Enabled

# PRD
aws s3 mb s3://cloud-it-control-tf-state-prd --region us-east-1
aws s3api put-bucket-versioning \
  --bucket cloud-it-control-tf-state-prd \
  --versioning-configuration Status=Enabled
```

---

## Step 2: Configure Terraform Variables

### UAT Environment

Edit `terraform/terraform.tfvars.uat`:

```hcl
aws_region         = "us-east-1"
environment        = "uat"
domain_name        = "uat.cloud-it-control.com"
certificate_domain = "cloud-it-control.com"
hosted_zone_id     = "Z1234567890ABC"   # ← Get from Route 53
enable_waf         = true

# Supabase — use a dedicated UAT project
supabase_project_id      = "your-uat-project-id"
supabase_url             = "https://your-uat-project-id.supabase.co"
supabase_publishable_key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

### PRD Environment

Edit `terraform/terraform.tfvars.prd`:

```hcl
aws_region         = "us-east-1"
environment        = "prd"
domain_name        = "app.cloud-it-control.com"
certificate_domain = "cloud-it-control.com"
hosted_zone_id     = "Z1234567890ABC"
enable_waf         = true

# Supabase — production project (NEVER share with lower envs)
supabase_project_id      = "your-prd-project-id"
supabase_url             = "https://your-prd-project-id.supabase.co"
supabase_publishable_key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

---

## Step 3: Deploy Infrastructure with Terraform

### Deploy UAT

```bash
cd terraform

# Initialize
terraform init \
  -backend-config="bucket=cloud-it-control-tf-state-uat" \
  -backend-config="key=uat/terraform.tfstate" \
  -backend-config="region=us-east-1" \
  -backend-config="encrypt=true"

# Plan
terraform plan -var-file="terraform.tfvars.uat"

# Apply
terraform apply -var-file="terraform.tfvars.uat"

# Capture outputs
terraform output
```

**Save these outputs** — you'll need them for GitHub Secrets:
- `github_actions_role_arn` → `AWS_ROLE_ARN_UAT`
- `s3_bucket_name` → `AWS_S3_BUCKET_UAT`
- `cloudfront_distribution_id` → `AWS_CLOUDFRONT_DISTRIBUTION_UAT`

### Deploy PRD

```bash
cd terraform

# Initialize
terraform init \
  -backend-config="bucket=cloud-it-control-tf-state-prd" \
  -backend-config="key=prd/terraform.tfstate" \
  -backend-config="region=us-east-1" \
  -backend-config="encrypt=true"

# Plan
terraform plan -var-file="terraform.tfvars.prd"

# Apply (with extra caution!)
terraform apply -var-file="terraform.tfvars.prd"

# Capture outputs
terraform output
```

**Save these outputs**:
- `github_actions_role_arn` → `AWS_ROLE_ARN_PRD`
- `s3_bucket_name` → `AWS_S3_BUCKET_PRD`
- `cloudfront_distribution_id` → `AWS_CLOUDFRONT_DISTRIBUTION_PRD`

---

## Step 4: Configure GitHub Secrets

Go to **Settings → Secrets and variables → Actions** in your GitHub repo.

### Add UAT Secrets

| Secret Name | Value Source |
|-------------|--------------|
| `AWS_ROLE_ARN_UAT` | `terraform output github_actions_role_arn` (uat) |
| `AWS_S3_BUCKET_UAT` | `terraform output s3_bucket_name` (uat) |
| `AWS_CLOUDFRONT_DISTRIBUTION_UAT` | `terraform output cloudfront_distribution_id` (uat) |

### Add PRD Secrets

| Secret Name | Value Source |
|-------------|--------------|
| `AWS_ROLE_ARN_PRD` | `terraform output github_actions_role_arn` (prd) |
| `AWS_S3_BUCKET_PRD` | `terraform output s3_bucket_name` (prd) |
| `AWS_CLOUDFRONT_DISTRIBUTION_PRD` | `terraform output cloudfront_distribution_id` (prd) |
| `SUPABASE_PROJECT_ID_PRD` | Supabase Dashboard → Settings → General |
| `SUPABASE_DB_PASSWORD_PRD` | Supabase Dashboard → Settings → Database |

### Shared Secrets (if using same Supabase project across envs)

| Secret Name | Value Source |
|-------------|--------------|
| `VITE_SUPABASE_PROJECT_ID` | Supabase Dashboard → Settings → General |
| `VITE_SUPABASE_URL` | Supabase Dashboard → Settings → API |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | Supabase Dashboard → Settings → API (anon key) |

---

## Step 5: Configure GitHub Environments

### Create UAT Environment

1. Go to **Settings → Environments**
2. Click **New environment**
3. Name: `uat`
4. (Optional) Add **Required reviewers** — QA team members
5. (Optional) Add **Wait timer** — 5 minutes before deploy
6. Save

### Create Production Environment

1. Go to **Settings → Environments**
2. Click **New environment**
3. Name: `production`
4. **Required reviewers** — Add at least 1 senior engineer ✅
5. (Optional) **Deployment branches** — Limit to `main` only
6. Save

---

## Step 6: Create Git Branches

```bash
# Create UAT branch from staging
git checkout staging
git pull origin staging
git checkout -b uat
git push -u origin uat

# Main branch already exists (PRD)
git checkout main
git pull origin main
```

---

## Step 7: Test Deployments

### Test UAT Deployment

```bash
# Make a small change
echo "// UAT test" >> src/App.tsx

# Commit and push
git add .
git commit -m "test: UAT deployment"
git push origin uat
```

Watch GitHub Actions → **Deploy to AWS** workflow. It should:
1. Build the app
2. Run tests
3. Deploy to S3 (uat bucket)
4. Invalidate CloudFront (uat distribution)
5. Create deployment record

Visit `https://uat.cloud-it-control.com` to verify.

### Test PRD Deployment

```bash
# Merge UAT → main (after UAT validation passes)
git checkout main
git merge uat
git push origin main
```

GitHub Actions will:
1. Build
2. Run tests
3. **Wait for manual approval** (if you configured required reviewers)
4. Deploy to PRD after approval

Visit `https://app.cloud-it-control.com` to verify.

---

## Deployment Workflow

```
develop → DEV (auto)
   ↓
staging → STAGING (auto)
   ↓
uat → UAT (auto or approval-gated)
   ↓
main → PRD (manual approval required)
```

---

## Infrastructure Automation (Optional)

Use the **Infrastructure Deploy** workflow to provision/update infrastructure via GitHub Actions:

1. Go to **Actions** tab
2. Select **Infrastructure Deploy (Terraform)**
3. Click **Run workflow**
4. Choose:
   - Environment: `uat` or `prd`
   - Action: `plan` or `apply`
   - Region: `us-east-1`
5. Click **Run workflow**

This is useful for:
- Provisioning new environments without local Terraform
- Updating infrastructure from CI/CD
- Team members without AWS CLI access

---

## Monitoring & Alerts

### CloudWatch Alarms (created by Terraform)

Each environment gets:
- **Origin Latency** alarm (threshold: 1000ms)
- **4XX Errors** alarm (threshold: 100 errors/5min)
- **5XX Errors** alarm (threshold: 10 errors/1min)

### View Logs

```bash
# UAT logs
aws logs tail /aws/cloudfront/cloud-it-control-uat --follow

# PRD logs
aws logs tail /aws/cloudfront/cloud-it-control-prd --follow
```

### CloudFront Metrics

```bash
# UAT distribution status
aws cloudfront get-distribution --id E1234567890ABC

# PRD distribution status
aws cloudfront get-distribution --id E9876543210XYZ
```

---

## Rollback Procedure

### Option 1: Revert Git Commit

```bash
git revert HEAD
git push origin main  # triggers new deployment with reverted code
```

### Option 2: Restore S3 Version

```bash
# List versions
aws s3api list-object-versions \
  --bucket cloud-it-control-prd-123456789012 \
  --prefix index.html

# Restore previous version
aws s3api copy-object \
  --copy-source cloud-it-control-prd-123456789012/index.html?versionId=OLD_VERSION_ID \
  --bucket cloud-it-control-prd-123456789012 \
  --key index.html

# Invalidate cache
aws cloudfront create-invalidation \
  --distribution-id E9876543210XYZ \
  --paths "/*"
```

---

## Cost Estimates

### UAT Environment
- **S3**: ~$5/month (low traffic)
- **CloudFront**: ~$10/month (first 10TB free tier)
- **WAF**: $5/month base + $1/million requests
- **Route 53**: $0.50/month per hosted zone
- **Total**: ~$20-25/month

### PRD Environment
- **S3**: ~$10-20/month (depends on traffic)
- **CloudFront**: ~$20-50/month (after free tier)
- **WAF**: $5/month base + usage
- **Route 53**: $0.50/month
- **Total**: ~$35-75/month (scales with traffic)

---

## Security Best Practices

1. ✅ **Separate Supabase projects** for UAT and PRD
2. ✅ **Required reviewers** on production GitHub Environment
3. ✅ **WAF enabled** on UAT and PRD
4. ✅ **OIDC authentication** (no long-lived AWS keys)
5. ✅ **S3 versioning** enabled (rollback capability)
6. ✅ **CloudWatch alarms** for error monitoring
7. ✅ **Secrets rotation** quarterly
8. ✅ **Audit logs** via CloudTrail

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| `AccessDenied` on deploy | Verify `AWS_ROLE_ARN_*` secret is correct and OIDC provider exists |
| CloudFront shows 403 | Check S3 bucket policy allows CloudFront OAI access |
| DNS not resolving | Verify Route 53 record points to CloudFront distribution |
| Build fails | Check all `VITE_*` secrets are set in GitHub |
| Deployment stuck | CloudFront invalidation can take 5-10 minutes |

---

## Next Steps

1. ✅ Set up monitoring dashboards in CloudWatch
2. ✅ Configure SNS topics for alarm notifications
3. ✅ Document runbooks for common incidents
4. ✅ Schedule regular security audits
5. ✅ Plan disaster recovery drills

---

## References

- [AWS-DEPLOYMENT-GUIDE.md](./AWS-DEPLOYMENT-GUIDE.md) — Quick start
- [CI-CD-PIPELINE.md](./CI-CD-PIPELINE.md) — Full pipeline docs
- [.github/SECRETS.md](./.github/SECRETS.md) — Secrets reference
- [Terraform AWS Provider](https://registry.terraform.io/providers/hashicorp/aws/latest/docs)
- [GitHub Actions OIDC](https://docs.github.com/en/actions/deployment/security-hardening-your-deployments/configuring-openid-connect-in-amazon-web-services)
