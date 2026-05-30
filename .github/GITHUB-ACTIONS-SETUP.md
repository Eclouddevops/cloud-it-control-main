# GitHub Actions Secrets Setup for Cross-Account Deployment

This guide explains how to configure GitHub repository secrets for the cross-account AWS deployment workflow.

## Required Repository Secrets

### AWS Credentials (Source Account: 226563001214)
These credentials are used to assume the cross-account role:

```
AWS_ACCESS_KEY_ID
AWS_SECRET_ACCESS_KEY
```

**How to get these:**
1. In AWS Console, go to IAM → Users → santosh.mirajkar@timesgroup.com
2. Go to Security credentials tab
3. Create access key → Command Line Interface (CLI)
4. Copy the Access Key ID and Secret Access Key

### Supabase Configuration
```
VITE_SUPABASE_PROJECT_ID
VITE_SUPABASE_URL  
VITE_SUPABASE_PUBLISHABLE_KEY
```

**How to get these:**
1. Go to your Supabase project dashboard
2. Settings → API
3. Copy Project ID, Project URL, and anon/public key

## Setting Up Secrets in GitHub

### Repository Level Secrets
1. Go to your GitHub repository
2. Settings → Secrets and variables → Actions
3. Click "New repository secret"
4. Add each secret with the exact name and value

### Environment Specific Secrets (Optional)
For different environments (dev, staging, production):

1. Go to Settings → Environments
2. Create environments: `development`, `staging`, `production`
3. Add environment-specific secrets if values differ

## Workflow Usage

### Using the Cross-Account Deploy Workflow

1. Go to Actions tab in GitHub
2. Select "Cross-Account Infrastructure Deploy"
3. Click "Run workflow"
4. Fill in the parameters:
   - **Environment**: dev/staging/uat/prd
   - **Action**: plan/apply/destroy
   - **AWS Region**: ap-south-1 (default)
   - **Domain Name**: your-app.example.com
   - **Certificate Domain**: *.example.com or your-app.example.com

### Workflow Phases

The workflow runs in 3 phases:

1. **Create IAM Role**: Creates the cross-account role with TagSession permissions
2. **Deploy Infrastructure**: Uses the role to deploy AWS resources
3. **Deploy Application**: Builds and deploys the React app

## Security Best Practices

### IAM User Permissions (Source Account)
The user `santosh.mirajkar@timesgroup.com` needs these permissions:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "sts:AssumeRole",
        "sts:TagSession"
      ],
      "Resource": "arn:aws:iam::713678752742:role/OrganizationAccountAccessRole"
    }
  ]
}
```

### Cross-Account Role (Target Account)
The role created by the workflow has:
- Trust policy allowing source account user
- `sts:AssumeRole` and `sts:TagSession` permissions
- AdministratorAccess policy (consider restricting for production)

## Troubleshooting

### Common Issues

1. **"User is not authorized to perform: sts:TagSession"**
   - Solution: The workflow creates the role with proper permissions

2. **"Access Denied" when assuming role**
   - Check that AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY are correct
   - Verify the user exists in source account (226563001214)

3. **"Role does not exist"**
   - Run the workflow with "plan" action first to create the role
   - Then run with "apply" action for full deployment

4. **Terraform state conflicts**
   - Each environment uses separate state files
   - State buckets are created automatically per environment

### Debugging Steps

1. Check GitHub Actions logs for detailed error messages
2. Verify all required secrets are set
3. Ensure AWS credentials have not expired
4. Check that the target AWS account (713678752742) is accessible

## Manual Testing

To test the cross-account access manually:

```bash
# Test role assumption
aws sts assume-role \
  --role-arn arn:aws:iam::713678752742:role/OrganizationAccountAccessRole \
  --role-session-name test-session

# If successful, you'll get temporary credentials
# Export them and test AWS operations:
export AWS_ACCESS_KEY_ID=<temp_access_key>
export AWS_SECRET_ACCESS_KEY=<temp_secret_key>
export AWS_SESSION_TOKEN=<temp_session_token>

aws sts get-caller-identity
```

## Environment Variables Reference

| Variable | Description | Example |
|----------|-------------|---------|
| `AWS_REGION` | Target AWS region | `ap-south-1` |
| `TF_ENV` | Environment name | `dev`, `staging`, `prd` |
| `SOURCE_ACCOUNT` | Source AWS account ID | `226563001214` |
| `TARGET_ACCOUNT` | Target AWS account ID | `713678752742` |
| `ROLE_NAME` | Cross-account role name | `OrganizationAccountAccessRole` |