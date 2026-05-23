variable "aws_region" {
  description = "AWS region"
  type        = string
  default     = "us-east-1"
}

variable "environment" {
  description = "Environment name (dev, staging, uat, prd)"
  type        = string
  validation {
    condition     = contains(["dev", "staging", "uat", "prd"], var.environment)
    error_message = "Environment must be dev, staging, uat, or prd."
  }
}

variable "domain_name" {
  description = "Domain name for the application"
  type        = string
}

variable "certificate_domain" {
  description = "Domain for ACM certificate (used to lookup existing certificate)"
  type        = string
}

variable "hosted_zone_id" {
  description = "Route 53 Hosted Zone ID"
  type        = string
}

variable "enable_waf" {
  description = "Enable AWS WAF for CloudFront"
  type        = bool
  default     = true
}

variable "supabase_project_id" {
  description = "Supabase Project ID"
  type        = string
  sensitive   = true
}

variable "supabase_url" {
  description = "Supabase URL"
  type        = string
  sensitive   = true
}

variable "supabase_publishable_key" {
  description = "Supabase Publishable Key"
  type        = string
  sensitive   = true
}
