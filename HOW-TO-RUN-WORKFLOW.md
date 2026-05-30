# How to Run the GitHub Actions Workflow

## 🚀 Method 1: GitHub Web Interface (Easiest)

1. **Go to your GitHub repository**: https://github.com/Eclouddevops/cloud-it-control-main
2. **Click "Actions" tab**
3. **Select "Cross-Account Infrastructure Deploy" workflow**
4. **Click "Run workflow" button**
5. **Fill in the parameters**:
   - **Environment**: `dev` (or staging/uat/prd)
   - **Action**: `plan` (to preview) or `apply` (to deploy)
   - **AWS Region**: `ap-south-1`
   - **Domain Name**: `dev.cloud-it-control.example.com`
   - **Certificate Domain**: `cloud-it-control.example.com`
6. **Click "Run workflow"**

## 🔧 Method 2: API Script (Automated)

### Prerequisites
1. **GitHub Personal Access Token**:
   - Go to https://github.com/settings/tokens
   - Generate new token (classic)
   - Select scopes: `repo`, `workflow`
   - Copy the token

2. **Set Environment Variable**:
   ```bash
   # Linux/Mac
   export GITHUB_TOKEN=your_github_token_here
   
   # Windows
   set GITHUB_TOKEN=your_github_token_here
   ```

### Run the Script

**Windows:**
```cmd
cd c:\Maheshkoli-Project\cloud-it-control-main
run-workflow.bat dev apply dev.example.com *.example.com ap-south-1
```

**Linux/Mac:**
```bash
cd c:\Maheshkoli-Project\cloud-it-control-main
chmod +x run-workflow.sh
./run-workflow.sh dev apply dev.example.com *.example.com ap-south-1
```

### Script Parameters
```bash
./run-workflow.sh [environment] [action] [domain] [cert_domain] [region]
```

- **environment**: `dev`, `staging`, `uat`, `prd`
- **action**: `plan`, `apply`, `destroy`
- **domain**: Your application domain
- **cert_domain**: ACM certificate domain
- **region**: AWS region (default: ap-south-1)

## 📋 Example Commands

### Plan Deployment (Preview Only)
```bash
# Windows
run-workflow.bat dev plan dev.example.com *.example.com

# Linux/Mac
./run-workflow.sh dev plan dev.example.com *.example.com
```

### Apply Deployment (Full Deploy)
```bash
# Windows
run-workflow.bat dev apply dev.example.com *.example.com

# Linux/Mac
./run-workflow.sh dev apply dev.example.com *.example.com
```

### Production Deployment
```bash
# Windows
run-workflow.bat prd apply app.example.com *.example.com

# Linux/Mac
./run-workflow.sh prd apply app.example.com *.example.com
```

## 🔍 Monitoring the Workflow

After triggering, monitor the progress:

1. **GitHub Actions Page**: https://github.com/Eclouddevops/cloud-it-control-main/actions
2. **Workflow Runs**: Click on the latest run to see details
3. **Live Logs**: Watch real-time deployment progress

## ⏱️ Workflow Phases

The workflow runs in 3 phases:

### Phase 1: Create IAM Role
- Creates `OrganizationAccountAccessRole` in target account
- Sets up proper trust policy with `sts:TagSession`
- Only runs if role doesn't exist

### Phase 2: Deploy Infrastructure
- Assumes the cross-account role
- Deploys AWS resources (S3, CloudFront, etc.)
- Creates Terraform state

### Phase 3: Deploy Application
- Builds the React application
- Uploads to S3
- Invalidates CloudFront cache
- Only runs if action = "apply"

## 🔐 Required GitHub Secrets

Ensure these secrets are set in your repository:

```
AWS_ACCESS_KEY_ID                 # Source account (226563001214)
AWS_SECRET_ACCESS_KEY            # Source account credentials
VITE_SUPABASE_PROJECT_ID         # Supabase configuration
VITE_SUPABASE_URL               # Supabase URL
VITE_SUPABASE_PUBLISHABLE_KEY   # Supabase public key
```

**To set secrets:**
1. Go to repository **Settings** → **Secrets and variables** → **Actions**
2. Click **New repository secret**
3. Add each secret with exact name and value

## 🚨 Troubleshooting

### Workflow Not Found
- Ensure you've pushed the workflow file: `.github/workflows/cross-account-deploy.yml`
- Check the repository name is correct: `Eclouddevops/cloud-it-control-main`

### API Trigger Fails
- Verify GitHub token has `repo` and `workflow` scopes
- Check token is not expired
- Ensure repository access permissions

### Deployment Fails
- Check GitHub secrets are set correctly
- Verify AWS credentials have proper permissions
- Review workflow logs for specific errors

## 📖 Additional Resources

- **Setup Guide**: `GITHUB-ACTIONS-SETUP.md`
- **Troubleshooting**: `IAM-ROLE-TROUBLESHOOTING.md`
- **Manual Setup**: `MANUAL-IAM-SETUP.md`

## 🎯 Quick Start

1. **Set GitHub token**: `export GITHUB_TOKEN=your_token`
2. **Run workflow**: `./run-workflow.sh dev plan`
3. **Monitor**: Check GitHub Actions page
4. **Deploy**: `./run-workflow.sh dev apply` (if plan looks good)

The workflow will handle the cross-account IAM role creation and deployment automatically!