terraform {
  required_version = ">= 1.0"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

# Configure provider for target account (713678752742)
# This assumes you have credentials configured for this account
provider "aws" {
  region = var.aws_region
  
  # If you need to assume a different role or use specific credentials
  # configure them here or via environment variables
}

variable "aws_region" {
  description = "AWS region"
  type        = string
  default     = "ap-south-1"
}

variable "source_account_id" {
  description = "Source AWS account ID"
  type        = string
  default     = "226563001214"
}

variable "source_user_arn" {
  description = "Source user ARN"
  type        = string
  default     = "arn:aws:iam::226563001214:user/santosh.mirajkar@timesgroup.com"
}

# IAM Role for cross-account access with TagSession permissions
resource "aws_iam_role" "organization_access_role" {
  name = "OrganizationAccountAccessRole"
  
  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Principal = {
          AWS = [
            var.source_user_arn,
            "arn:aws:iam::${var.source_account_id}:root"
          ]
        }
        Action = [
          "sts:AssumeRole",
          "sts:TagSession"
        ]
        Condition = {
          StringEquals = {
            "sts:RequestedRegion" = var.aws_region
          }
        }
      }
    ]
  })

  tags = {
    Name        = "OrganizationAccountAccessRole"
    Purpose     = "Cross-account access with TagSession support"
    SourceAccount = var.source_account_id
    CreatedBy   = "Terraform"
  }
}

# Attach AdministratorAccess policy
resource "aws_iam_role_policy_attachment" "admin_access" {
  role       = aws_iam_role.organization_access_role.name
  policy_arn = "arn:aws:iam::aws:policy/AdministratorAccess"
}

# Output the role ARN
output "role_arn" {
  description = "ARN of the created cross-account role"
  value       = aws_iam_role.organization_access_role.arn
}

output "role_name" {
  description = "Name of the created cross-account role"
  value       = aws_iam_role.organization_access_role.name
}

output "trust_policy" {
  description = "Trust policy of the role"
  value       = aws_iam_role.organization_access_role.assume_role_policy
}