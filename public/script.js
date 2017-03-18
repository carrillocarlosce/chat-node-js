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

	$('#messageForm').submit(function(e) {
		e.preventDefault();
		socket.emit('Send Message', $message.val());
		$message.val('');
	})

	socket.on('New Message',function(data) {
		if (data.user != $thisuser) {
			var classes = 'style="float:left"'
			var alertcolor = 'alert-success'
		}else{
			var classes = 'style="float:right"';
			var alertcolor = 'alert-info'
		}
		$chat.append($('<div class="container-fluid row"><span class="chat-msg alert '+alertcolor+'" '+classes+'><b>'+data.user+': </b>'+data.msg+'</span></div>'))
		document.getElementById("scroll").scrollTop = document.getElementById("chat").scrollHeight;
		if (data.user != $thisuser) {
			audio.play();
		}else{}
	})

	$('#userForm').submit(function(e) {
		e.preventDefault();
		socket.emit('New User', $username.val(),function(data) {
			if (data) {
				$thisuser = $username.val();
				$userFormArea.hide();
				$messageArea.show();
			}
		});
	})

	socket.on('Get Users',function(data) {
		// body...
		var html = '';
		for(i = 0;i < data.length;i++){
			html += '<li class="list-group-item">'+data[i]+'</li>'
		}
		$users.html(html)
	})
});