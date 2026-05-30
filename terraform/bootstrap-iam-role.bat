@echo off
setlocal enabledelayedexpansion

echo === Bootstrap IAM Role for Cross-Account Access ===
echo.
echo This script creates the OrganizationAccountAccessRole in the target account
echo Target Account: 713678752742
echo Source Account: 226563001214
echo.

REM Check if we're in the right directory
if not exist "bootstrap-iam-role.tf" (
    echo Error: bootstrap-iam-role.tf not found
    echo Please run this script from the terraform directory
    pause
    exit /b 1
)

echo Step 1: Initialize Terraform for bootstrap...
terraform init -upgrade
if %ERRORLEVEL% neq 0 (
    echo Failed to initialize Terraform
    pause
    exit /b 1
)

echo.
echo Step 2: Plan the IAM role creation...
terraform plan -target=aws_iam_role.organization_access_role -target=aws_iam_role_policy_attachment.admin_access -out=bootstrap.tfplan
if %ERRORLEVEL% neq 0 (
    echo Failed to create Terraform plan
    pause
    exit /b 1
)

echo.
echo Step 3: Apply the IAM role creation...
echo WARNING: This will create the IAM role in the current AWS account
echo Make sure you're authenticated to account 713678752742
echo.
set /p confirm="Continue? (y/N): "
if /i not "%confirm%"=="y" (
    echo Cancelled by user
    pause
    exit /b 0
)

terraform apply bootstrap.tfplan
if %ERRORLEVEL% neq 0 (
    echo Failed to apply Terraform changes
    pause
    exit /b 1
)

echo.
echo Step 4: Display role information...
terraform output
echo.

echo === Bootstrap Complete ===
echo.
echo The OrganizationAccountAccessRole has been created successfully!
echo.
echo Next steps:
echo 1. Test the role assumption:
echo    aws sts assume-role --role-arn arn:aws:iam::713678752742:role/OrganizationAccountAccessRole --role-session-name test
echo.
echo 2. Run the main deployment:
echo    Use the GitHub Actions workflow or run deploy-cross-account.bat
echo.
pause