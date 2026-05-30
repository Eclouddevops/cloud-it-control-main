#!/bin/bash

# GitHub Actions Workflow Trigger Script
# Triggers the cross-account deployment workflow

set -e

# Configuration
GITHUB_REPO="Eclouddevops/cloud-it-control-main"
WORKFLOW_FILE="cross-account-deploy.yml"
GITHUB_TOKEN="${GITHUB_TOKEN:-}"

# Default parameters
ENVIRONMENT="${1:-dev}"
ACTION="${2:-plan}"
DOMAIN_NAME="${3:-dev.cloud-it-control.example.com}"
CERT_DOMAIN="${4:-cloud-it-control.example.com}"
AWS_REGION="${5:-ap-south-1}"

echo "=== GitHub Actions Workflow Trigger ==="
echo "Repository: $GITHUB_REPO"
echo "Workflow: $WORKFLOW_FILE"
echo "Environment: $ENVIRONMENT"
echo "Action: $ACTION"
echo "Domain: $DOMAIN_NAME"
echo "Certificate Domain: $CERT_DOMAIN"
echo "AWS Region: $AWS_REGION"
echo

# Check for GitHub token
if [ -z "$GITHUB_TOKEN" ]; then
    echo "❌ Error: GITHUB_TOKEN environment variable is required"
    echo
    echo "To get a GitHub token:"
    echo "1. Go to https://github.com/settings/tokens"
    echo "2. Generate new token (classic)"
    echo "3. Select scopes: repo, workflow"
    echo "4. Export token: export GITHUB_TOKEN=your_token_here"
    echo
    exit 1
fi

# Validate parameters
if [ "$ACTION" != "plan" ] && [ "$ACTION" != "apply" ] && [ "$ACTION" != "destroy" ]; then
    echo "❌ Error: Action must be 'plan', 'apply', or 'destroy'"
    exit 1
fi

if [ "$ENVIRONMENT" != "dev" ] && [ "$ENVIRONMENT" != "staging" ] && [ "$ENVIRONMENT" != "uat" ] && [ "$ENVIRONMENT" != "prd" ]; then
    echo "❌ Error: Environment must be 'dev', 'staging', 'uat', or 'prd'"
    exit 1
fi

echo "🚀 Triggering workflow..."

# Trigger the workflow
RESPONSE=$(curl -s -w "%{http_code}" \
  -X POST \
  -H "Accept: application/vnd.github.v3+json" \
  -H "Authorization: token $GITHUB_TOKEN" \
  -H "Content-Type: application/json" \
  "https://api.github.com/repos/$GITHUB_REPO/actions/workflows/$WORKFLOW_FILE/dispatches" \
  -d "{
    \"ref\": \"main\",
    \"inputs\": {
      \"environment\": \"$ENVIRONMENT\",
      \"action\": \"$ACTION\",
      \"aws_region\": \"$AWS_REGION\",
      \"domain_name\": \"$DOMAIN_NAME\",
      \"certificate_domain\": \"$CERT_DOMAIN\"
    }
  }")

# Extract HTTP status code and response body
HTTP_CODE="${RESPONSE: -3}"
RESPONSE_BODY="${RESPONSE%???}"

if [ "$HTTP_CODE" = "204" ]; then
    echo "✅ Workflow triggered successfully!"
    echo
    echo "📋 Deployment Details:"
    echo "  Environment: $ENVIRONMENT"
    echo "  Action: $ACTION"
    echo "  Domain: $DOMAIN_NAME"
    echo "  Region: $AWS_REGION"
    echo
    echo "🔗 Monitor the deployment:"
    echo "  GitHub Actions: https://github.com/$GITHUB_REPO/actions"
    echo "  Workflow: https://github.com/$GITHUB_REPO/actions/workflows/$WORKFLOW_FILE"
    echo
    echo "⏱️  The workflow will run in 3 phases:"
    echo "  1. Create IAM Role (if needed)"
    echo "  2. Deploy Infrastructure"
    echo "  3. Deploy Application (if action=apply)"
    echo
else
    echo "❌ Failed to trigger workflow (HTTP $HTTP_CODE)"
    if [ -n "$RESPONSE_BODY" ]; then
        echo "Response: $RESPONSE_BODY"
    fi
    echo
    echo "🔍 Troubleshooting:"
    echo "  - Check GitHub token permissions (repo, workflow)"
    echo "  - Verify repository name: $GITHUB_REPO"
    echo "  - Ensure workflow file exists: $WORKFLOW_FILE"
    exit 1
fi