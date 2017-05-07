parse: build run

build:
	docker-compose build dev

run:
	docker-compose run --rm dev
