# Cross-Account IAM Role Troubleshooting Guide

## Current Error
```
Error: Could not assume role with user credentials: User: arn:aws:iam::226563001214:user/santosh.mirajkar@timesgroup.com is not authorized to perform: sts:TagSession on resource: arn:aws:iam::713678752742:role/OrganizationAccountAccessRole
```

## Root Cause
The IAM role `OrganizationAccountAccessRole` either:
1. **Doesn't exist** in the target account (713678752742), OR
2. **Exists but has incorrect trust policy** (missing `sts:TagSession` permission)

## Solution Steps

### Step 1: Bootstrap the IAM Role

You need to create the IAM role in the target account (713678752742) first.

**Prerequisites:**
- AWS credentials configured for account **713678752742**
- Terraform installed
- Access to create IAM roles in the target account

**Windows:**
```cmd
cd terraform
bootstrap-iam-role.bat
```

**Linux/Mac:**
```bash
cd terraform
chmod +x bootstrap-iam-role.sh
./bootstrap-iam-role.sh
```

### Step 2: Verify AWS Credentials

Make sure you're authenticated to the **target account (713678752742)**:

```bash
aws sts get-caller-identity
```

Expected output:
```json
{
    "UserId": "...",
    "Account": "713678752742",
    "Arn": "arn:aws:iam::713678752742:user/your-user"
}
```

### Step 3: Alternative - Manual Role Creation

If you can't run Terraform, create the role manually in AWS Console:

1. **Go to AWS Console** → IAM → Roles → Create Role
2. **Select "Another AWS account"**
3. **Account ID**: `226563001214`
4. **Check "Require MFA"** (optional)
5. **Attach Policy**: `AdministratorAccess`
6. **Role Name**: `OrganizationAccountAccessRole`
7. **Edit Trust Policy** to include `sts:TagSession`:

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

### Step 4: Test Role Assumption

After creating the role, test it:

```bash
aws sts assume-role \
  --role-arn arn:aws:iam::713678752742:role/OrganizationAccountAccessRole \
  --role-session-name test-session
```

If successful, you'll get temporary credentials.

### Step 5: Run Main Deployment

Once the role exists and works, run your main deployment:

**GitHub Actions:**
- Use the "Cross-Account Infrastructure Deploy" workflow
- It will now work because the role exists

**Local Deployment:**
```cmd
cd terraform
deploy-cross-account.bat dev
```

## Common Issues & Solutions

### Issue 1: "Role does not exist"
**Solution:** Run the bootstrap script first to create the role

### Issue 2: "Access Denied" 
**Solution:** Verify you're authenticated to the correct AWS account (713678752742)

### Issue 3: "Invalid trust policy"
**Solution:** The bootstrap script creates the correct trust policy with `sts:TagSession`

### Issue 4: "Region mismatch"
**Solution:** Ensure you're using `ap-south-1` region consistently

## Account Summary

| Account | ID | Purpose | User/Role |
|---------|----|---------|-----------| 
| Source | 226563001214 | Authentication | santosh.mirajkar@timesgroup.com |
| Target | 713678752742 | Resource Deployment | OrganizationAccountAccessRole |

## Files Created for Bootstrap

1. `bootstrap-iam-role.tf` - Terraform configuration for the IAM role
2. `bootstrap-iam-role.bat` - Windows bootstrap script
3. `bootstrap-iam-role.sh` - Linux bootstrap script
4. `IAM-ROLE-TROUBLESHOOTING.md` - This troubleshooting guide

## Next Steps After Bootstrap

1. ✅ Create the IAM role (bootstrap)
2. ✅ Test role assumption
3. ✅ Run main deployment via GitHub Actions
4. ✅ Deploy your application

The bootstrap process only needs to be run **once per AWS account**. After that, all deployments will work normally.