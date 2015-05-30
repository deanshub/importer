'use strict';
var app = require('app');  // Module to control application life.
var BrowserWindow = require('browser-window');  // Module to create native browser window.

/******** CLI section ********************/
var cliArgs = require('command-line-args');
// var importsExports= require('./app/importsExports.js');

var cliError = false;
var cli = cliArgs([
    // { name: 'verbose', type: Boolean, alias: 'v', description: 'Write plenty output' },
    { name: 'destenation', alias: 'd', type: String, description: 'Data target type (File/MongoDB)' },
    { name: 'source', alias: 's', type: String, description: 'Data source type (File/Directory/URL/MongoDB)' },
    { name: 'spath', alias: 'sp', type: String, description: 'Data source directory path' },
    { name: 'dpath', alias: 'dp', type: String, description: 'Data target directory path' },
    { name: 'filename', alias: 'n', type: String, description: 'File name' },
    { name: 'user', alias: 'u', type: String, description: 'User name' },
    { name: 'password', alias: 'p', type: String, description: 'Password' },
    { name: 'host', alias: 'ho', type: String, description: 'Host name or IP' },
    { name: 'port', alias: 'po', type: String, description: 'Port number' },
    { name: 'db', type: String, description: 'DB name' },
    { name: 'collection', alias: 'c', type: String, description: 'collection name in the DB' },
    { name: 'help', alias: 'h', type: Boolean, description: 'Print usage instructions' }
    ]);
try{ 
	var options = cli.parse();
}catch(e){
	cliError = true;
}
var usage = cli.getUsage({
	header: 'The importer.',
	footer: '\nFor more information, visit https://github.com/deanshub/importer'
});

/******** CLI section ********************/


// Report crashes to our server.
require('crash-reporter').start();

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the javascript object is GCed.
var mainWindow = null;

console.log(options);
if (options&&options.help||cliError){
	console.log(usage);
	app.quit();
}else if(options.source && options.destenation){
	var context = {
		selectedSource:options.source,
		selectedTarget:options.destenation,
		fromForm:{},
		toForm:{}
	};

	if(options.source==='File'){
		context.fromForm.file={
			path:options.spath
		};
	}else if(options.source==='Directory'){
		context.fromForm.folder={
			path:options.spath
		};
	}

	if(options.destenation==='File'){
		context.toForm.folder={
			path:options.dpath
		};
		context.toForm.fileName = options.filename;
	}else if(options.destenation==='MongoDB'){
		context.toForm.user = options.user;
		context.toForm.password = options.password;
		context.toForm.host = options.host;
		context.toForm.port = options.port;
		context.toForm.db = options.db;
		context.toForm.collection = options.collection;
	}

	importsExports(context).then(function(){
		console.log('All done!');
		app.quit();
	}).catch(function(err){
		console.log(err);
		app.quit();
	});
}else{ 
// Quit when all windows are closed.
app.on('window-all-closed', function() {
	if (process.platform != 'darwin')
		app.quit();
});

// This method will be called when Electron has done everything
// initialization and ready for creating browser windows.
app.on('ready', function() {
	// Create the browser window.
	mainWindow = new BrowserWindow({width: 800, height: 600, frame:false});

	// and load the index.html of the app.
	mainWindow.loadUrl('file://' + __dirname + '/index.html');

	// Emitted when the window is closed.
	mainWindow.on('closed', function() {
		// Dereference the window object, usually you would store windows
		// in an array if your app supports multi windows, this is the time
		// when you should delete the corresponding element.
		mainWindow = null;
	});
});
}