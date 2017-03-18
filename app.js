// Requires
var express = require('express');
var pug = require('pug');
var mongo = require('mongoose');
var cookieSession = require('cookie-session');
var MessagesDB = require('./models/message').Messages;
var User = require('./models/user').User;
var bodyParser = require('body-parser');
var cookieMid = require('./middlewares/cookies');
var app = express();
// Server Run
var server = app.listen(8080)
var io = require('socket.io').listen(server);

// Static Files
app.use(express.static('public'));

// Cookie
app.use(cookieSession({
	name: 'session',
	keys: ['llave-1','llave-2']
}))

// Body Parser

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));

// View Engine
app.set('view engine', 'pug');
 
// Variables
var users = [],
	connections = [],
	current_user = '';

// Cookie

// Views
app.use('/app',cookieMid);

app.get('/app',function(req, res) {
	console.log()
	MessagesDB.find(function(err, doc) {
		if(err){
			console.log(err)
		}else{
			current_user = res.locals.user.username
			io.sockets.emit('All Messages', doc)
			io.sockets.emit('New User', current_user)
			res.render('home',{messages: doc, user: current_user})
		}
	}).limit(100).sort({_id: 1});
})

//	Sign In
app.get('/signin',function(req, res) {	
	res.render('signin')
})
app.get('/logout',function(req, res) {
	delete req.session.user_id	
	res.redirect('/signin')
})
app.post('/signin',function(req, res) {	
	User.findOne({
		email:req.body.email,
		password:req.body.password
	},function(err,user) {
		if (!err && user) {
			req.session.user_id = user._id;
			res.redirect('/app')
		}else{
			res.redirect('/signin')
		}
		
	})
})
app.get('/signup', function(req, res) {
	User.find(function(err,doc) {
		res.render('signup')
	})	
})
app.post('/signup',function(req,res) {
	var user = new User({
		username: req.body.username,
		email: req.body.email,
		password: req.body.password,
		password_confirmation: req.body.password_confirmation
	})
	user.save().then(function(us) {
		// body...
		res.redirect('/signin')
	},function(err) {
		if (err) {
			res.render('signup',{err: err})
		}
	})
})

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
	// Status
	var sendStatus = function(s) {
		io.sockets.emit('Status',s)
	}
	// Emit * Messages
	// Send Message
	socket.on('Send Message',function(data) {
		var whiteSpace = /^\s*$/;
		if (whiteSpace.test(data)) {
			sendStatus('Invalid Message')
		}else if(typeof socket.username == 'undefined' || current_user == ''){
			sendStatus('Invalid User')
		}else{
			socket.broadcast.emit('New Message',{
				msg: data,
				user: current_user
			})

			var msgDB = new MessagesDB({
				msg: data,
				user: current_user
			})
			msgDB.save().then(function(us) {
			console.log('Guardamos tus datos');
			},function(err) {if (err) {console.log(String(err));}})
		}
	})

	// New User
	socket.on('New User',function(data,callback) {
		socket.username = current_user;
		users.push(socket.username);
		updateUsernames()
	})

	function updateUsernames() {
		io.sockets.emit('Get Users', users)
	}
	
})


