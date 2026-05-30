# IAM Role Creation Commands

## Prerequisites
- AWS CLI configured for account **713678752742** (target account)
- IAM permissions to create roles and attach policies

## Quick Commands

### 1. Create the IAM Role
```bash
aws iam create-role \
    --role-name OrganizationAccountAccessRole \
    --assume-role-policy-document file://iam-trust-policy.json \
    --description "Cross-account role with TagSession permissions for Terraform deployments"
```

### 2. Attach Administrator Policy
```bash
aws iam attach-role-policy \
    --role-name OrganizationAccountAccessRole \
    --policy-arn arn:aws:iam::aws:policy/AdministratorAccess
```

### 3. Verify Role Creation
```bash
aws iam get-role --role-name OrganizationAccountAccessRole
```

### 4. Test Role Assumption (from source account 226563001214)
```bash
aws sts assume-role \
    --role-arn arn:aws:iam::713678752742:role/OrganizationAccountAccessRole \
    --role-session-name test-session
```

## Alternative: One-Line Creation

If you prefer to create the role with inline policy:

```bash
aws iam create-role \
    --role-name OrganizationAccountAccessRole \
    --assume-role-policy-document '{
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
    }' \
    --description "Cross-account role with TagSession permissions"
```

## Update Existing Role (if role already exists)

If the role exists but has wrong trust policy:

### 1. Update Trust Policy
```bash
aws iam update-assume-role-policy \
    --role-name OrganizationAccountAccessRole \
    --policy-document file://iam-trust-policy.json
```

### 2. Ensure Policy is Attached
```bash
aws iam attach-role-policy \
    --role-name OrganizationAccountAccessRole \
    --policy-arn arn:aws:iam::aws:policy/AdministratorAccess
```

## Verification Commands

### Check if role exists
```bash
aws iam get-role --role-name OrganizationAccountAccessRole
```

### List attached policies
```bash
aws iam list-attached-role-policies --role-name OrganizationAccountAccessRole
```

### Get trust policy
```bash
aws iam get-role --role-name OrganizationAccountAccessRole --query 'Role.AssumeRolePolicyDocument'
```

## Files Required

1. **iam-trust-policy.json** - Trust policy with TagSession permissions (already created)
2. **create-iam-role.sh** - Linux/Mac script (already created)
3. **create-iam-role.bat** - Windows script (already created)

## Expected Output

After successful creation, you should see:
- Role ARN: `arn:aws:iam::713678752742:role/OrganizationAccountAccessRole`
- Trust policy includes `sts:TagSession` action
- AdministratorAccess policy attached

## Troubleshooting

### Error: "Role already exists"
```bash
# Update the existing role instead
aws iam update-assume-role-policy \
    --role-name OrganizationAccountAccessRole \
    --policy-document file://iam-trust-policy.json
```

### Error: "Access denied"
- Ensure you're authenticated to account 713678752742
- Verify you have IAM permissions to create roles

### Error: "Invalid policy document"
- Check that iam-trust-policy.json exists and is valid JSON
- Verify the file path is correct

## Next Steps

After role creation:
1. Test role assumption from source account
2. Run your GitHub Actions workflow
3. Deploy infrastructure using the cross-account role

The original `sts:TagSession` error should now be resolved!