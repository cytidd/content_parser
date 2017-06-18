var cnn = require('./parsers/cnn.js'),
    washpost = require('./parsers/washpost.js'),
    md5 = require('md5'),
    AWS = require('aws-sdk'),
    tableName = "content_parser_links",
    currentHashes = [],
    putItems = [];

AWS.config.update({
    region: 'us-east-1',
    verifySSL: false // because Docker
});

var dynamodb = new AWS.DynamoDB();

/**
 * parseCategory
 *
 * @param {*} category
 * @param {*} categoryArray
 *
 * returns an array of items formatted for a DynamoDB insert
 */
var parseCategory = function(category, categoryArray) {
    var items = [],
        today = Date.now().toString(),
        category = (category === 'null' ? 'none' : category);

    categoryArray.forEach(function(item){

        var h = md5(item.url);
        if(isValidItem(item, h)) {
            items.push({
                PutRequest: {
                    Item: {
                        "hash": {
                            S: h
                        },
                        "parseDate": {
                            S: today
                        },
                        "source": {
                            S: item.source
                        },
                        "title": {
                            S: item.title
                        },
                        "url": {
                            S: item.url
                        },
                        "category": {
                            S: category
                        },
                        "read": {
                            BOOL: false
                        }
                    }
                }
            });

            // don't try to push dupes
            currentHashes.push(h);
        }
    });

    return items;
}

var isValidItem = function(item, hash) {
    if(item.title.length === 0 ||
        item.url.length === 0 ||
        currentHashes.indexOf(hash) >= 0 ||
        item.url.split('http').length > 2) {
            return false;
    } else {
        return true;
    }
}

var splitBatch = function(items) {
    var groups = [],
        size = 25;

    while(items.length > 0) {
        groups.push(items.slice(0, size));
        items = items.slice(size);
    }

    return groups;
}

var batchWrite = function(items) {
    return new Promise((resolve, reject) => {
        if(!items) {
            reject('items is null');
        }
        if(items.length < 1 || items.length > 25) {
            reject('batchWrite items.length is' + items.length +', must be between 1 and 25');
        }

        var params = { RequestItems: {} };
        params.RequestItems[tableName] = items;

        console.log('batch writing ' + items.length + ' items.');

        dynamodb.batchWriteItem(params, (err, data) => {
            console.log(err, data);
            if(err) {
                reject(err);
            } else {
                resolve(data);
            }
        });
    });
}

var batchWriteItems = function(items) {

    return new Promise((resolve, reject) => {

        if(typeof(items) === 'undefined') {
            reject('items is undefined');
        }

        var batches = splitBatch(items);
        var batchCalls = [];
        batches.forEach(batch => {
            batchCalls.push(batchWrite(batch));
        });

        Promise.all(batchCalls).then(values => {
            resolve(values);
        }, reason => {
            reject(reason);
        });
    });
}

var fetchHashes = function() {
    return new Promise((resolve, reject) => {
        dynamodb.scan({
            TableName: tableName,
            AttributesToGet: ["hash"]
        },(err, data) => {
            if(err) {
                reject(err);
            } else {
                var hashes = data.Items.map(val => {
                    return val.hash.S;
                });
                resolve(hashes);
            }
        })
    })
}

var setCurrentHashes = function(hashes) {
    currentHashes = hashes;
    return Promise.resolve();
}

var gatherResults = function(items) {
    if(typeof(items) !== 'undefined') {
        var keys = Object.keys(items);
        keys.forEach(key => {
            putItems = putItems.concat(parseCategory(key, items[key]));
        });
    }
    return putItems;
}

fetchHashes()
.then(setCurrentHashes)
.then(cnn.parseCNN)
.then(gatherResults)
.then(washpost.parseWashingtonPost)
.then(gatherResults)
.then(batchWriteItems)
.then(result => {
    if(result) {
        console.log(result);
    }
})
.catch(error => {
    console.log('Whoops: ', error);
});
