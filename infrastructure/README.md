# Infrastructure as Code - README

This directory contains Infrastructure as Code (IaC) for deploying Cloud IT Control to AWS.

## Directory Structure

```
infrastructure/
├── cloudformation-template.yaml      # CloudFormation template
├── deploy-cloudformation.sh          # CloudFormation deployment script
├── deploy-terraform.sh               # Terraform deployment script
├── setup.sh                          # Initial setup script
└── README.md                         # This file

../terraform/
├── main.tf                           # Main Terraform configuration
├── variables.tf                      # Input variables
├── outputs.tf                        # Output values
├── backend.tf                        # Backend configuration
├── terraform.tfvars.dev              # Dev environment variables
├── terraform.tfvars.staging          # Staging environment variables
├── terraform.tfvars.prod             # Production environment variables
├── terraform.tfvars.example          # Example configuration
└── modules/                          # Terraform modules
    ├── s3/                           # S3 bucket module
    ├── cloudfront/                   # CloudFront distribution module
    ├── route53/                      # Route 53 DNS module
    ├── monitoring/                   # CloudWatch monitoring module
    └── github-actions/               # GitHub Actions IAM module
```

## Deployment Methods

### Method 1: Terraform (Recommended)

**Advantages:**
- Version control friendly
- State management
- Module reusability
- Better for team collaboration

**Setup:**
```bash
cd terraform

# Copy template
cp terraform.tfvars.example terraform.tfvars

# Edit configuration
nano terraform.tfvars

# Initialize
terraform init \
  -backend-config="bucket=cloud-it-control-tf-state-ACCOUNT_ID" \
  -backend-config="key=dev/terraform.tfstate" \
  -backend-config="region=us-east-1"

# Deploy
terraform plan
terraform apply
```

### Method 2: CloudFormation

**Advantages:**
- AWS native
- Integrated with AWS Console
- Useful for teams familiar with AWS

**Setup:**
```bash
cd infrastructure

./deploy-cloudformation.sh dev us-east-1 dev.example.com Z123456 arn:aws:acm:...
```

## Quick Start

1. **Run Setup Script:**
   ```bash
   cd infrastructure
   chmod +x setup.sh
   ./setup.sh
   ```
   
   This will:
   - Verify AWS CLI is installed
   - Create Terraform state bucket
   - Set up OIDC provider for GitHub Actions
   - Display necessary information

2. **Configure Environment:**
   ```bash
   cd ../terraform
   cp terraform.tfvars.example terraform.tfvars
   # Edit with your values
   nano terraform.tfvars
   ```

3. **Deploy:**
   ```bash
   terraform init -backend-config="bucket=..." -backend-config="key=..." -backend-config="region=..."
   terraform plan
   terraform apply
   ```

4. **Add GitHub Secrets:**
   - Copy outputs from terraform apply
   - Add to GitHub repository Settings → Secrets

## Infrastructure Components

### AWS Resources

#### S3 Bucket
- Frontend application files
- Versioning enabled for rollback
- Public access blocked
- Server-side encryption
- Access logging

#### CloudFront Distribution
- Origin: S3 bucket via Origin Access Identity
- Custom domain with ACM certificate
- Optimized cache behaviors
- Compression enabled
- HTTP/2 and HTTP/3 support
- SPA routing (404 → index.html)
- Optional WAF protection

#### Route 53
- DNS alias record pointing to CloudFront
- Automatic health checks
- Low latency routing

#### CloudWatch
- CloudFront access logs
- Custom metrics and alarms
- Log groups with retention policies

#### IAM
- GitHub Actions OIDC role
- S3 access policy
- CloudFront invalidation permissions
- Secrets Manager read access

#### AWS WAF (Production only)
- Rate limiting per IP
- AWS Managed Rules
- Logging to CloudWatch

#### Secrets Manager
- Application secrets storage
- Encryption at rest
- Access control via IAM

## Environment-Specific Configuration

### Development
- WAF: Disabled (faster deployment)
- Caching: Short TTL for testing
- Alarms: Basic monitoring
- Cost: ~$5-10/month

### Staging
- WAF: Enabled
- Caching: Medium TTL
- Alarms: Standard monitoring
- Cost: ~$10-20/month

