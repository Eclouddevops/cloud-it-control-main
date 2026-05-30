@echo off
setlocal enabledelayedexpansion

REM GitHub Actions Workflow Trigger Script for Windows
REM Triggers the cross-account deployment workflow

set GITHUB_REPO=Eclouddevops/cloud-it-control-main
set WORKFLOW_FILE=cross-account-deploy.yml

REM Default parameters
set ENVIRONMENT=%1
set ACTION=%2
set DOMAIN_NAME=%3
set CERT_DOMAIN=%4
set AWS_REGION=%5

if "%ENVIRONMENT%"=="" set ENVIRONMENT=dev
if "%ACTION%"=="" set ACTION=plan
if "%DOMAIN_NAME%"=="" set DOMAIN_NAME=dev.cloud-it-control.example.com
if "%CERT_DOMAIN%"=="" set CERT_DOMAIN=cloud-it-control.example.com
if "%AWS_REGION%"=="" set AWS_REGION=ap-south-1

echo === GitHub Actions Workflow Trigger ===
echo Repository: %GITHUB_REPO%
echo Workflow: %WORKFLOW_FILE%
echo Environment: %ENVIRONMENT%
echo Action: %ACTION%
echo Domain: %DOMAIN_NAME%
echo Certificate Domain: %CERT_DOMAIN%
echo AWS Region: %AWS_REGION%
echo.

REM Check for GitHub token
if "%GITHUB_TOKEN%"=="" (
    echo ❌ Error: GITHUB_TOKEN environment variable is required
    echo.
    echo To get a GitHub token:
    echo 1. Go to https://github.com/settings/tokens
    echo 2. Generate new token ^(classic^)
    echo 3. Select scopes: repo, workflow
    echo 4. Set environment variable: set GITHUB_TOKEN=your_token_here
    echo.
    pause
    exit /b 1
)

REM Validate parameters
if not "%ACTION%"=="plan" if not "%ACTION%"=="apply" if not "%ACTION%"=="destroy" (
    echo ❌ Error: Action must be 'plan', 'apply', or 'destroy'
    pause
    exit /b 1
)

if not "%ENVIRONMENT%"=="dev" if not "%ENVIRONMENT%"=="staging" if not "%ENVIRONMENT%"=="uat" if not "%ENVIRONMENT%"=="prd" (
    echo ❌ Error: Environment must be 'dev', 'staging', 'uat', or 'prd'
    pause
    exit /b 1
)

echo 🚀 Triggering workflow...

REM Create JSON payload
echo {"ref": "main","inputs": {"environment": "%ENVIRONMENT%","action": "%ACTION%","aws_region": "%AWS_REGION%","domain_name": "%DOMAIN_NAME%","certificate_domain": "%CERT_DOMAIN%"}} > workflow_payload.json

REM Trigger the workflow using curl
curl -s -w "%%{http_code}" ^
  -X POST ^
  -H "Accept: application/vnd.github.v3+json" ^
  -H "Authorization: token %GITHUB_TOKEN%" ^
  -H "Content-Type: application/json" ^
  "https://api.github.com/repos/%GITHUB_REPO%/actions/workflows/%WORKFLOW_FILE%/dispatches" ^
  -d @workflow_payload.json > response.txt

REM Check response
set /p HTTP_CODE=<response.txt
if "%HTTP_CODE%"=="204" (
    echo ✅ Workflow triggered successfully!
    echo.
    echo 📋 Deployment Details:
    echo   Environment: %ENVIRONMENT%
    echo   Action: %ACTION%
    echo   Domain: %DOMAIN_NAME%
    echo   Region: %AWS_REGION%
    echo.
    echo 🔗 Monitor the deployment:
    echo   GitHub Actions: https://github.com/%GITHUB_REPO%/actions
    echo   Workflow: https://github.com/%GITHUB_REPO%/actions/workflows/%WORKFLOW_FILE%
    echo.
    echo ⏱️  The workflow will run in 3 phases:
    echo   1. Create IAM Role ^(if needed^)
    echo   2. Deploy Infrastructure
    echo   3. Deploy Application ^(if action=apply^)
) else (
    echo ❌ Failed to trigger workflow ^(HTTP %HTTP_CODE%^)
    echo.
    echo 🔍 Troubleshooting:
    echo   - Check GitHub token permissions ^(repo, workflow^)
    echo   - Verify repository name: %GITHUB_REPO%
    echo   - Ensure workflow file exists: %WORKFLOW_FILE%
)

REM Cleanup
del workflow_payload.json response.txt 2>nul

echo.
pause