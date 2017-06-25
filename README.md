# [wip] content_parser

[![CircleCI](https://circleci.com/gh/cytidd/content_parser/tree/master.svg?style=svg)](https://circleci.com/gh/cytidd/content_parser/tree/master)

Parses news websites and writes new links to a DynamoDB table.

### sites currently parsing
- CNN
- Washington Post

### setup

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

### run
```bash
git clone git@github.com:cytidd/content_parser.git .
make
```
