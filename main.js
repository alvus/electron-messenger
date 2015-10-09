var app = require('app');
var BrowserWindow = require('browser-window');
var path = require('path');

var mainWindow = null;

app.on('window-all-closed', function(){
	
	if (process.platform !== 'darwin'){
		app.quit();
	}
});

app.on('ready', function(){
	mainWindow = new BrowserWindow({
		width: 300,
		height: 800,
		// resizable: false
	});
	
	mainWindow.loadUrl(path.join('file://', __dirname, '/index.html'));
	mainWindow.on('closed', function(){
		mainWindow = null;
	});

});

