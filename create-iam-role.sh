#!/bin/bash

# AWS CLI Commands to Create Cross-Account IAM Role
# Run these commands in the target account (713678752742)

echo "=== Creating Cross-Account IAM Role ==="
echo "Target Account: 713678752742"
echo "Source Account: 226563001214"
echo

# Step 1: Verify current account
echo "Step 1: Verifying AWS account..."
CURRENT_ACCOUNT=$(aws sts get-caller-identity --query Account --output text)
echo "Current Account: $CURRENT_ACCOUNT"

if [ "$CURRENT_ACCOUNT" != "713678752742" ]; then
    echo "WARNING: Not in target account (713678752742)"
    echo "Please configure AWS credentials for the target account"
    read -p "Continue anyway? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "Cancelled"
        exit 0
    fi
fi

# Step 2: Create IAM role
echo
echo "Step 2: Creating IAM role..."
aws iam create-role \
    --role-name OrganizationAccountAccessRole \
    --assume-role-policy-document file://iam-trust-policy.json \
    --description "Cross-account role with TagSession permissions for Terraform deployments" \
    --tags Key=Name,Value=OrganizationAccountAccessRole \
           Key=Purpose,Value="Cross-account access with TagSession support" \
           Key=SourceAccount,Value=226563001214 \
           Key=CreatedBy,Value=Script

if [ $? -eq 0 ]; then
    echo "✅ IAM role created successfully"
else
    echo "❌ Failed to create IAM role (may already exist)"
fi

# Step 3: Attach AdministratorAccess policy
echo
echo "Step 3: Attaching AdministratorAccess policy..."
aws iam attach-role-policy \
    --role-name OrganizationAccountAccessRole \
    --policy-arn arn:aws:iam::aws:policy/AdministratorAccess

if [ $? -eq 0 ]; then
    echo "✅ Policy attached successfully"
else
    echo "❌ Failed to attach policy"
fi

# Step 4: Get role details
echo
echo "Step 4: Role details..."
aws iam get-role --role-name OrganizationAccountAccessRole --query 'Role.{RoleName:RoleName,Arn:Arn,CreateDate:CreateDate}' --output table

# Step 5: Test role assumption (from source account)
echo
echo "Step 5: Test command for role assumption:"
echo "Run this from source account (226563001214):"
echo "aws sts assume-role --role-arn arn:aws:iam::713678752742:role/OrganizationAccountAccessRole --role-session-name test-session"

echo
echo "=== Role Creation Complete ==="