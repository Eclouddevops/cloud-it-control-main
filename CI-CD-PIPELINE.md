# CI/CD Pipeline Documentation

## Overview

This document describes the CI/CD pipeline setup for Cloud IT Control, a React + TypeScript application deployed on AWS.

## Architecture

```
GitHub Repository
       ↓
GitHub Actions Workflow
       ├─ Build & Test
       ├─ Security Scanning
       └─ Deploy to AWS
            ├─ S3 Upload
            ├─ CloudFront Invalidation
            └─ Supabase Migrations
```

## Deployment Environments

The pipeline supports three deployment environments:

### Development (`develop` branch)
- S3 Bucket: `cloud-it-control-dev-{account-id}`
- CloudFront Distribution: Dev Distribution
- Domain: `dev.example.com`
- Cache Duration: Short (for testing)
- WAF: Disabled

### Staging (`staging` branch)
- S3 Bucket: `cloud-it-control-staging-{account-id}`
- CloudFront Distribution: Staging Distribution
- Domain: `staging.example.com`
- Cache Duration: Medium
- WAF: Enabled

### Production (`main` branch)
- S3 Bucket: `cloud-it-control-prod-{account-id}`
- CloudFront Distribution: Production Distribution
- Domain: `app.example.com`
- Cache Duration: Long
- WAF: Enabled
- Additional: Monitoring and alerting enabled

## GitHub Actions Workflows

### 1. Test Workflow (`.github/workflows/test.yml`)

Runs on every push and pull request to validate code quality:

- **Lint**: ESLint code quality checks
- **Type Check**: TypeScript type validation
- **Build Check**: Verify build succeeds
- **Dependency Security**: Check for vulnerable dependencies

### 2. Deploy Workflow (`.github/workflows/deploy.yml`)

Runs on push to main/develop/staging branches:

#### Stages:
1. **Build**: Compiles React application with Vite
2. **Test**: Runs test suite
3. **Security Scan**: Trivy vulnerability scanning
4. **Deploy**: Uploads to S3 and invalidates CloudFront cache

## Setup Instructions

### Prerequisites

1. **AWS Account**
   - AWS CLI configured with appropriate credentials
   - Hosted Zone in Route 53
   - ACM Certificate for your domain

2. **GitHub Account**
   - Repository with this code
   - Admin access to configure secrets

3. **Supabase Project**
   - Project ID
   - Publishable Key
   - Database credentials

### Step 1: Deploy AWS Infrastructure

#### Option A: Using Terraform (Recommended)

```bash
cd terraform

# Copy and edit the example configuration
cp terraform.tfvars.example terraform.tfvars
# Edit terraform.tfvars with your values

# Initialize Terraform
terraform init \
    -backend-config="bucket=cloud-it-control-tf-state-dev" \
    -backend-config="key=dev/terraform.tfstate" \
    -backend-config="region=us-east-1"

# Plan and apply
terraform plan
terraform apply
```

#### Option B: Using CloudFormation

```bash
cd infrastructure

./deploy-cloudformation.sh dev us-east-1 dev.example.com Z1234567890ABC arn:aws:acm:...
```

### Step 2: Configure GitHub Secrets

Add the following secrets to your GitHub repository (Settings → Secrets and variables → Actions):

```
# AWS Credentials (OIDC)
AWS_ROLE_ARN=arn:aws:iam::ACCOUNT_ID:role/github-actions-cloudform-dev

# Supabase Configuration
VITE_SUPABASE_PROJECT_ID=your-project-id
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=your-publishable-key

# S3 Buckets
AWS_S3_BUCKET_DEV=cloud-it-control-dev-ACCOUNT_ID
AWS_S3_BUCKET_STAGING=cloud-it-control-staging-ACCOUNT_ID
AWS_S3_BUCKET_PROD=cloud-it-control-prod-ACCOUNT_ID

# CloudFront Distribution IDs
AWS_CLOUDFRONT_DISTRIBUTION_DEV=E1234567890ABC
AWS_CLOUDFRONT_DISTRIBUTION_STAGING=E0987654321XYZ
AWS_CLOUDFRONT_DISTRIBUTION_PROD=E1111111111111

# Database
SUPABASE_PROJECT_ID=your-project-id
SUPABASE_DB_PASSWORD=your-secure-password
```

### Step 3: Create OIDC Identity Provider

GitHub Actions uses OpenID Connect for secure authentication:

```bash
# Create OIDC provider (if not already created)
aws iam create-open-id-connect-provider \
    --url https://token.actions.githubusercontent.com \
    --client-id-list sts.amazonaws.com \
    --thumbprint-list 6938fd4d98bab03faadb97b34396831e3780aea1
```

## Environment Variables

### Build-Time Variables (`.env`)

```env
VITE_SUPABASE_PROJECT_ID=your-project-id
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=your-key
```

### GitHub Secrets

See the "Configure GitHub Secrets" section above.

## AWS Resources Created

### Using Terraform/CloudFormation:

1. **S3 Bucket**
   - Frontend application files
   - Versioning enabled
   - Access logs to separate bucket
   - Server-side encryption

2. **CloudFront Distribution**
   - Origin: S3 Bucket via OAI
   - Custom domain with ACM certificate
   - Cache behaviors optimized by file type
   - SPA routing (404 → index.html)
   - HTTP/2 and HTTP/3 support
   - Compression enabled

3. **Route 53 DNS**
   - Alias record pointing to CloudFront
   - No additional costs for DNS queries

4. **AWS WAF** (Production only)
   - Rate limiting (2000 requests/5 minutes per IP)
   - AWS Managed Rules for common exploits
   - Logged to CloudWatch

