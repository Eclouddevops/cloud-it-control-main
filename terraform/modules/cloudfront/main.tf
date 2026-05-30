variable "bucket_name" {
  type = string
}

variable "bucket_regional_domain_name" {
  type = string
}

variable "bucket_arn" {
  type = string
}

variable "origin_access_identity_path" {
  type = string
}

variable "origin_access_identity_iam_arn" {
  type = string
}

variable "domain_name" {
  type = string
}

variable "certificate_arn" {
  type = string
}

variable "environment" {
  type = string
}

variable "enable_waf" {
  type    = bool
  default = false
}

# Bucket Policy for CloudFront
resource "aws_s3_bucket_policy" "cloudfront" {
  bucket = var.bucket_name
  
  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Sid    = "CloudFrontAccess"
        Effect = "Allow"
        Principal = {
          AWS = var.origin_access_identity_iam_arn
        }
        Action   = "s3:GetObject"
        Resource = "${var.bucket_arn}/*"
      }
    ]
  })
}

# CloudFront Distribution
resource "aws_cloudfront_distribution" "this" {
  enabled             = true
  is_ipv6_enabled     = true
  comment             = "Distribution for Cloud IT Control - ${var.environment}"
  default_root_object = "index.html"
  http_version        = "http2and3"
  
  origin {
    domain_name = var.bucket_regional_domain_name
    origin_id   = "S3Origin"
    
    s3_origin_config {
      origin_access_identity = var.origin_access_identity_path
    }
  }
  
  # Default cache behavior
  default_cache_behavior {
    allowed_methods  = ["GET", "HEAD", "OPTIONS"]
    cached_methods   = ["GET", "HEAD"]
    target_origin_id = "S3Origin"
    compress         = true
    
    viewer_protocol_policy = "redirect-to-https"
    
    cache_policy_id = "658327ea-f89d-4fab-a63d-7e88639e58f6" # Managed-CachingOptimized
  }
  
  # Cache behavior for assets
  ordered_cache_behavior {
    path_pattern     = "/assets/*"
    allowed_methods  = ["GET", "HEAD"]
    cached_methods   = ["GET", "HEAD"]
    target_origin_id = "S3Origin"
    compress         = true
    
    viewer_protocol_policy = "https-only"
    cache_policy_id        = "658327ea-f89d-4fab-a63d-7e88639e58f6"
  }
  
  # Custom error response for SPA
  custom_error_response {
    error_code            = 404
    response_code         = 200
    response_page_path    = "/index.html"
    error_caching_min_ttl = 300
  }
  
  custom_error_response {
    error_code            = 403
    response_code         = 200
    response_page_path    = "/index.html"
    error_caching_min_ttl = 300
  }
  
  # SSL/TLS Configuration
  dynamic "viewer_certificate" {
    for_each = var.certificate_arn != "" ? [1] : []
    content {
      acm_certificate_arn      = var.certificate_arn
      ssl_support_method       = "sni-only"
      minimum_protocol_version = "TLSv1.2_2021"
    }
  }
  
  dynamic "viewer_certificate" {
    for_each = var.certificate_arn == "" ? [1] : []
    content {
      cloudfront_default_certificate = true
    }
  }
  
  aliases = var.certificate_arn != "" ? [var.domain_name] : []
  
  restrictions {
    geo_restriction {
      restriction_type = "none"
    }
  }
  
  web_acl_id = var.enable_waf ? aws_wafv2_web_acl.this[0].arn : null
  
  tags = {
    Environment = var.environment
  }
  
  depends_on = [aws_s3_bucket_policy.cloudfront]
}

# WAF Web ACL
resource "aws_wafv2_web_acl" "this" {
  count = var.enable_waf ? 1 : 0
  
  name  = "CloudITControl-WebACL-${var.environment}"
  scope = "CLOUDFRONT"
  
  default_action {
    allow {}
  }
  
  rule {
    name     = "RateLimitRule"
    priority = 0
    
    action {
      block {}
    }
    
    statement {
      rate_based_statement {
        limit              = 2000
        aggregate_key_type = "IP"
      }
    }
    
    visibility_config {
      cloudwatch_metrics_enabled = true
      metric_name                = "RateLimitRule"
      sampled_requests_enabled   = true
    }
  }
  
  rule {
    name     = "AWSManagedRulesCommonRuleSet"
    priority = 1
    
    override_action {
      none {}
    }
    
    statement {
      managed_rule_group_statement {
        name        = "AWSManagedRulesCommonRuleSet"
        vendor_name = "AWS"
      }
    }
    
    visibility_config {
      cloudwatch_metrics_enabled = true
      metric_name                = "AWSManagedRulesCommonRuleSet"
      sampled_requests_enabled   = true
    }
  }
  
  visibility_config {
    cloudwatch_metrics_enabled = true
    metric_name                = "CloudITControlWebACL"
    sampled_requests_enabled   = true
  }
}

output "cloudfront_distribution_id" {
  value = aws_cloudfront_distribution.this.id
}

output "cloudfront_domain_name" {
  value = aws_cloudfront_distribution.this.domain_name
}

output "cloudfront_zone_id" {
  value = aws_cloudfront_distribution.this.hosted_zone_id
}