### Production
- WAF: Enabled with stricter rules
- Caching: Long TTL for assets
- Alarms: Comprehensive monitoring
- Cost: ~$20-50/month (varies with traffic)

## Variables Reference

### Required Variables

```hcl
aws_region              # AWS region (default: us-east-1)
environment             # Environment name: dev, staging, prod
domain_name             # Full domain name (e.g., app.example.com)
certificate_domain      # Domain for ACM certificate lookup
hosted_zone_id          # Route 53 hosted zone ID
```

### Supabase Variables

```hcl
supabase_project_id      # Your Supabase project ID
supabase_url             # Your Supabase project URL
supabase_publishable_key # Your Supabase publishable key
```

### Optional Variables

```hcl
enable_waf = true|false  # Enable AWS WAF (default: false for dev, true for prod)
```

## Outputs

After deployment, Terraform outputs:

```
cloudfront_distribution_id      # CloudFront distribution ID
cloudfront_domain_name          # CloudFront domain name
s3_bucket_name                  # S3 bucket name
s3_bucket_arn                   # S3 bucket ARN
website_url                     # Full website URL
github_actions_role_arn         # IAM role ARN for GitHub Actions
```

## Common Tasks

### View Current Stack Status
```bash
terraform show
```

### Update Stack
```bash
terraform plan
terraform apply
```

### Delete Infrastructure
```bash
# Be careful! This deletes all resources
terraform destroy
```

### Check CloudFront Distribution
```bash
aws cloudfront get-distribution --id E1234567890ABC
```

### View CloudFront Cache Invalidations
```bash
aws cloudfront list-invalidations --distribution-id E1234567890ABC
```

### Monitor Deployment
```bash
# View CloudFront logs
aws logs tail /aws/cloudfront/cloud-it-control-dev --follow

# View S3 sync progress
aws s3 sync dist/ s3://bucket-name --dryrun
```

## Troubleshooting

### "AccessDenied" on S3 sync
- Check IAM role has S3:PutObject permission
- Verify bucket policy allows CloudFront access
- Ensure OIDC token is valid

### "Certificate not found"
- ACM certificate must exist in the same region
- Certificate must have the specified domain

### "Hosted Zone not found"
- Verify Route 53 hosted zone ID
- Ensure zone is active and has proper permissions

### CloudFront returns 403
- Check S3 bucket policy
- Verify Origin Access Identity is correctly configured
- Check CloudFront origin settings

## Cost Optimization

### Reduce Costs
1. Enable S3 lifecycle policies to delete old versions
2. Use CloudFront caching for all assets
3. Compress assets before upload
4. Use geometric distribution edge locations (if applicable)
5. Monitor CloudWatch metrics for anomalies
6. Set up budget alerts

### Monitor Costs
```bash
aws ce get-cost-and-usage \
  --time-period Start=2024-01-01,End=2024-01-31 \
  --granularity MONTHLY \
  --metrics BlendedCost \
  --group-by Type=DIMENSION,Key=SERVICE
```

## Security Best Practices

1. **Enable S3 Versioning** - Automatic with this configuration
2. **Block Public Access** - Enabled on all buckets
3. **Use IAM Roles** - No long-lived credentials
4. **Enable Logging** - All access logged to CloudWatch
5. **Encrypt Data** - S3 SSE-AES256, Secrets Manager encryption
6. **Update Regularly** - Keep dependencies updated
7. **Monitor Access** - CloudWatch Logs and CloudTrail

## References

- [AWS S3 Documentation](https://docs.aws.amazon.com/s3/)
- [AWS CloudFront Documentation](https://docs.aws.amazon.com/cloudfront/)
- [Terraform AWS Provider](https://registry.terraform.io/providers/hashicorp/aws/latest)
- [AWS CloudFormation User Guide](https://docs.aws.amazon.com/cloudformation/)

## Support

For questions or issues:
1. Check CI-CD-PIPELINE.md for detailed documentation
2. Review AWS CloudFormation/Terraform documentation
3. Check GitHub Actions logs for deployment issues
4. Verify all AWS secrets and permissions
