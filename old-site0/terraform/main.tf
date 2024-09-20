locals{
  # General settings
  image_major_version = "1"
  image_minor_version = "0"
  image_patch_version = format("%s-%s-%s", "local", local.image_major_version, local.image_minor_version)
  image_data_version  = "image_${local.image_major_version}.${local.image_minor_version}.${local.image_patch_version}"
  #ecr_address         = format("%v.dkr.ecr.%v.amazonaws.com", data.aws_caller_identity.current.account_id, data.aws_region.current.name)
  #base_ecr_url        = "${local.ecr_address}/${var.project}-lambda-ecr-${var.env}"
  storage_s3          = "${var.project}-web-bucket-${var.env}"
  
  # Global tags
  common_tags = {
    Project     = var.project
    Environment = var.env
    CreatedBy   = "Terraform"
    Terraform   = true
    Owner       = var.owner_tag
  } 
}

# main web content storage
module "web_storage" {
  source        = "./modules/s3-web"
  env           = var.env
  project       = var.project
  region        = var.region
  bucket        = local.storage_s3
  acl           = "public-read"
  force_destroy = true
  versioning = {
    enabled = true
  }
  website = {
    index_document = "index.html"
    error_document = "shit.html"

  }
  #logging = {
  #  target_bucket = module.logging_s3.s3_bucket_id
  #  target_prefix = "${var.project}-${var.env}"
  #}
  server_side_encryption_configuration = {
    rule = {
      apply_server_side_encryption_by_default = {
        sse_algorithm = "AES256"
      }
    }
  }
  common_tags = local.common_tags
  #depends_on = [
  #  module.logging_s3,
  #]
}

## main web logs storage
#module "logging_s3" {
#  source        = "./modules/s3-logs"
#  env           = var.env
#  project       = var.project
#  region        = var.region
#  bucket        = "${local.storage_s3}-logs"
#  force_destroy = true
#  website = {
#    index_document = "index.html"
#    error_document = "shit.html"
#
#  }
#  server_side_encryption_configuration = {
#    rule = {
#      apply_server_side_encryption_by_default = {
#        sse_algorithm = "AES256"
#      }
#    }
#  }
#  common_tags = local.common_tags
#}

## main SSL Certificate
#resource "aws_acm_certificate" "cert" {
#  provider = aws.acm
#
#  domain_name               = var.domain_name
#  subject_alternative_names = ["*.${var.domain_name}"]
#  validation_method         = "DNS"
#
#  lifecycle {
#    create_before_destroy = true
#  }
#
#  tags = merge(local.common_tags, map(
#    "Name", "${var.project}-${var.env}-dist"
#  ))
#}
#
## main cloudfront distribution
#module "cloudfront" {
#  source             = "./modules/cloudfront"
#  env                = var.env
#  project            = var.project
#  region             = var.region
#  domain_name        = var.domain_name
#  bucket_domain      = module.main_s3.s3_bucket_regional_domain_name
#  logs_bucket_domain = module.logging_s3.s3_bucket_regional_domain_name
#  s3_origin_id       = local.s3_origin_id
#  acm_cert_arn       = aws_acm_certificate.cert.arn
#  common_tags        = local.common_tags
#}
