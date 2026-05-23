output "cloudfront_distribution_id" {
  description = "CloudFront Distribution ID"
  value       = module.cloudfront.cloudfront_distribution_id
}

output "cloudfront_domain_name" {
  description = "CloudFront Distribution Domain Name"
  value       = module.cloudfront.cloudfront_domain_name
}

output "s3_bucket_name" {
  description = "S3 Bucket Name"
  value       = module.frontend_bucket.bucket_name
}

output "s3_bucket_arn" {
  description = "S3 Bucket ARN"
  value       = module.frontend_bucket.bucket_arn
}

output "website_url" {
  description = "Website URL"
  value       = "https://${var.domain_name}"
}

output "github_actions_role_arn" {
  description = "GitHub Actions IAM Role ARN"
  value       = module.github_actions.github_actions_role_arn
}
