# The OrganizationAccountAccessRole already exists in account 713678752742
# (created by AWS Organizations). We reference it by ARN instead of managing it.
# Trust policy is managed manually via update-trust-policy.bat/sh

locals {
  organization_access_role_arn = "arn:aws:iam::713678752742:role/OrganizationAccountAccessRole"
}
