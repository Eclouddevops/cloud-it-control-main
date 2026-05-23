#!/bin/bash
set -e

# Deploy infrastructure to AWS using Terraform
# Usage: ./deploy-terraform.sh <environment> <region>
# Environments: dev | staging | uat | prd

ENVIRONMENT=${1:-dev}
REGION=${2:-us-east-1}

echo "=== Deploying Cloud IT Control to AWS ==="
echo "Environment: $ENVIRONMENT"
echo "Region: $REGION"

# Validate environment
if [[ ! "$ENVIRONMENT" =~ ^(dev|staging|uat|prd)$ ]]; then
    echo "Error: Environment must be dev, staging, uat, or prd"
    exit 1
fi

cd "$(dirname "$0")"

# Initialize Terraform
echo "Initializing Terraform..."
terraform init \
    -backend-config="bucket=cloud-it-control-tf-state-$ENVIRONMENT" \
    -backend-config="key=$ENVIRONMENT/terraform.tfstate" \
    -backend-config="region=$REGION"

# Validate configuration
echo "Validating Terraform configuration..."
terraform validate

# Plan deployment
echo "Planning Terraform changes..."
terraform plan \
    -var-file="terraform.tfvars.$ENVIRONMENT" \
    -out="tfplan-$ENVIRONMENT"

# Confirm before applying
read -p "Do you want to apply these changes? (yes/no): " -r
if [[ ! $REPLY =~ ^[Yy][Ee][Ss]$ ]]; then
    echo "Deployment cancelled"
    exit 1
fi

# Apply changes
echo "Applying Terraform changes..."
terraform apply "tfplan-$ENVIRONMENT"

# Show outputs
echo ""
echo "=== Deployment Complete ==="
terraform output

# Clean up plan file
rm -f "tfplan-$ENVIRONMENT"

echo ""
echo "Stack deployed successfully!"
echo "Check GitHub Actions secrets to ensure AWS_ROLE_ARN is set to the GitHub Actions role ARN"
