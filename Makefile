PARSER_VERSION=latest
PARSER=content_parser
TESTER=tester
USERNAME=$(shell whoami)
DOCKER_IMAGE=${CP_DOCKER_USERNAME}/content_parser:${PARSER_VERSION}

parse: build run

build:
	docker-compose build ${PARSER}

run:
	./runscripts/run.sh ${PARSER}

unit-tests:
	docker-compose run --rm ${TESTER}

# Docker
login:
	docker login -u ${CP_DOCKER_USERNAME} -p "${CP_DOCKER_PASSWORD}"

push:
	docker push ${DOCKER_IMAGE}

# Terraform
plan:
	./runscripts/do-terraform.sh plan

apply:
	./runscripts/do-terraform.sh apply

destroy:
	./runscripts/do-terraform.sh destroy
