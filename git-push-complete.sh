#!/bin/bash

set -e

echo "=== Git Push: Cross-Account IAM Role Fix ==="
echo

echo "Checking Git status..."
git status
echo

echo "Adding all new and modified files..."
git add .
echo

echo "Files to be committed:"
git diff --cached --name-only
echo

echo "Committing changes..."
git commit -m "feat: Complete cross-account IAM role deployment solution

🔧 Core IAM Role Configuration:
- Add IAM role with sts:TagSession permissions (iam-role.tf)
- Create trust policy JSON with proper cross-account permissions
- Bootstrap scripts for initial role creation

🚀 GitHub Actions Workflows:
- New cross-account deployment workflow (cross-account-deploy.yml)
- Updated existing workflows with unique session naming
- 3-phase deployment: IAM role → Infrastructure → Application

📝 Documentation & Guides:
- Comprehensive setup guide (GITHUB-ACTIONS-SETUP.md)
- Troubleshooting documentation (IAM-ROLE-TROUBLESHOOTING.md)
- Manual setup instructions (MANUAL-IAM-SETUP.md)
- Role assumption fix guide (ROLE-ASSUMPTION-FIX.md)

🛠 Deployment Scripts:
- Windows: bootstrap-iam-role.bat, create-iam-role.bat
- Linux: bootstrap-iam-role.sh, create-iam-role.sh
- PowerShell: bootstrap-automode.ps1
- Test scripts: test-role-assumption.sh/.bat

☁️ CloudFormation Alternative:
- CloudFormation template (cloudformation-iam-role.yaml)
- AWS CLI command references (IAM-ROLE-COMMANDS.md)

🔄 Policy Update Tools:
- Trust policy update scripts
- Verification and testing utilities

✅ Fixes Issues:
- Resolves sts:TagSession permission error
- Enables cross-account deployment (226563001214 → 713678752742)
- Supports automated GitHub Actions deployment
- Provides multiple deployment methods

Accounts: Source (226563001214) → Target (713678752742)
Region: ap-south-1
Role: OrganizationAccountAccessRole"

echo
echo "Pushing to remote repository..."
git push origin main

echo
echo "=== Push Successful ==="
echo
echo "✅ All cross-account IAM fixes have been pushed to Git"
echo
echo "📋 Summary of changes:"
echo "  - IAM role configuration and scripts"
echo "  - GitHub Actions workflows"
echo "  - Documentation and guides"
echo "  - Testing and verification tools"
echo "  - CloudFormation templates"
echo
echo "🚀 Next steps:"
echo "  1. Set up GitHub repository secrets"
echo "  2. Update IAM role trust policy if needed"
echo "  3. Test cross-account role assumption"
echo "  4. Run GitHub Actions deployment workflow"
echo
echo "📖 See GITHUB-ACTIONS-SETUP.md for detailed setup instructions"
echo