@echo off
echo === Updating and Verifying Trust Policy ===
echo.

REM Update the trust policy
echo Step 1: Updating trust policy...
aws iam update-assume-role-policy --role-name OrganizationAccountAccessRole --policy-document file://iam-trust-policy.json

if %ERRORLEVEL% equ 0 (
    echo ✅ Trust policy updated successfully
) else (
    echo ❌ Failed to update trust policy
    pause
    exit /b 1
)

echo.
echo Step 2: Verifying trust policy...

REM Get and display the trust policy
echo Current trust policy:
aws iam get-role --role-name OrganizationAccountAccessRole --query "Role.AssumeRolePolicyDocument" --output json

echo.
echo Step 3: Checking for sts:TagSession...

REM Check if TagSession is in the policy
aws iam get-role --role-name OrganizationAccountAccessRole --query "Role.AssumeRolePolicyDocument" --output json | findstr "sts:TagSession" >nul

if %ERRORLEVEL% equ 0 (
    echo ✅ Trust policy includes sts:TagSession
    echo ✅ Trust policy is correctly configured
) else (
    echo ❌ Trust policy still missing sts:TagSession
    echo Check if iam-trust-policy.json contains the correct policy
)

echo.
echo Step 4: Role summary...
aws iam get-role --role-name OrganizationAccountAccessRole --query "Role.{RoleName:RoleName,Arn:Arn,CreateDate:CreateDate}" --output table

echo.
echo === Update Complete ===
echo.
echo Next steps:
echo 1. Configure AWS credentials for source account ^(226563001214^)
echo 2. Test role assumption:
echo    aws sts assume-role --role-arn arn:aws:iam::713678752742:role/OrganizationAccountAccessRole --role-session-name test

pause