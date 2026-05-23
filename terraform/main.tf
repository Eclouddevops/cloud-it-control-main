terraform {
  required_version = ">= 1.0"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
  region = var.aws_region
  
  default_tags {
    tags = {
      Environment = var.environment
      Application = "CloudITControl"
      ManagedBy   = "Terraform"
      CreatedAt   = timestamp()
    }
  }
}

# Data source for ACM certificate
data "aws_acm_certificate" "main" {
  domain   = var.certificate_domain
  statuses = ["ISSUED"]
}

# S3 Bucket for frontend assets
module "frontend_bucket" {
  source = "./modules/s3"
  
  bucket_name = "cloud-it-control-${var.environment}-${data.aws_caller_identity.current.account_id}"
  environment = var.environment
  
  versioning_enabled = true
  logging_enabled    = true
  logging_bucket     = aws_s3_bucket.logging.id
}

# S3 Bucket for logging
resource "aws_s3_bucket" "logging" {
  bucket = "cloud-it-control-logs-${var.environment}-${data.aws_caller_identity.current.account_id}"
  
  tags = {
    Name = "CloudITControl-Logging"
  }
}

# Block public access on logging bucket
resource "aws_s3_bucket_public_access_block" "logging" {
  bucket = aws_s3_bucket.logging.id
  
  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

# CloudFront OAI
resource "aws_cloudfront_origin_access_identity" "main" {
  comment = "OAI for CloudITControl ${var.environment}"
}

# CloudFront Distribution
module "cloudfront" {
  source = "./modules/cloudfront"
  
  bucket_name                    = module.frontend_bucket.bucket_name
  bucket_regional_domain_name    = module.frontend_bucket.bucket_regional_domain_name
  bucket_arn                     = module.frontend_bucket.bucket_arn
  origin_access_identity_path    = aws_cloudfront_origin_access_identity.main.cloudfront_access_identity_path
  origin_access_identity_iam_arn = aws_cloudfront_origin_access_identity.main.iam_arn
  
  domain_name        = var.domain_name
  certificate_arn    = data.aws_acm_certificate.main.arn
  environment        = var.environment
  enable_waf         = var.enable_waf
  
  depends_on = [module.frontend_bucket]
}

# Route 53 DNS Record
module "route53" {
  source = "./modules/route53"
  
  hosted_zone_id         = var.hosted_zone_id
  domain_name            = var.domain_name
  cloudfront_domain_name = module.cloudfront.cloudfront_domain_name
  cloudfront_zone_id     = module.cloudfront.cloudfront_zone_id
}

# CloudWatch Alarms
module "monitoring" {
  source = "./modules/monitoring"
  
  environment             = var.environment
  cloudfront_distribution_id = module.cloudfront.cloudfront_distribution_id
  s3_bucket_name         = module.frontend_bucket.bucket_name
}

# IAM Role for GitHub Actions
module "github_actions" {
  source = "./modules/github-actions"
  
  environment        = var.environment
  s3_bucket_name     = module.frontend_bucket.bucket_name
  cloudfront_dist_id = module.cloudfront.cloudfront_distribution_id
}

# Secrets Manager
resource "aws_secretsmanager_secret" "app_secrets" {
  name                    = "cloud-it-control/${var.environment}/app-secrets"
  description             = "Application secrets for Cloud IT Control"
  recovery_window_in_days = 7
}

resource "aws_secretsmanager_secret_version" "app_secrets" {
  secret_id = aws_secretsmanager_secret.app_secrets.id
  secret_string = jsonencode({
    supabase_project_id      = var.supabase_project_id
    supabase_url             = var.supabase_url
    supabase_publishable_key = var.supabase_publishable_key
  })
}

# Data source for current AWS account
data "aws_caller_identity" "current" {}

# Data source for current region
data "aws_region" "current" {}
