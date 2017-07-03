#!/bin/bash

TERRAFORM_COMMAND=$1

ACCESS_KEY=$CP_AWS_ACCESS_KEY_ID
SECRET_KEY=$CP_AWS_SECRET_ACCESS_KEY
USER_ID=`whoami`
TABLE_NAME="${USER_ID}_content_parser_links"

pushd terraform

# generate tfvars file
echo "aws_access_key=\"$ACCESS_KEY\"" > terraform.tfvars
echo "aws_secret_key=\"$SECRET_KEY\"" >> terraform.tfvars
echo "user_id=\"$USER_ID\"" >> terraform.tfvars
echo "dynamodb_table_name=\"$TABLE_NAME\"" >> terraform.tfvars

# plan it!
terraform $TERRAFORM_COMMAND

# cleanup
rm terraform.tfvars

popd