5. **CloudWatch**
   - Log groups for CloudFront access logs
   - Alarms for:
     - High origin latency
     - High 4XX error rate
     - High 5XX error rate

6. **Secrets Manager**
   - Encrypted application secrets
   - Automatic rotation support

## Deployment Process

### Automatic Deployment (via GitHub Actions)

1. **Code Push**
   ```bash
   git push origin main
   ```

2. **GitHub Actions Triggers**
   - Checks out code
   - Installs dependencies
   - Runs linting and type checking
   - Builds application
   - Runs security scans
   - Deploys to AWS

3. **Deployment Steps**
   - Uploads build artifacts to S3
   - Invalidates CloudFront cache
   - Runs Supabase migrations
   - Creates GitHub deployment record

### Manual Deployment

If needed, manually deploy a build:

```bash
# Build locally
bun install
bun run build

# Deploy to S3
aws s3 sync dist/ s3://cloud-it-control-dev-ACCOUNT_ID/ --delete

# Invalidate CloudFront
aws cloudfront create-invalidation \
    --distribution-id E1234567890ABC \
    --paths "/*"
```

## Supabase Migrations

Supabase migrations run automatically during deployment. To apply migrations manually:

```bash
# Install Supabase CLI
brew install supabase/tap/supabase

# Login to Supabase
supabase login

# Link to your project
supabase link --project-ref yvzekynyerwbcfqslkfb

# Push migrations
supabase db push

# Check status
supabase migration list
```

## Monitoring and Troubleshooting

### CloudWatch Logs

View CloudFront access logs:
```bash
aws logs tail /aws/cloudfront/cloud-it-control-dev --follow
```

### CloudFront Distribution

Check distribution status:
```bash
aws cloudfront get-distribution --id E1234567890ABC
```

### S3 Bucket

List bucket contents:
```bash
aws s3 ls s3://cloud-it-control-dev-ACCOUNT_ID/ --recursive
```

### GitHub Actions Logs

Check deployment logs:
1. Go to GitHub repository
2. Click "Actions" tab
3. Click on the workflow run
4. Check "Deploy to AWS" step for details

## Cost Estimation

### Monthly Costs (Approximate)

**Development Environment**:
- S3: $0.5 (minimal traffic)
- CloudFront: $0.085/GB (first 10TB)
- Total: ~$5-10/month

**Production Environment**:
- S3: $5-20 (depending on traffic)
- CloudFront: $0.085/GB (first 10TB)
- WAF: $5/month
- Total: ~$30-50/month (varies with traffic)

**Optimization Tips**:
- Use S3 lifecycle policies to delete old versions
- Enable CloudFront caching for static assets
- Use CloudFront geographic restrictions if needed
- Monitor CloudWatch alarms for anomalies

## Best Practices

### Security

1. **Secrets Management**
   - Never commit secrets to version control
   - Use GitHub Secrets for sensitive data
   - Rotate credentials regularly
   - Use OIDC for AWS authentication (no long-lived credentials)

2. **Access Control**
   - Use IAM roles with least privilege
   - Enable MFA for AWS accounts
   - Regularly audit IAM permissions

3. **Infrastructure**
   - Enable versioning on S3 buckets
   - Use CloudFront to protect origin
   - Enable WAF in production
   - Implement DDoS protection

### Performance

1. **Caching Strategy**
   - Cache assets with version hashes for 1 year
   - Cache HTML files with short TTL (5 minutes)
   - Use CloudFront compression
   - Enable HTTP/2 and HTTP/3

2. **Optimization**
   - Minimize bundle size
   - Use lazy loading for routes
   - Compress images
   - Remove unused dependencies

3. **Monitoring**
   - Set up CloudWatch alarms
   - Monitor error rates and latency
   - Track deployment frequency
   - Monitor costs regularly

## Rollback Procedure

If deployment causes issues:

### Rollback using CloudFront Invalidation

```bash
# Invalidate cache to force reload
aws cloudfront create-invalidation \
    --distribution-id E1234567890ABC \
    --paths "/*"
```

### Rollback to Previous Version

```bash
# List S3 versions
aws s3api list-object-versions \
    --bucket cloud-it-control-dev-ACCOUNT_ID

# Restore previous version
aws s3api copy-object \
    --copy-source cloud-it-control-dev-ACCOUNT_ID/index.html?versionId=OLD_VERSION_ID \
    --bucket cloud-it-control-dev-ACCOUNT_ID \
    --key index.html
```

## Support and Troubleshooting

### Common Issues

1. **Deployment fails with "Access Denied"**
   - Check OIDC provider is configured correctly
   - Verify GitHub Actions role has S3 and CloudFront permissions
   - Check AWS_ROLE_ARN secret is correct

2. **Website shows old content after deployment**
   - CloudFront cache invalidation might be pending
   - Check CloudFront distribution status
   - Manually clear browser cache (Ctrl+Shift+Delete)

3. **Build fails with missing environment variables**
   - Ensure all VITE_* variables are set in GitHub Secrets
   - Check variable names match exactly (case-sensitive)

### Getting Help

1. Check GitHub Actions logs for detailed error messages
2. Review AWS CloudFormation events for infrastructure issues
3. Consult AWS documentation for service-specific issues
4. Check Supabase documentation for database issues

## References

- [AWS CloudFront Documentation](https://docs.aws.amazon.com/cloudfront/)
- [AWS S3 Documentation](https://docs.aws.amazon.com/s3/)
- [Terraform AWS Provider](https://registry.terraform.io/providers/hashicorp/aws/latest)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Supabase Documentation](https://supabase.com/docs)
