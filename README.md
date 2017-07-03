# [wip] content_parser

[![CircleCI](https://circleci.com/gh/cytidd/content_parser/tree/master.svg?style=svg)](https://circleci.com/gh/cytidd/content_parser/tree/master)

Parses news websites and writes new links to a DynamoDB table.  Uses [Docker](https://www.docker.com/) and [Nightmare](https://github.com/segmentio/nightmare).

### sites currently parsing
- CNN
- Washington Post

### parser setup

Two environment variables:
```bash
CP_AWS_ACCESS_KEY_ID
CP_AWS_SECRET_ACCESS_KEY
```

A DynamoDB table named `content_parser_links` with the following schema:
```
    Item: {
        "hash": S (primary key),
        "parseDate": S,
        "source": S,
        "title": S,
        "url": S,
        "category": S,
        "read": BOOL
    }
```

TODO: Include a Terraform module that does the Dynamo setup.

### run
```bash
git clone git@github.com:cytidd/content_parser.git .
make
```

### docker setup

If you push your own version of the content parser Docker image to Dockerhub, you will need

Two environment variables:
```bash
CP_DOCKER_USERNAME
CP_DOCKER_PASSWORD
```

To push:
```bash
make login
make push
```
