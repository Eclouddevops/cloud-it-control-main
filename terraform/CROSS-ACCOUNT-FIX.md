# Cross-Account IAM Role Fix

This fix resolves the `sts:TagSession` permission error when assuming roles across AWS accounts.

## Problem
```
Error: Could not assume role with user credentials: User: arn:aws:iam::226563001214:user/santosh.mirajkar@timesgroup.com is not authorized to perform: sts:TagSession on resource: arn:aws:iam::713678752742:role/OrganizationAccountAccessRole
```

## Solution
Created an IAM role with proper trust policy that includes `sts:TagSession` permission.

## Files Modified/Created

1. **iam-role.tf** - New IAM role with TagSession permissions
2. **main.tf** - Removed assume_role from provider configuration
3. **outputs.tf** - Added output for the new role ARN
4. **deploy-cross-account.sh** - Linux/Mac deployment script
5. **deploy-cross-account.bat** - Windows deployment script

## Deployment Steps

### Option 1: Using Deployment Scripts

**Windows:**
```cmd
cd terraform
deploy-cross-account.bat dev
```

**Linux/Mac:**
```bash
cd terraform
chmod +x deploy-cross-account.sh
./deploy-cross-account.sh dev
```

### Option 2: Manual Deployment

1. **First, create the IAM role:**
```bash
terraform init
terraform plan -var="environment=dev" -target=aws_iam_role.organization_access_role
terraform apply -var="environment=dev" -target=aws_iam_role.organization_access_role -auto-approve
```

2. **Assume the role:**
```bash
aws sts assume-role \
  --role-arn arn:aws:iam::713678752742:role/OrganizationAccountAccessRole \
  --role-session-name TerraformDeployment
```

3. **Export the temporary credentials and run full deployment:**
```bash
export AWS_ACCESS_KEY_ID=<access_key_from_step_2>
export AWS_SECRET_ACCESS_KEY=<secret_key_from_step_2>
export AWS_SESSION_TOKEN=<session_token_from_step_2>

terraform plan -var="environment=dev"
terraform apply -var="environment=dev" -auto-approve
```

## IAM Role Configuration

The new role includes:
- Trust policy allowing the source account user and root
- `sts:AssumeRole` and `sts:TagSession` permissions
- AdministratorAccess policy (adjust as needed)
- Regional restriction for security

## Security Notes

- The role currently has AdministratorAccess - consider using least privilege principles
- Regional restriction is applied to limit access scope
- Session tagging is now properly supported
- Consider adding MFA requirements for production environments

## Troubleshooting

If you still encounter issues:

1. Verify the user exists in account 226563001214
2. Check that the role exists in account 713678752742
3. Ensure AWS CLI is configured with correct profile
4. Verify the user has permission to assume roles

## Next Steps

After successful deployment:
1. Review and restrict IAM permissions as needed
2. Add MFA requirements for production
3. Set up proper logging and monitoring
4. Consider using AWS Organizations SCPs for additional security