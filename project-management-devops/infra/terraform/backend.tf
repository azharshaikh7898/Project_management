terraform {
  # For local development, comment out the S3 backend below and use local state.
  # 
  # For production, configure these values:
  # backend "s3" {
  #   bucket         = "your-terraform-state-bucket"
  #   key            = "project-management/prod/terraform.tfstate"
  #   region         = "us-east-1"
  #   encrypt        = true
  #   use_lockfile   = true
  # }
}