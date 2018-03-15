const mongoose = require('mongoose');
const config = require('config');

mongoose.connect(`mongodb://${config.mongo.host}:${config.mongo.port}/${config.mongo.dbName}`);

mongoose.connection.on('connected', function () { 
  console.log('Mongoose default connection open');
}); 

exports = module.exports = {
	connection: mongoose.connection
}