var express = require('express');
var app = express();
var io = require('socket.io').listen(3030,function() {
	console.log('Server is Running...')
})