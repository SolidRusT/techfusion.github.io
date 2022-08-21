#!/bin/bash
set -o nounset
set -o errexit
 
echo "###############################"
echo "## Starting Terraform script ##"
echo "###############################"

export ENV="${ENV:-prod}"
export AWS_REGION="${AWS_REGION:-us-east-1}"
export PROJECT="techfusion-frontend"

APPLY=${1:-0} #If set terraform will force apply changes

terraform init \
-backend-config="bucket=${PROJECT}-tfstate-${AWS_REGION}-${ENV}" \
-backend-config="key=${ENV}/project-infra.tfstate" \
-backend-config="region=${AWS_REGION}"

terraform validate
terraform plan -var-file=envs/${ENV}.tfvars

if [ $APPLY == 2 ]; then
    echo "###############################"
    echo "## Executing terraform destroy ##"
    echo "###############################"
    terraform destroy --auto-approve -var-file=envs/${ENV}.tfvars
fi
 
if [ $APPLY == 1 ]; then
    echo "###############################"
    echo "## Executing terraform apply ##"
    echo "###############################"
    terraform apply --auto-approve -var-file=envs/${ENV}.tfvars
fi
