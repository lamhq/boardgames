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

variable "github_repo_id" {
  description = "Project GitHub repository"
  type        = string
  default     = "github-username/repository-name"
}