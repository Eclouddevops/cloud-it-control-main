#!/bin/bash

set -e

echo "=== Bootstrap IAM Role for Cross-Account Access ==="
echo
echo "This script creates the OrganizationAccountAccessRole in the target account"
echo "Target Account: 713678752742"
echo "Source Account: 226563001214"
echo

# Check if we're in the right directory
if [ ! -f "bootstrap-iam-role.tf" ]; then
    echo "Error: bootstrap-iam-role.tf not found"
    echo "Please run this script from the terraform directory"
    exit 1
fi

# Verify AWS credentials
echo "Verifying AWS credentials..."
CURRENT_ACCOUNT=$(aws sts get-caller-identity --query Account --output text 2>/dev/null || echo "")
if [ -z "$CURRENT_ACCOUNT" ]; then
    echo "Error: No AWS credentials configured"
    echo "Please configure AWS credentials for account 713678752742"
    exit 1
fi

echo "Current AWS Account: $CURRENT_ACCOUNT"
if [ "$CURRENT_ACCOUNT" != "713678752742" ]; then
    echo "Warning: You are not authenticated to the target account (713678752742)"
    echo "Make sure you have the correct AWS credentials configured"
    read -p "Continue anyway? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "Cancelled by user"
        exit 0
    fi
fi

echo
echo "Step 1: Initialize Terraform for bootstrap..."
terraform init -upgrade

echo
echo "Step 2: Plan the IAM role creation..."
terraform plan \
    -target=aws_iam_role.organization_access_role \
    -target=aws_iam_role_policy_attachment.admin_access \
    -out=bootstrap.tfplan

echo
echo "Step 3: Apply the IAM role creation..."
echo "WARNING: This will create the IAM role in the current AWS account"
echo "Make sure you're authenticated to account 713678752742"
echo
read -p "Continue? (y/N): " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "Cancelled by user"
    exit 0
fi

terraform apply bootstrap.tfplan

echo
echo "Step 4: Display role information..."
terraform output

echo
echo "=== Bootstrap Complete ==="
echo
echo "The OrganizationAccountAccessRole has been created successfully!"
echo
echo "Next steps:"
echo "1. Test the role assumption:"
echo "   aws sts assume-role --role-arn arn:aws:iam::713678752742:role/OrganizationAccountAccessRole --role-session-name test"
echo
echo "2. Run the main deployment:"
echo "   Use the GitHub Actions workflow or run deploy-cross-account.sh"
echo