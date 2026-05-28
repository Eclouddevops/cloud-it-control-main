#!/bin/bash

# Setup script to initialize CI/CD infrastructure

set -e

echo "=== Cloud IT Control - CI/CD Infrastructure Setup ==="
echo ""

# Check prerequisites
echo "Checking prerequisites..."

if ! command -v aws &> /dev/null; then
    echo "❌ AWS CLI not found. Please install it from https://aws.amazon.com/cli/"
    exit 1
fi

if ! command -v terraform &> /dev/null && ! command -v cloudformation &> /dev/null; then
    echo "⚠️  Neither Terraform nor CloudFormation CLI found"
    echo "   Install Terraform from https://www.terraform.io/downloads.html"
fi

echo "✅ AWS CLI found"

# Get AWS Account Info
echo ""
echo "Getting AWS Account information..."
ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)
REGION=$(aws configure get region || echo "ap-south-1")

echo "✅ AWS Account ID: $ACCOUNT_ID"
echo "✅ AWS Region: $REGION"

# List Route 53 Hosted Zones
echo ""
echo "Route 53 Hosted Zones:"
aws route53 list-hosted-zones-by-name --query 'HostedZones[*].[Id,Name]' --output table

# List ACM Certificates
echo ""
echo "ACM Certificates:"
aws acm list-certificates --region $REGION --query 'CertificateSummaryList[*].[CertificateArn,DomainName]' --output table

# Create S3 bucket for Terraform state
echo ""
echo "Setting up Terraform state bucket..."

STATE_BUCKET="cloud-it-control-tf-state-$ACCOUNT_ID"

if aws s3 ls "s3://$STATE_BUCKET" 2>/dev/null; then
    echo "✅ State bucket already exists: $STATE_BUCKET"
else
    echo "Creating state bucket: $STATE_BUCKET..."
    aws s3 mb "s3://$STATE_BUCKET" --region $REGION
    
    # Enable versioning
    aws s3api put-bucket-versioning \
        --bucket "$STATE_BUCKET" \
        --versioning-configuration Status=Enabled \
        --region $REGION
    
    # Block public access
    aws s3api put-public-access-block \
        --bucket "$STATE_BUCKET" \
        --public-access-block-configuration \
        "BlockPublicAcls=true,IgnorePublicAcls=true,BlockPublicPolicy=true,RestrictPublicBuckets=true"
    
    echo "✅ State bucket created"
fi

# Create OIDC Provider for GitHub Actions
echo ""
echo "Setting up GitHub Actions OIDC Provider..."

OIDC_PROVIDER="token.actions.githubusercontent.com"
PROVIDER_ARN="arn:aws:iam::$ACCOUNT_ID:oidc-provider/$OIDC_PROVIDER"

if aws iam get-open-id-connect-provider --open-id-connect-provider-arn "$PROVIDER_ARN" 2>/dev/null; then
    echo "✅ OIDC Provider already exists"
else
    echo "Creating OIDC Provider..."
    aws iam create-open-id-connect-provider \
        --url https://token.actions.githubusercontent.com \
        --client-id-list sts.amazonaws.com \
        --thumbprint-list 6938fd4d98bab03faadb97b34396831e3780aea1
    
    echo "✅ OIDC Provider created"
fi

# Summary
echo ""
echo "=== Setup Complete ==="
echo ""
echo "Next Steps:"
echo "1. Copy terraform.tfvars.example to terraform.tfvars"
echo "2. Fill in terraform.tfvars with your values:"
echo "   - domain_name: your-domain.com"
echo "   - certificate_domain: your-domain.com"
echo "   - hosted_zone_id: from above"
echo ""
echo "3. Initialize Terraform:"
echo "   cd terraform"
echo "   terraform init -backend-config=\"bucket=$STATE_BUCKET\" -backend-config=\"key=dev/terraform.tfstate\" -backend-config=\"region=$REGION\""
echo ""
echo "4. Deploy infrastructure:"
echo "   terraform plan"
echo "   terraform apply"
echo ""
echo "5. Add GitHub Secrets:"
echo "   - AWS_ROLE_ARN (from terraform output)"
echo "   - AWS_S3_BUCKET_DEV (from terraform output)"
echo "   - AWS_CLOUDFRONT_DISTRIBUTION_DEV (from terraform output)"
echo "   - VITE_SUPABASE_PROJECT_ID"
echo "   - VITE_SUPABASE_URL"
echo "   - VITE_SUPABASE_PUBLISHABLE_KEY"
echo ""
echo "For more information, see CI-CD-PIPELINE.md"
