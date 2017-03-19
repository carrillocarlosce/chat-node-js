var mongo = require('mongoose');
var Schema = mongo.Schema; 

mongo.connect('mongodb://127.0.0.1:27017/chat')

var msg_schema = new Schema({
	 user: String,
	 msg: String
});

var Messages = mongo.model('Messages', msg_schema);

module.exports.Messages = Messages;
