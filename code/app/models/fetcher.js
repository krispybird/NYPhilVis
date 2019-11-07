//fetches data from the collection 'nyphil' and serves it as an API
// define our model
// module.exports allows us to pass this to other files when it is called
module.exports = connection.model('', {}, 'nyphil');
