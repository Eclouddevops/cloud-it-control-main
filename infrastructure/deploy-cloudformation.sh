#!/bin/bash
set -e

# Deploy infrastructure to AWS using CloudFormation
# Usage: ./deploy-cloudformation.sh <environment> <region> <domain> <hosted-zone-id> <certificate-arn>
# Environments: dev | staging | uat | prd

ENVIRONMENT=${1:-dev}
REGION=${2:-ap-south-1}
STACK_NAME="cloud-it-control-$ENVIRONMENT"
DOMAIN_NAME=${3:-"app.$ENVIRONMENT.example.com"}
HOSTED_ZONE_ID=${4:-""}
CERTIFICATE_ARN=${5:-""}

echo "=== Deploying Cloud IT Control to AWS (CloudFormation) ==="
echo "Stack Name: $STACK_NAME"
echo "Environment: $ENVIRONMENT"
echo "Region: $REGION"
echo "Domain: $DOMAIN_NAME"

# Validate environment
if [[ ! "$ENVIRONMENT" =~ ^(dev|staging|uat|prd)$ ]]; then
    echo "Error: Environment must be dev, staging, uat, or prd"
    exit 1
fi

# Validate required inputs
if [[ -z "$HOSTED_ZONE_ID" ]]; then
    echo "Error: HOSTED_ZONE_ID is required"
    echo "Usage: ./deploy-cloudformation.sh <environment> <region> <domain> <hosted-zone-id> <certificate-arn>"
    exit 1
fi

if [[ -z "$CERTIFICATE_ARN" ]]; then
    echo "Error: CERTIFICATE_ARN is required"
    echo "Usage: ./deploy-cloudformation.sh <environment> <region> <domain> <hosted-zone-id> <certificate-arn>"
    exit 1
fi

cd "$(dirname "$0")"

# Validate template
echo "Validating CloudFormation template..."
aws cloudformation validate-template \
    --template-body file://cloudformation-template.yaml \
    --region "$REGION" > /dev/null

# Check if stack exists
STACK_EXISTS=$(aws cloudformation describe-stacks \
    --stack-name "$STACK_NAME" \
    --region "$REGION" \
    --query 'Stacks[0].StackId' \
    --output text 2>/dev/null || echo "")

if [ -n "$STACK_EXISTS" ]; then
    echo "Stack already exists. Updating stack..."
    OPERATION="update-stack"
    WAIT="stack-update-complete"
else
    echo "Creating new stack..."
    OPERATION="create-stack"
    WAIT="stack-create-complete"
fi

# Deploy stack
echo "Deploying CloudFormation stack..."
aws cloudformation "$OPERATION" \
    --stack-name "$STACK_NAME" \
    --template-body file://cloudformation-template.yaml \
    --parameters \
        ParameterKey=Environment,ParameterValue="$ENVIRONMENT" \
        ParameterKey=HostedZoneId,ParameterValue="$HOSTED_ZONE_ID" \
        ParameterKey=DomainName,ParameterValue="$DOMAIN_NAME" \
        ParameterKey=CertificateArn,ParameterValue="$CERTIFICATE_ARN" \
    --region "$REGION" \
    --capabilities CAPABILITY_NAMED_IAM

# Wait for stack operation to complete
echo "Waiting for stack operation to complete..."
aws cloudformation wait "$WAIT" \
    --stack-name "$STACK_NAME" \
    --region "$REGION"

# Get stack outputs
echo ""
echo "=== Deployment Complete ==="
aws cloudformation describe-stacks \
    --stack-name "$STACK_NAME" \
    --region "$REGION" \
    --query 'Stacks[0].Outputs' \
    --output table

echo ""
echo "Stack deployed successfully!"
echo "Add the GitHub Actions role ARN to your repository secrets:"
echo "  AWS_ROLE_ARN_${ENVIRONMENT^^}  →  (see GitHubActionsRoleArn in outputs above)"
