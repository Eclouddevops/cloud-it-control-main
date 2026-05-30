#!/bin/bash
# Update the trust policy on OrganizationAccountAccessRole in account 713678752742
# to allow sts:TagSession for CloudTrail audit traceability.
#
# Prerequisites:
#   - AWS CLI configured with credentials that can assume into account 713678752742
#   - Or run this directly from within account 713678752742
#
# Usage:
#   ./update-trust-policy.sh

set -euo pipefail

ROLE_NAME="OrganizationAccountAccessRole"
TARGET_ACCOUNT="713678752742"
SOURCE_ACCOUNT="226563001214"

echo "Updating trust policy for role: $ROLE_NAME in account: $TARGET_ACCOUNT"
echo "Allowing sts:AssumeRole + sts:TagSession from account: $SOURCE_ACCOUNT"
echo ""

# Update the trust policy
aws iam update-assume-role-policy \
  --role-name "$ROLE_NAME" \
  --policy-document '{
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
        ]
      }
    ]
  }'

echo ""
echo "Trust policy updated successfully."
echo "Verifying..."
echo ""

# Verify the update
aws iam get-role --role-name "$ROLE_NAME" --query 'Role.AssumeRolePolicyDocument' --output json

echo ""
echo "Done. The role now allows sts:TagSession for full CloudTrail audit traceability."
