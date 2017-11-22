PARSER_VERSION=latest
PARSER=content_parser
TESTER=tester
DOCKER_IMAGE=${CP_DOCKER_USERNAME}/content_parser:${PARSER_VERSION}
AWS_REGION=us-east-1

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
	./runscripts/do-terraform.sh plan ${AWS_REGION}

apply:
	./runscripts/do-terraform.sh apply ${AWS_REGION}

destroy:
	./runscripts/do-terraform.sh destroy ${AWS_REGION}
