# [wip] content_parser

[![CircleCI](https://circleci.com/gh/cytidd/content_parser/tree/master.svg?style=svg)](https://circleci.com/gh/cytidd/content_parser/tree/master)

Parses news websites and writes new links to a database.  Demonstrates use of automated infrastructure.

Primary technologies used:
- [Amazon AWS](https://aws.amazon.com/)
- [Terraform](https://www.terraform.io/)
- [Docker](https://www.docker.com/)
- [Nightmare](https://github.com/segmentio/nightmare)

### sites currently parsing
- CNN
- Washington Post

### major todos
This is a work in progress. Stuff I would like to add:
- enable running container in ECS
- generate API Gateway resources with Terraform

### Prerequisites
- [Docker](https://www.docker.com/)
    - this project uses `docker-compose` version 3
- An Amazon [AWS account](https://aws.amazon.com/)
- [Terraform](https://www.terraform.io/)

### setup

Clone this repo:
```bash
git clone git@github.com:cytidd/content_parser.git
```

Setup AWS infrastructure via [Terraform](https://www.terraform.io/). Requires an [AWS account](https://aws.amazon.com/).

Required environment variables:
```bash
CP_AWS_ACCESS_KEY_ID
CP_AWS_SECRET_ACCESS_KEY
```

First time setup:
```
cd terraform
terraform init
cd ..
```

To instantiate the AWS infrastructure:
```bash
make plan   # to see what Terraform will do
make apply  # to create resources (DynamoDB table)
```

### running

Build and run:
```bash
make
```

Just run (refrains from rebuilding the container):
```bash
make run
```

### destroy

**WARNING:** THIS WILL DESTROY THE DB TABLE AND ALL CONTENT YOU HAVE CREATED.

Use Terraform to destroy resources (it will ask you for confirmation):
```bash
make destroy
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

