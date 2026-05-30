#!/bin/bash

# GitHub Actions Workflow Trigger Script
# Usage: ./trigger-deploy.sh <environment> <action> <domain> <cert_domain>

set -e

# Configuration
GITHUB_REPO="Eclouddevops/cloud-it-control-main"
WORKFLOW_FILE="cross-account-deploy.yml"
GITHUB_TOKEN="${GITHUB_TOKEN:-}"

# Parameters
ENVIRONMENT="${1:-dev}"
ACTION="${2:-plan}"
DOMAIN_NAME="${3:-}"
CERT_DOMAIN="${4:-}"
AWS_REGION="${5:-ap-south-1}"

# Validation
if [ -z "$GITHUB_TOKEN" ]; then
    echo "Error: GITHUB_TOKEN environment variable is required"
    echo "Get a token from: https://github.com/settings/tokens"
    echo "Required scopes: repo, workflow"
    exit 1
fi

if [ -z "$DOMAIN_NAME" ]; then
    echo "Error: Domain name is required"
    echo "Usage: $0 <environment> <action> <domain> <cert_domain> [aws_region]"
    echo "Example: $0 dev apply dev.example.com *.example.com ap-south-1"
    exit 1
fi

if [ -z "$CERT_DOMAIN" ]; then
    CERT_DOMAIN="$DOMAIN_NAME"
fi

echo "=== GitHub Actions Deployment Trigger ==="
echo "Repository: $GITHUB_REPO"
echo "Workflow: $WORKFLOW_FILE"
echo "Environment: $ENVIRONMENT"
echo "Action: $ACTION"
echo "Domain: $DOMAIN_NAME"
echo "Certificate Domain: $CERT_DOMAIN"
echo "AWS Region: $AWS_REGION"
echo

# Trigger workflow
echo "Triggering workflow..."

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

HTTP_CODE="${RESPONSE: -3}"
RESPONSE_BODY="${RESPONSE%???}"

if [ "$HTTP_CODE" = "204" ]; then
    echo "✅ Workflow triggered successfully!"
    echo
    echo "View the workflow run at:"
    echo "https://github.com/$GITHUB_REPO/actions/workflows/$WORKFLOW_FILE"
    echo
    echo "Monitor the deployment progress in the Actions tab."
else
    echo "❌ Failed to trigger workflow (HTTP $HTTP_CODE)"
    echo "Response: $RESPONSE_BODY"
    exit 1
fi