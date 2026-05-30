@echo off
REM Update the trust policy on OrganizationAccountAccessRole in account 713678752742
REM to allow sts:TagSession for CloudTrail audit traceability.
REM
REM Prerequisites:
REM   - AWS CLI configured with profile that has access to account 713678752742
REM
REM Usage:
REM   update-trust-policy.bat

echo Updating trust policy for OrganizationAccountAccessRole...
echo Allowing sts:AssumeRole + sts:TagSession from account 226563001214
echo.

aws iam update-assume-role-policy ^
  --role-name OrganizationAccountAccessRole ^
  --policy-document file://iam-trust-policy.json ^
  --profile Devops-Team

if %ERRORLEVEL% NEQ 0 (
    echo.
    echo ERROR: Failed to update trust policy. 
    echo Make sure you have access to account 713678752742 via the Devops-Team profile.
    exit /b 1
)

echo.
echo Trust policy updated successfully.
echo Verifying...
echo.

aws iam get-role --role-name OrganizationAccountAccessRole --query "Role.AssumeRolePolicyDocument" --output json --profile Devops-Team

echo.
echo Done. The role now allows sts:TagSession for full CloudTrail audit traceability.
