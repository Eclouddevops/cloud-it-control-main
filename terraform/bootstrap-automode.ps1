# PowerShell script to bootstrap IAM role creation
# This script automates the entire process

Write-Host "=== Automated IAM Role Bootstrap ===" -ForegroundColor Green
Write-Host ""

# Check if Terraform is available
$terraformPath = Get-Command terraform -ErrorAction SilentlyContinue
if (-not $terraformPath) {
    Write-Host "Error: Terraform not found in PATH" -ForegroundColor Red
    Write-Host "Please install Terraform first: https://www.terraform.io/downloads.html" -ForegroundColor Yellow
    exit 1
}

# Check if AWS CLI is available
$awsPath = Get-Command aws -ErrorAction SilentlyContinue
if (-not $awsPath) {
    Write-Host "Error: AWS CLI not found in PATH" -ForegroundColor Red
    Write-Host "Please install AWS CLI first: https://aws.amazon.com/cli/" -ForegroundColor Yellow
    exit 1
}

# Verify AWS credentials
Write-Host "Verifying AWS credentials..." -ForegroundColor Yellow
try {
    $accountId = aws sts get-caller-identity --query Account --output text
    Write-Host "Current AWS Account: $accountId" -ForegroundColor Cyan
    
    if ($accountId -ne "713678752742") {
        Write-Host "Warning: Not authenticated to target account (713678752742)" -ForegroundColor Yellow
        Write-Host "Current account: $accountId" -ForegroundColor Yellow
        $continue = Read-Host "Continue anyway? (y/N)"
        if ($continue -ne "y" -and $continue -ne "Y") {
            Write-Host "Cancelled by user" -ForegroundColor Red
            exit 0
        }
    }
} catch {
    Write-Host "Error: Unable to verify AWS credentials" -ForegroundColor Red
    Write-Host "Please configure AWS credentials for account 713678752742" -ForegroundColor Yellow
    exit 1
}

Write-Host ""
Write-Host "Step 1: Initializing Terraform..." -ForegroundColor Yellow
terraform init -upgrade
if ($LASTEXITCODE -ne 0) {
    Write-Host "Failed to initialize Terraform" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "Step 2: Planning IAM role creation..." -ForegroundColor Yellow
terraform plan -target=aws_iam_role.organization_access_role -target=aws_iam_role_policy_attachment.admin_access -out=bootstrap.tfplan
if ($LASTEXITCODE -ne 0) {
    Write-Host "Failed to create Terraform plan" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "Step 3: Applying IAM role creation..." -ForegroundColor Yellow
Write-Host "Creating OrganizationAccountAccessRole in account $accountId" -ForegroundColor Cyan

terraform apply -auto-approve bootstrap.tfplan
if ($LASTEXITCODE -ne 0) {
    Write-Host "Failed to apply Terraform changes" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "Step 4: Displaying role information..." -ForegroundColor Yellow
terraform output

Write-Host ""
Write-Host "=== Bootstrap Complete ===" -ForegroundColor Green
Write-Host ""
Write-Host "The OrganizationAccountAccessRole has been created successfully!" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "1. Test role assumption:" -ForegroundColor White
Write-Host "   aws sts assume-role --role-arn arn:aws:iam::713678752742:role/OrganizationAccountAccessRole --role-session-name test" -ForegroundColor Gray
Write-Host ""
Write-Host "2. Run main deployment via GitHub Actions or local scripts" -ForegroundColor White
Write-Host ""

# Test role assumption automatically
Write-Host "Testing role assumption..." -ForegroundColor Yellow
try {
    $roleTest = aws sts assume-role --role-arn "arn:aws:iam::713678752742:role/OrganizationAccountAccessRole" --role-session-name "bootstrap-test" --query "Credentials.AccessKeyId" --output text
    if ($roleTest) {
        Write-Host "✅ Role assumption test successful!" -ForegroundColor Green
    }
} catch {
    Write-Host "⚠️  Role assumption test failed - this may be expected if running from different account" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "Bootstrap process completed successfully!" -ForegroundColor Green