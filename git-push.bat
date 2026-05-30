@echo off
echo === Git Push Script for Cross-Account IAM Fix ===
echo.

echo Checking Git status...
git status
echo.

echo Adding all new and modified files...
git add .
echo.

echo Committing changes...
git commit -m "feat: Add cross-account IAM role deployment with TagSession support

- Add IAM role with proper TagSession permissions (iam-role.tf)
- Create cross-account deployment GitHub Actions workflow
- Add deployment scripts for Windows and Linux
- Update existing workflows with unique session naming
- Add comprehensive documentation and setup guides

Fixes: sts:TagSession permission error for cross-account deployments
Accounts: 226563001214 (source) -> 713678752742 (target)"
echo.

echo Pushing to remote repository...
git push origin main
echo.

echo === Push Complete ===
echo.
echo Next steps:
echo 1. Go to GitHub repository
echo 2. Set up required secrets (see .github/GITHUB-ACTIONS-SETUP.md)
echo 3. Run the "Cross-Account Infrastructure Deploy" workflow
echo.
pause