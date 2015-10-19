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
		};

		var userArray = data.response.items;
		var onlineCounter = 0;
		for(var i = 0; i < userArray.length; i++){
			if (!userArray[i].online){
				continue;
			};
			var divString = '<div class="contact"  onclick="loadChat(' + userArray[i].id + ')" ><div class="avatar"><img src="' + userArray[i].photo_50 + '" height="25" width="25"></div><div class="name" id="contact_' +  userArray[i].id+ '"><b>' + userArray[i].first_name + ' ' + userArray[i].last_name + '</b></div></div>';
			
			var contactDiv = $(divString);

			$('main').append(contactDiv);
			onlineCounter++;
		}
		$('.onlineCounter').append(onlineCounter);
	});
}

function loadChat(uid){
	window.open(path.join('file://', __dirname, 'chat.html') + '?uid=' + uid, '', 'height=700,width=600');
}