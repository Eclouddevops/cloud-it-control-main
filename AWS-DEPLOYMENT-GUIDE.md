# AWS Deployment Setup Guide

Quick start guide for deploying Cloud IT Control to AWS.

## Prerequisites

- AWS Account with appropriate permissions
- GitHub repository access
- Domain name with Route 53 hosted zone
- ACM SSL certificate

## Quick Setup (5 minutes)

### 1. Get AWS Details

```bash
# Your AWS Account ID
aws sts get-caller-identity --query Account --output text

# Your Route 53 Hosted Zone ID
aws route53 list-hosted-zones-by-name --query HostedZones[0].Id --output text

# Your ACM Certificate ARN
aws acm list-certificates --region us-east-1 --query CertificateSummaryList[0].CertificateArn --output text
```

### 2. Deploy Infrastructure

**Using Terraform (Recommended):**

```bash
cd terraform
cp terraform.tfvars.example terraform.tfvars

# Edit terraform.tfvars with your values

terraform init \
    -backend-config="bucket=cloud-it-control-tf-state-dev" \
    -backend-config="key=dev/terraform.tfstate" \
    -backend-config="region=us-east-1"

terraform apply
```

**Using CloudFormation:**

```bash
cd infrastructure
./deploy-cloudformation.sh dev us-east-1 dev.example.com Z1234567890ABC arn:aws:acm:us-east-1:123456789012:certificate/xxxxx
```

### 3. Configure GitHub Secrets

In your GitHub repository, add these secrets:

```
AWS_ROLE_ARN = <from terraform output>
VITE_SUPABASE_PROJECT_ID = yvzekynyerwbcfqslkfb
VITE_SUPABASE_URL = https://yvzekynyerwbcfqslkfb.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY = <your key>
AWS_S3_BUCKET_DEV = <from terraform output>
AWS_CLOUDFRONT_DISTRIBUTION_DEV = <from terraform output>
```

### 4. Deploy

```bash
git push origin develop
# Watch GitHub Actions for deployment progress
```

## Infrastructure Overview

```
GitHub → GitHub Actions → AWS
                              ├─ S3 (Frontend files)
                              ├─ CloudFront (CDN)
                              ├─ Route 53 (DNS)
                              └─ CloudWatch (Monitoring)
```

## Files Reference

| File | Purpose |
|------|---------|
| `.github/workflows/deploy.yml` | Main deployment workflow |
| `.github/workflows/test.yml` | Code quality checks |
| `terraform/main.tf` | Terraform infrastructure code |
| `infrastructure/cloudformation-template.yaml` | CloudFormation template |
| `infrastructure/deploy-terraform.sh` | Terraform deployment script |
| `infrastructure/deploy-cloudformation.sh` | CloudFormation deployment script |
| `CI-CD-PIPELINE.md` | Full documentation |

## Troubleshooting

### OIDC Provider Error

If you get "Provider not found" error:

```bash
aws iam create-open-id-connect-provider \
    --url https://token.actions.githubusercontent.com \
    --client-id-list sts.amazonaws.com \
    --thumbprint-list 6938fd4d98bab03faadb97b34396831e3780aea1
```

### Deployment Stuck in CloudFront

CloudFront cache invalidation can take a few minutes. Website should be live shortly.

### S3 Access Denied

Verify IAM role has S3:PutObject permission and bucket policy allows CloudFront access.

## Next Steps

1. Set up monitoring alerts
2. Configure custom domain
3. Enable CloudFront caching policies
4. Set up log analysis
5. Configure backup strategy

## Support

See `CI-CD-PIPELINE.md` for comprehensive documentation.
