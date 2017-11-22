#!/bin/bash

PARSER=$1

# grab some variables from the terraform output
pushd terraform
export CP_DYNAMODB_TABLE_NAME=`(terraform output dynamodb_table_name)`
export CP_AWS_REGION=`(terraform output aws_region)`
popd

# run it!
docker-compose run --rm ${PARSER}
