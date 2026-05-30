# IAM Role for cross-account access with proper TagSession permissions
resource "aws_iam_role" "organization_access_role" {
  name = "OrganizationAccountAccessRole"
  
  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Principal = {
          AWS = [
            "arn:aws:iam::226563001214:user/santosh.mirajkar@timesgroup.com",
            "arn:aws:iam::226563001214:root"
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
    Environment = var.environment
    Purpose     = "Cross-account access with TagSession support"
  }
}

# Attach AdministratorAccess policy
resource "aws_iam_role_policy_attachment" "admin_access" {
  role       = aws_iam_role.organization_access_role.name
  policy_arn = "arn:aws:iam::aws:policy/AdministratorAccess"
}