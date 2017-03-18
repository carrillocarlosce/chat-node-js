$(function () {
	var socket = io.connect();
	var $messageForm = $('#messageForm');
	var $message = $('#message');
	var $chat = $('#chat');

	var audio = new Audio('notificacion.mp3');

	var $userForm = $('#userForm');
	var $userFormArea = $('#userFormArea');
	var $messageArea = $('#messageArea');
	var $users = $('#users');
	var $username = $('#user');
	var $thisuser = '';

	var $status = $('#status');

	var $statusDefault = $('#status').text();

	$('#messageForm').submit(function(e) {
		e.preventDefault();
		socket.emit('Send Message', $message.val());
		$chat.append($('<div class="container-fluid row"><span class="chat-msg alert alert-info" style="float:right"><b>Tu: </b>'+$message.val()+'</span></div>'))
		$message.val('');
		scrollDown()
	})

	setStatus = function(s) {
		$('#status').text(s)

		if (s != $statusDefault) {
			var delay = setTimeout(function() {
				$('#status').text($statusDefault)
				clearInterval(delay)
			}, 3000);
		}
	}
	scrollDown = function() {
		document.getElementById("scroll").scrollTop = document.getElementById("chat").scrollHeight;
	}
	scrollDown();
	socket.on('All Messages', function(data) {
		console.log(data)
	})
	socket.on('Status',function(data) {
		setStatus(data)
	})
	socket.on('New Message',function(data) {
		if (data.user) {
			var classes = 'style="float:left"'
			var alertcolor = 'alert-success'
		}else{
			var classes = 'style="float:right"';
			var alertcolor = 'alert-info'
		}
		$chat.append($('<div class="container-fluid row"><span class="chat-msg alert '+alertcolor+'" '+classes+'><b>'+data.user+': </b>'+data.msg+'</span></div>'))
		scrollDown()
		if (data.user != $thisuser) {
			audio.play();
		}else{}
	})

	socket.emit('New User');

	socket.on('Get Users',function(data) {
		// body...
		var html = '';
		for(i = 0;i < data.length;i++){
			html += '<li class="list-group-item">'+data[i]+'</li>'
		}
		$users.html(html)
	})
});