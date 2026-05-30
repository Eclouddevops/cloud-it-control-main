# Cross-Account Role Assumption Error Fix

## Current Error Analysis

The error shows:
```
User: arn:aws:sts::713678752742:assumed-role/OrganizationAccountAccessRole/botocore-session-1779988380 is not authorized to perform: sts:AssumeRole on resource: arn:aws:iam::713678752742:role/OrganizationAccountAccessRole
```

**Problem**: You're trying to assume the role from within the same account (713678752742), but the role is designed for cross-account access from account 226563001214.

## Solutions

### Solution 1: Test from Correct Account (Recommended)

The role assumption should be tested from the **source account (226563001214)**:

1. **Configure AWS credentials for account 226563001214**
2. **Run the test**:
   ```bash
   aws sts assume-role \
       --role-arn arn:aws:iam::713678752742:role/OrganizationAccountAccessRole \
       --role-session-name test-session
   ```

### Solution 2: Update Trust Policy for Self-Assumption (If Needed)

If you need the role to be assumable from within the same account, update the trust policy:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "AWS": [
          "arn:aws:iam::226563001214:user/santosh.mirajkar@timesgroup.com",
          "arn:aws:iam::226563001214:root",
          "arn:aws:iam::713678752742:root"
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

**Apply the update**:
```bash
aws iam update-assume-role-policy \
    --role-name OrganizationAccountAccessRole \
    --policy-document file://iam-trust-policy-updated.json
```

### Solution 3: Use Proper Testing Script

Run the appropriate test script:

**Windows**:
```cmd
test-role-assumption.bat
```

**Linux/Mac**:
```bash
chmod +x test-role-assumption.sh
./test-role-assumption.sh
```

## Expected Workflow

1. **Account 226563001214** (Source)
   - User: `santosh.mirajkar@timesgroup.com`
   - Action: Assumes role in target account

2. **Account 713678752742** (Target)  
   - Role: `OrganizationAccountAccessRole`
   - Action: Allows assumption from source account

## Verification Steps

### From Target Account (713678752742)
```bash
# Check if role exists
aws iam get-role --role-name OrganizationAccountAccessRole

# Check trust policy
aws iam get-role --role-name OrganizationAccountAccessRole --query 'Role.AssumeRolePolicyDocument'
```

### From Source Account (226563001214)
```bash
# Test role assumption
aws sts assume-role \
    --role-arn arn:aws:iam::713678752742:role/OrganizationAccountAccessRole \
    --role-session-name test-session
```

## GitHub Actions Impact

Once the cross-account role assumption works from account 226563001214, your GitHub Actions workflow will work because:

1. GitHub Actions uses credentials from account 226563001214
2. It assumes the role in account 713678752742
3. Deploys resources in the target account

## Next Steps

1. **Configure AWS CLI for source account (226563001214)**
2. **Run role assumption test**
3. **If successful, run GitHub Actions workflow**
4. **Deploy your infrastructure**

The key is testing from the **correct source account**, not from within the target account where the role exists.