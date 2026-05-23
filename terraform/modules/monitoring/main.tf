variable "environment" {
  type = string
}

variable "cloudfront_distribution_id" {
  type = string
}

variable "s3_bucket_name" {
  type = string
}

resource "aws_cloudwatch_log_group" "cloudfront" {
  name              = "/aws/cloudfront/cloud-it-control-${var.environment}"
  retention_in_days = 30
}

resource "aws_cloudwatch_metric_alarm" "origin_latency" {
  alarm_name          = "CloudITControl-${var.environment}-OriginLatency-High"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = 2
  metric_name         = "OriginLatency"
  namespace           = "AWS/CloudFront"
  period              = 300
  statistic           = "Average"
  threshold           = 1000
  alarm_description   = "Alert when CloudFront origin latency is high"
  treat_missing_data  = "notBreaching"
  
  dimensions = {
    DistributionId = var.cloudfront_distribution_id
  }
}

resource "aws_cloudwatch_metric_alarm" "errors_4xx" {
  alarm_name          = "CloudITControl-${var.environment}-4XXErrors-High"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = 2
  metric_name         = "4XXError"
  namespace           = "AWS/CloudFront"
  period              = 300
  statistic           = "Sum"
  threshold           = 100
  alarm_description   = "Alert when 4XX errors exceed threshold"
  treat_missing_data  = "notBreaching"
  
  dimensions = {
    DistributionId = var.cloudfront_distribution_id
  }
}

resource "aws_cloudwatch_metric_alarm" "errors_5xx" {
  alarm_name          = "CloudITControl-${var.environment}-5XXErrors-High"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = 1
  metric_name         = "5XXError"
  namespace           = "AWS/CloudFront"
  period              = 60
  statistic           = "Sum"
  threshold           = 10
  alarm_description   = "Alert when 5XX errors exceed threshold"
  treat_missing_data  = "notBreaching"
  
  dimensions = {
    DistributionId = var.cloudfront_distribution_id
  }
}
