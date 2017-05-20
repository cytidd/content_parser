var cnn = require('./parsers/cnn.js');

cnn.parseCNN()
.then(function(result){
    console.log(result);
})
.catch(function(error){
    console.log('Error', error);
});
