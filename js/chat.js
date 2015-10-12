var remote = require('remote');
var VK = remote.require('vksdk');
var fs = remote.require('fs');
var path = remote.require('path');
var cnf = null;
var fl = fs.readFileSync(path.join(__dirname, 'cnf.js'), {encoding: 'utf-8'});
cnf = JSON.parse(fl);

var vk = new VK({
	'appId': cnf.appId,
	'appSecret': cnf.appSecret,
	'language': 'ru'
});

vk.setToken(cnf.token);
vk.setSecureRequests(true);

var uid = null;

var uid_raw = /uid=(\d+)/.exec(location.href) || null;
uid = (uid_raw && uid_raw.length > 0) ? uid_raw[1] : null;
if (uid == null){
	window.close();
}

loadUserInfo();
loadChat();

function loadChat(){
	vk.request('messages.getHistory', {user_id: uid}, function(data){
		if (!data.response){
			return;
		}

		console.log(JSON.stringify(data));

		for (var i = data.response.items.length-1; i >= 0;  i--){
			var direct = '>>>';
			var cls = 'sent';
			if (data.response.items[i].from_id == uid){
				direct = '<<<';
				cls = 'incoming';
			}

			var messageTime = new Date(data.response.items[i].date * 1000);
			console.log(data.response.items[i].body.replace('<', '&lt;').replace('>', '&gt;'));
			var body = data.response.items[i].body.replace(new RegExp('<', 'g'), '&lt;');
			body = body.replace(new RegExp('>', 'g'), '&gt;');
			var patt = /(\b(https?|ftp):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gim;
			body = body.replace(patt, '<a href="$1" target="_blank">$1</a>')
			var dialog = $('<div class="' + cls + '">' + direct + ' [' + messageTime.toLocaleString('ru') + '] ' + body +  '</div>');

			$('main').append(dialog);
		}
	});
}

function loadUserInfo(){
	vk.request('users.get', {fields: 'photo_50', user_id: uid}, function(data){
		if (!data.response){
			return;
		}
		console.log(JSON.stringify(data));
		$('#acc-name').text(data.response[0].first_name + ' ' + data.response[0].last_name);
		$('#my-profile-image').attr('src', data.response[0].photo_50);
	});
}