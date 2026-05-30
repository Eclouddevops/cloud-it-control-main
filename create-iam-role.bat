@echo off
setlocal enabledelayedexpansion

echo === Creating Cross-Account IAM Role ===
echo Target Account: 713678752742
echo Source Account: 226563001214
echo.

REM Step 1: Verify current account
echo Step 1: Verifying AWS account...
for /f "tokens=*" %%i in ('aws sts get-caller-identity --query Account --output text 2^>nul') do set CURRENT_ACCOUNT=%%i

if "%CURRENT_ACCOUNT%"=="" (
    echo Error: Unable to get AWS account info
    echo Please configure AWS credentials for account 713678752742
    pause
    exit /b 1
)

echo Current Account: %CURRENT_ACCOUNT%

if not "%CURRENT_ACCOUNT%"=="713678752742" (
    echo WARNING: Not in target account ^(713678752742^)
    echo Please configure AWS credentials for the target account
    set /p continue="Continue anyway? (y/N): "
    if /i not "!continue!"=="y" (
        echo Cancelled
        exit /b 0
    )
)

REM Step 2: Create IAM role
echo.
echo Step 2: Creating IAM role...
aws iam create-role ^
    --role-name OrganizationAccountAccessRole ^
    --assume-role-policy-document file://iam-trust-policy.json ^
    --description "Cross-account role with TagSession permissions for Terraform deployments" ^
    --tags Key=Name,Value=OrganizationAccountAccessRole Key=Purpose,Value="Cross-account access with TagSession support" Key=SourceAccount,Value=226563001214 Key=CreatedBy,Value=Script

if %ERRORLEVEL% equ 0 (
    echo ✅ IAM role created successfully
) else (
    echo ❌ Failed to create IAM role ^(may already exist^)
)

REM Step 3: Attach AdministratorAccess policy
echo.
echo Step 3: Attaching AdministratorAccess policy...
aws iam attach-role-policy ^
    --role-name OrganizationAccountAccessRole ^
    --policy-arn arn:aws:iam::aws:policy/AdministratorAccess

if %ERRORLEVEL% equ 0 (
    echo ✅ Policy attached successfully
) else (
    echo ❌ Failed to attach policy
)

REM Step 4: Get role details
echo.
echo Step 4: Role details...
aws iam get-role --role-name OrganizationAccountAccessRole --query "Role.{RoleName:RoleName,Arn:Arn,CreateDate:CreateDate}" --output table

REM Step 5: Test role assumption info
echo.
echo Step 5: Test command for role assumption:
echo Run this from source account ^(226563001214^):
echo aws sts assume-role --role-arn arn:aws:iam::713678752742:role/OrganizationAccountAccessRole --role-session-name test-session

echo.
echo === Role Creation Complete ===
pause