#!/bin/bash

echo "=== Cross-Account Role Assumption Test ==="
echo

# Check current account
CURRENT_ACCOUNT=$(aws sts get-caller-identity --query Account --output text 2>/dev/null)
CURRENT_USER=$(aws sts get-caller-identity --query Arn --output text 2>/dev/null)

echo "Current Account: $CURRENT_ACCOUNT"
echo "Current User/Role: $CURRENT_USER"
echo

# Determine what to do based on current account
if [ "$CURRENT_ACCOUNT" = "226563001214" ]; then
    echo "✅ You are in the SOURCE account (226563001214)"
    echo "This is correct for testing role assumption"
    echo
    
    echo "Testing role assumption..."
    aws sts assume-role \
        --role-arn arn:aws:iam::713678752742:role/OrganizationAccountAccessRole \
        --role-session-name test-session-$(date +%s)
    
    if [ $? -eq 0 ]; then
        echo "✅ Role assumption successful!"
        echo "The cross-account setup is working correctly."
    else
        echo "❌ Role assumption failed."
        echo "Check if the role exists and has correct trust policy."
    fi

elif [ "$CURRENT_ACCOUNT" = "713678752742" ]; then
    echo "⚠️  You are in the TARGET account (713678752742)"
    echo "You cannot test cross-account role assumption from here."
    echo
    echo "To test properly:"
    echo "1. Configure AWS credentials for source account (226563001214)"
    echo "2. Run this test again"
    echo
    echo "Alternative: Check if role exists and has correct trust policy"
    echo
    
    # Check if role exists
    echo "Checking if OrganizationAccountAccessRole exists..."
    aws iam get-role --role-name OrganizationAccountAccessRole --query 'Role.{RoleName:RoleName,Arn:Arn}' --output table 2>/dev/null
    
    if [ $? -eq 0 ]; then
        echo "✅ Role exists"
        echo
        echo "Checking trust policy..."
        TRUST_POLICY=$(aws iam get-role --role-name OrganizationAccountAccessRole --query 'Role.AssumeRolePolicyDocument' --output json)
        echo "$TRUST_POLICY" | jq '.'
        
        # Check if TagSession is in the policy
        if echo "$TRUST_POLICY" | grep -q "sts:TagSession"; then
            echo "✅ Trust policy includes sts:TagSession"
        else
            echo "❌ Trust policy missing sts:TagSession"
            echo "Run: aws iam update-assume-role-policy --role-name OrganizationAccountAccessRole --policy-document file://iam-trust-policy.json"
        fi
    else
        echo "❌ Role does not exist"
        echo "Run: ./create-iam-role.sh"
    fi

else
    echo "❌ Unknown account: $CURRENT_ACCOUNT"
    echo "Expected accounts:"
    echo "  - Source: 226563001214 (for testing role assumption)"
    echo "  - Target: 713678752742 (for creating the role)"
fi

echo
echo "=== Test Complete ==="