var cnn = require('./parsers/cnn.js'),
    washpost = require('./parsers/washpost.js'),
    md5 = require('md5'),
    AWS = require('aws-sdk'),
    tableName = process.env.DYNAMODB_TABLE_NAME,
    currentHashes = [],
    putItems = [];

if(tableName.length === 0) {
    throw new Error("ERROR: tableName has zero length");
}

AWS.config.update({
    region: 'us-east-1',
    verifySSL: false // because Docker
});

var dynamodb = new AWS.DynamoDB();


// Do the Thing.
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



/**
 *
 * @param {*} category
 * @param {*} categoryArray
 *
 * Return an array of items formatted for a DynamoDB insert
 */
function parseCategory(category, categoryArray) {
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

/**
 * 
 * @param {*} item
 * @param {*} hash
 *
 * Return false if:
 *  - title or url is of 0 length, or
 *  - hash is in currentHashes
 *  - item.url has more than one occurence of "http"
 *
 * otherwise true
 */
function isValidItem(item, hash) {
    if(item.title.length === 0 ||
        item.url.length === 0 ||
        currentHashes.indexOf(hash) >= 0 ||
        item.url.split('http').length > 2) {
            return false;
    } else {
        return true;
    }
}

/**
 * 
 * @param {*} items
 *
 * Split items into groups of max 25 items
 */
function splitBatch(items) {
    var groups = [],
        size = 25;

    while(items.length > 0) {
        groups.push(items.slice(0, size));
        items = items.slice(size);
    }

    return groups;
}

/**
 * 
 * @param {*} items
 *
 * Perform a batch write to DynamoDb
 */
function batchWrite(items) {
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

/**
 * 
 * @param {*} items
 *
 * Splits item results and perform batch writes
 */
function batchWriteItems(items) {

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

/**
 *  Fetch the current item hashes from DynamoDB
 */
function fetchHashes() {
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

function setCurrentHashes(hashes) {
    currentHashes = hashes;
    return Promise.resolve();
}

/**
 * 
 * @param {*} items
 *
 * Gather items from each parse action into a common place
 */
function gatherResults(items) {
    if(typeof(items) !== 'undefined') {
        var keys = Object.keys(items);
        keys.forEach(key => {
            putItems = putItems.concat(parseCategory(key, items[key]));
        });
    }
    return putItems;
}
