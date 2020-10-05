var mongo = require('mongodb')

var connection = function(){
	return new mongo.Db('lojavip',
		new mongo.Server('localhost', 27017)
	)
}

module.exports = function(){
	return connection
}