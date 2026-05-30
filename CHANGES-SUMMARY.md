# Cross-Account IAM Fix - Changes Summary

## Problem Solved
Fixed the `sts:TagSession` permission error when assuming cross-account roles between AWS accounts 226563001214 and 713678752742.

## Files Created

### Terraform Infrastructure
- `terraform/iam-role.tf` - IAM role with TagSession permissions
- `terraform/CROSS-ACCOUNT-FIX.md` - Technical documentation
- `terraform/deploy-cross-account.sh` - Linux deployment script  
- `terraform/deploy-cross-account.bat` - Windows deployment script

### GitHub Actions
- `.github/workflows/cross-account-deploy.yml` - New 3-phase deployment workflow
- `.github/GITHUB-ACTIONS-SETUP.md` - Complete setup guide

### Utilities
- `trigger-deploy.sh` - API script to trigger deployments
- `git-push.bat` - Script to push changes to Git

## Files Modified

### Terraform
- `terraform/main.tf` - Removed assume_role from provider configuration
- `terraform/outputs.tf` - Added organization_access_role_arn output

### GitHub Actions  
- `.github/workflows/provision-and-deploy.yml` - Updated session naming

## Key Features

### Security Improvements
- Proper `sts:TagSession` permissions in IAM role trust policy
- Unique session names to prevent conflicts
- Account verification at each deployment step
- Environment-specific state management

### Deployment Workflow
1. **Phase 1**: Create IAM role with TagSession permissions
2. **Phase 2**: Assume role and deploy AWS infrastructure  
3. **Phase 3**: Build and deploy React application

### Usage Options
- GitHub Actions UI workflow dispatch
- API trigger via `trigger-deploy.sh` script
- Manual deployment via batch/shell scripts

## Required GitHub Secrets
```
AWS_ACCESS_KEY_ID                 # Source account (226563001214)
AWS_SECRET_ACCESS_KEY            # Source account credentials
VITE_SUPABASE_PROJECT_ID         # Supabase configuration
VITE_SUPABASE_URL               # Supabase URL
VITE_SUPABASE_PUBLISHABLE_KEY   # Supabase public key
```

## Next Steps
1. Run `git-push.bat` to push changes to repository
2. Set up GitHub repository secrets
3. Test deployment with "Cross-Account Infrastructure Deploy" workflow
4. Monitor deployment in GitHub Actions tab

## Account Configuration
- **Source Account**: 226563001214 (santosh.mirajkar@timesgroup.com)
- **Target Account**: 713678752742 (deployment resources)
- **Region**: ap-south-1 (Asia Pacific - Mumbai)
- **Role**: OrganizationAccountAccessRole