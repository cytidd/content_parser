provider "aws" {
    access_key = "${var.aws_access_key}"
    secret_key = "${var.aws_secret_key}"
    region     = "${var.aws_region}"
}

resource "aws_dynamodb_table" "parser-dynamodb-table" {
    name           = "${var.dynamodb_table_name}"
    read_capacity  = 5
    write_capacity = 5
    hash_key       = "hash"

    attribute {
        name = "hash"
        type = "S"
    }

}

output "dynamodb_table_name" {
    value = "${aws_dynamodb_table.parser-dynamodb-table.name}"
}
