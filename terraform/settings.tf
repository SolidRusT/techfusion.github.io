# Console settings
terraform {
  required_version = ">= 0.15.5"
}

terraform {
  backend "s3" {}
}

provider "aws" {
  region  = var.region
}

# Import console data
data "aws_caller_identity" "current" {}
data "aws_region" "current" {}
data "aws_iam_session_context" "current" {
  arn = data.aws_caller_identity.current.arn
}

## Certificate Manager
#provider "aws" {
#  alias  = "acm"
#  region = "us-east-1"
#}

# Project settings
variable "env" {
    default =  "prod"
}

variable "region" {
    default = "us-east-1"
}

variable "project" {
  default = "techfusion-frontend"
}

variable "domain_name" {
  default = "techfusion.ca"
}

variable "owner_tag" {
    default = "SolidRusT Networks"
}

# external data
#data "external" "script" {
#  program = ["bash", "./get_ip.sh"] // get_ip.sh is your script name
#}
