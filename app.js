var express = require('express');
var pug = require('pug');

var app = express();

var server = app.listen(8080)

var io = require('socket.io').listen(server);

app.use(express.static('public'));
app.set('view engine', 'pug');

app.get('/',function(req, res) {
	res.render('home')
})

var users = [],
	connections = [];

io.sockets.on('connection',function(socket) {
	connections.push(socket);
	console.log('Connected: %s sockets connected', connections.length)
	
	// Disconnect
	socket.on('disconnect',function(data) {
			users.splice(users.indexOf(socket.username),1)
			updateUsernames()
		connections.splice(connections.indexOf(socket), 1)
		console.log('Disconnected: %s sockets connected', connections.length)
	})

	// Send Message
	socket.on('Send Message',function(data) {
		io.sockets.emit('New Message',{
			msg: data,
			user: socket.username
		})
	})

	// New User
	socket.on('New User',function(data,callback) {
		callback(true);
		socket.username = data;
		users.push(socket.username)
		updateUsernames()
	})

	function updateUsernames() {
		io.sockets.emit('Get Users', users)
	}
	
})


