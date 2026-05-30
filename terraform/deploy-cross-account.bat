@echo off
setlocal enabledelayedexpansion

REM Cross-Account Terraform Deployment Script for Windows
REM This script handles the IAM role assumption for cross-account deployments

set SOURCE_ACCOUNT=226563001214
set TARGET_ACCOUNT=713678752742
set ROLE_NAME=OrganizationAccountAccessRole
set SESSION_NAME=TerraformDeployment-%RANDOM%
set REGION=ap-south-1
set ENVIRONMENT=%1
if "%ENVIRONMENT%"=="" set ENVIRONMENT=dev

echo === Cross-Account Terraform Deployment ===
echo Source Account: %SOURCE_ACCOUNT%
echo Target Account: %TARGET_ACCOUNT%
echo Environment: %ENVIRONMENT%
echo Region: %REGION%

REM Step 1: First deployment to create the IAM role
echo Step 1: Creating IAM role in target account...
terraform init
terraform plan -var="environment=%ENVIRONMENT%" -target=aws_iam_role.organization_access_role
terraform apply -var="environment=%ENVIRONMENT%" -target=aws_iam_role.organization_access_role -auto-approve

if %ERRORLEVEL% neq 0 (
    echo Failed to create IAM role
    exit /b 1
)

REM Step 2: Assume the role for subsequent deployments
echo Step 2: Assuming role for full deployment...
set ROLE_ARN=arn:aws:iam::%TARGET_ACCOUNT%:role/%ROLE_NAME%

REM Get temporary credentials
for /f "tokens=1,2,3" %%a in ('aws sts assume-role --role-arn "%ROLE_ARN%" --role-session-name "%SESSION_NAME%" --query "Credentials.[AccessKeyId,SecretAccessKey,SessionToken]" --output text') do (
    set AWS_ACCESS_KEY_ID=%%a
    set AWS_SECRET_ACCESS_KEY=%%b
    set AWS_SESSION_TOKEN=%%c
)

if "%AWS_ACCESS_KEY_ID%"=="" (
    echo Failed to assume role. Please check permissions.
    exit /b 1
)

echo Successfully assumed role: %ROLE_ARN%

REM Step 3: Run full terraform deployment
echo Step 3: Running full Terraform deployment...
terraform plan -var="environment=%ENVIRONMENT%"
terraform apply -var="environment=%ENVIRONMENT%" -auto-approve

if %ERRORLEVEL% eq 0 (
    echo === Deployment Complete ===
    terraform output
) else (
    echo Deployment failed
    exit /b 1
)

endlocal