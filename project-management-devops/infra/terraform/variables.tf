variable "project" {
  type        = string
  description = "Project identifier"
  default     = "project-management"
}

variable "environment" {
  type        = string
  description = "Deployment environment"
  default     = "prod"
}

variable "owner" {
  type        = string
  description = "Owner/team"
  default     = "platform-engineering"
}

variable "cost_center" {
  type        = string
  description = "Cost center tag"
  default     = "engineering"
}

variable "aws_region" {
  type    = string
  default = "us-east-1"
}

variable "account_suffix" {
  type        = string
  description = "Unique suffix for globally unique buckets"
}

variable "vpc_cidr" {
  type    = string
  default = "10.40.0.0/16"
}

variable "acm_certificate_arn" {
  type        = string
  description = "ACM certificate ARN for TLS"
}

variable "app_ami_id" {
  type        = string
  description = "AMI ID for app EC2 instances"
}

variable "app_instance_type" {
  type    = string
  default = "t3.medium"
}

variable "backend_ecr_image" {
  type        = string
  description = "ECR image URI for backend"
}

variable "database_url" {
  type        = string
  description = "Backend DB URL"
  sensitive   = true
}

variable "jwt_secret" {
  type        = string
  sensitive   = true
  description = "JWT signing secret"
}

variable "asg_min_size" {
  type    = number
  default = 2
}

variable "asg_desired_capacity" {
  type    = number
  default = 2
}

variable "asg_max_size" {
  type    = number
  default = 6
}

variable "db_instance_class" {
  type    = string
  default = "db.t4g.medium"
}

variable "db_name" {
  type    = string
  default = "project_management"
}

variable "db_username" {
  type    = string
  default = "app_admin"
}

variable "db_password" {
  type      = string
  sensitive = true
}

variable "db_allocated_storage" {
  type    = number
  default = 100
}

variable "db_max_allocated_storage" {
  type    = number
  default = 500
}

variable "rds_connection_threshold" {
  type    = number
  default = 200
}