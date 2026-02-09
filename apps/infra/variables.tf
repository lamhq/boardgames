variable "aws_region" {
  description = "AWS region"
  type        = string
  default     = "us-east-1"
}

variable "project" {
  description = "Project name"
  type        = string
  default     = "boardgames"
}

variable "environment" {
  description = "Environment name"
  type        = string
  default     = "dev"
}

variable "github_repo_id" {
  description = "GitHub repository that contains project source code"
  type        = string
  default     = "github-username/repository-name"
}