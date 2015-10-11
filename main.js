var app = require('app');
var BrowserWindow = require('browser-window');
var path = require('path');
var fs = require('fs');
var cnf = null;
var fl = fs.readFileSync(path.join(__dirname, 'cnf.js'), {encoding: 'utf-8'});
cnf = JSON.parse(fl);
var mainWindow = null;

function oauth(){
	var w = null;
	w = new BrowserWindow({
		width: 800,
		height: 600
	});

	w.loadUrl('https://oauth.vk.com/authorize?client_id=3735228&display=page&redirect_uri=https://oauth.vk.com/blank.html&scope=friends,messages,offline&response_type=token&v=5.37');
	w.show();
	w.webContents.on('did-get-redirect-request', function(ev, oldUrl, newUrl){
		console.log(newUrl);
		if (newUrl.search('access_token') == -1)
		{
			return;
		}

		var raw_token = /access_token=([^&]*)/.exec(newUrl) || null,
	    token = (raw_token && raw_token.length > 1) ? raw_token[1] : null,
	    error = /\?error=(.+)$/.exec(newUrl);

	    if (token){
	    	cnf.token = token;
	    	fs.writeFileSync(path.join(__dirname, 'cnf.js'), JSON.stringify(cnf));
	    	w.close();
	    	loadMainWindow();
	    }
	});
}

function loadMainWindow(){
		mainWindow = new BrowserWindow({
			width: 310,
			height: 600,
			// resizable: false
		});
		
		mainWindow.loadUrl(path.join('file://', __dirname, '/index.html'));
		mainWindow.on('closed', function(){
			mainWindow = null;
		});

}

app.on('window-all-closed', function(){
	
	if (process.platform !== 'darwin'){
		app.quit();
	}
});

app.on('ready', function(){
	if (!cnf.token)
	{
		oauth();
	}
	else
	{
		loadMainWindow();
	}

});

