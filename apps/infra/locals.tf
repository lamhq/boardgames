# User-defined values used in Terraform code
locals {
  env         = terraform.workspace == "default" ? "prod" : terraform.workspace
  name_prefix = "${var.project}-${local.env}"
}
