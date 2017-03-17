$(function () {
	var socket = io.connect();
	var $messageForm = $('#messageForm');
	var $message = $('#message');
	var $chat = $('#chat')

	var $userForm = $('#userForm');
	var $userFormArea = $('#userFormArea');
	var $messageArea = $('#messageArea');
	var $users = $('#users');
	var $username = $('#user');

	$('#messageForm').submit(function(e) {
		e.preventDefault();
		socket.emit('Send Message', $message.val());
		$message.val('');
	})

	socket.on('New Message',function(data) {
		$chat.append($('<div class="chat-msg alert alert-info"><b>'+data.user+': </b>'+data.msg+'</div>'))
	})

	$('#userForm').submit(function(e) {
		e.preventDefault();
		socket.emit('New User', $username.val(),function(data) {
			if (data) {
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