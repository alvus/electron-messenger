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
loadAccountInfo();
loadContactList();

function loadAccountInfo(){
	vk.request('users.get', {fields: 'photo_50'}, function(data){
		if (!data.response){
			return;
		}
		console.log(JSON.stringify(data));
		$('#acc-name').text(data.response[0].first_name + ' ' + data.response[0].last_name);
		$('#my-profile-image').attr('src', data.response[0].photo_50);
	});
}

function loadContactList(){
	vk.request('friends.get', {fields: 'photo_50,online', order: 'hints'}, function(data){
		if (!data.response){
			return;
		}
		
		for (var i = 0; i < data.response.items.length; i++){
			if (!data.response.items[i].online){
				continue;
			}
			var contactDiv = $('<div class="contact"><div class="avatar"><a href="https://vk.com/id' + data.response.items[i].id + '" target="_blank"><img src="' + data.response.items[i].photo_50 + '" height="25" width="25"></a></div><div class="name" onclick="loadChat(' + data.response.items[i].id + ')" id="contact_' +  data.response.items[i].id+ '"><b>' + data.response.items[i].first_name + ' ' + data.response.items[i].last_name + '</b></div></div>');
			$('main').append(contactDiv);

		}
	});
}

function loadChat(uid){
	window.open(path.join('file://', __dirname, 'chat.html') + '?uid=' + uid, '', 'height=700,width=600');
}