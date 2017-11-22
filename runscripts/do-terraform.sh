#!/bin/bash

TERRAFORM_COMMAND=$1

ACCESS_KEY=$CP_AWS_ACCESS_KEY_ID
SECRET_KEY=$CP_AWS_SECRET_ACCESS_KEY
AWS_REGION=$2
USER_ID=`whoami`
TABLE_NAME="${USER_ID}_content_parser_links"
API_NAME="${USER_ID}_content_parser_api"

pushd terraform

# generate tfvars file
echo "aws_access_key=\"$ACCESS_KEY\"" > terraform.tfvars
echo "aws_secret_key=\"$SECRET_KEY\"" >> terraform.tfvars
echo "user_id=\"$USER_ID\"" >> terraform.tfvars
echo "dynamodb_table_name=\"$TABLE_NAME\"" >> terraform.tfvars
echo "api_gateway_api_name=\"$API_NAME\"" >> terraform.tfvars
echo "aws_region=\"$AWS_REGION\"" >> terraform.tfvars

# plan it!
terraform $TERRAFORM_COMMAND

# cleanup
rm terraform.tfvars

popd
