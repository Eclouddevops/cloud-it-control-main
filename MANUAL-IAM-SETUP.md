# Manual IAM Role Creation Guide

Since automated tools are not available in the current environment, here's how to create the IAM role manually:

## Option 1: AWS Console (Recommended)

### Step 1: Login to AWS Console
- Login to AWS Console for account **713678752742** (target account)
- Go to **IAM** → **Roles** → **Create Role**

### Step 2: Configure Trust Relationship
1. Select **"Another AWS account"**
2. **Account ID**: `226563001214`
3. **Do NOT check** "Require MFA" (optional)
4. Click **Next**

### Step 3: Attach Permissions
1. Search for and select: **AdministratorAccess**
2. Click **Next**

### Step 4: Name and Create
1. **Role name**: `OrganizationAccountAccessRole`
2. **Description**: `Cross-account role with TagSession permissions for Terraform deployments`
3. Click **Create Role**

### Step 5: Edit Trust Policy
1. Go to the created role
2. Click **Trust relationships** tab
3. Click **Edit trust policy**
4. Replace the policy with:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "AWS": [
          "arn:aws:iam::226563001214:user/santosh.mirajkar@timesgroup.com",
          "arn:aws:iam::226563001214:root"
        ]
      },
      "Action": [
        "sts:AssumeRole",
        "sts:TagSession"
      ],
      "Condition": {
        "StringEquals": {
          "sts:RequestedRegion": "ap-south-1"
        }
      }
    }
  ]
}
```

5. Click **Update policy**

## Option 2: AWS CLI (If Available)

If you have AWS CLI configured for account 713678752742:

```bash
# Deploy the CloudFormation template
aws cloudformation create-stack \
  --stack-name cross-account-iam-role \
  --template-body file://cloudformation-iam-role.yaml \
  --capabilities CAPABILITY_NAMED_IAM \
  --parameters ParameterKey=SourceAccountId,ParameterValue=226563001214 \
             ParameterKey=SourceUserName,ParameterValue=santosh.mirajkar@timesgroup.com \
             ParameterKey=AWSRegion,ParameterValue=ap-south-1

# Check stack status
aws cloudformation describe-stacks --stack-name cross-account-iam-role

# Get outputs
aws cloudformation describe-stacks \
  --stack-name cross-account-iam-role \
  --query 'Stacks[0].Outputs'
```

## Option 3: Terraform (If Available)

If you have Terraform and AWS CLI available:

```bash
cd terraform

# Initialize Terraform
terraform init

# Plan the bootstrap
terraform plan -target=aws_iam_role.organization_access_role \
               -target=aws_iam_role_policy_attachment.admin_access \
               -out=bootstrap.tfplan

# Apply the bootstrap
terraform apply bootstrap.tfplan

# Get outputs
terraform output
```

## Verification Steps

After creating the role, test it from the source account (226563001214):

```bash
# Test role assumption
aws sts assume-role \
  --role-arn arn:aws:iam::713678752742:role/OrganizationAccountAccessRole \
  --role-session-name test-session

# If successful, you'll get temporary credentials
```

## Next Steps

Once the role is created and tested:

1. **GitHub Actions**: Use the "Cross-Account Infrastructure Deploy" workflow
2. **Local Deployment**: Run the deployment scripts
3. **Verify**: The original error should be resolved

## Key Points

- **Target Account**: 713678752742 (where role is created)
- **Source Account**: 226563001214 (where user exists)
- **Role Name**: OrganizationAccountAccessRole
- **Key Permission**: sts:TagSession (this fixes the original error)
- **Region**: ap-south-1

## Files Available

- `cloudformation-iam-role.yaml` - CloudFormation template
- `bootstrap-iam-role.tf` - Terraform configuration
- `bootstrap-automode.ps1` - PowerShell automation script
- `IAM-ROLE-TROUBLESHOOTING.md` - Detailed troubleshooting guide

Choose the method that works best with your available tools and access level.