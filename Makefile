PARSER_VERSION=latest
PARSER=content_parser
TESTER=tester
DOCKER_IMAGE=${CP_DOCKER_USERNAME}/content_parser:${PARSER_VERSION}

parse: build run

build:
	docker-compose build ${PARSER}

run:
	docker-compose run --rm ${PARSER}

unit-tests:
	docker-compose run --rm ${TESTER}

login:
	docker login -u ${CP_DOCKER_USERNAME} -p "${CP_DOCKER_PASSWORD}"

push:
	docker push ${DOCKER_IMAGE}
