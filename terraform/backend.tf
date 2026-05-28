terraform {
  backend "s3" {
    # Backend configuration provided via command line or environment variables
    # Example:
    # terraform init \
    #   -backend-config="bucket=cloud-it-control-tf-state-123456789" \
    #   -backend-config="key=dev/terraform.tfstate" \
    #   -backend-config="region=ap-south-1" \
    #   -backend-config="encrypt=true" \
    #   -backend-config="dynamodb_table=terraform-locks"
    
    # This file is intentionally left without default values
    # to ensure explicit configuration per environment
  }
}
