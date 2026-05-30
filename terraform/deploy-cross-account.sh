#!/bin/bash

# Cross-Account Terraform Deployment Script
# This script handles the IAM role assumption for cross-account deployments

set -e

# Configuration
SOURCE_ACCOUNT="226563001214"
TARGET_ACCOUNT="713678752742"
ROLE_NAME="OrganizationAccountAccessRole"
SESSION_NAME="TerraformDeployment-$(date +%s)"
REGION="${AWS_REGION:-ap-south-1}"
ENVIRONMENT="${1:-dev}"

echo "=== Cross-Account Terraform Deployment ==="
echo "Source Account: $SOURCE_ACCOUNT"
echo "Target Account: $TARGET_ACCOUNT"
echo "Environment: $ENVIRONMENT"
echo "Region: $REGION"

# Step 1: First deployment to create the IAM role
echo "Step 1: Creating IAM role in target account..."
terraform init
terraform plan -var="environment=$ENVIRONMENT" -target=aws_iam_role.organization_access_role
terraform apply -var="environment=$ENVIRONMENT" -target=aws_iam_role.organization_access_role -auto-approve

# Step 2: Assume the role for subsequent deployments
echo "Step 2: Assuming role for full deployment..."
ROLE_ARN="arn:aws:iam::$TARGET_ACCOUNT:role/$ROLE_NAME"

# Get temporary credentials
TEMP_CREDS=$(aws sts assume-role \
    --role-arn "$ROLE_ARN" \
    --role-session-name "$SESSION_NAME" \
    --query 'Credentials.[AccessKeyId,SecretAccessKey,SessionToken]' \
    --output text)

if [ $? -eq 0 ]; then
    echo "Successfully assumed role: $ROLE_ARN"
    
    # Export temporary credentials
    export AWS_ACCESS_KEY_ID=$(echo $TEMP_CREDS | cut -d' ' -f1)
    export AWS_SECRET_ACCESS_KEY=$(echo $TEMP_CREDS | cut -d' ' -f2)
    export AWS_SESSION_TOKEN=$(echo $TEMP_CREDS | cut -d' ' -f3)
    
    # Step 3: Run full terraform deployment
    echo "Step 3: Running full Terraform deployment..."
    terraform plan -var="environment=$ENVIRONMENT"
    terraform apply -var="environment=$ENVIRONMENT" -auto-approve
    
    echo "=== Deployment Complete ==="
    terraform output
else
    echo "Failed to assume role. Please check permissions."
    exit 1
fi