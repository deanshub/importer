'use strict';
var app = require('app');  // Module to control application life.
var BrowserWindow = require('browser-window');  // Module to create native browser window.

// Report crashes to our server.
require('crash-reporter').start();

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the javascript object is GCed.
var mainWindow = null;

/******** CLI section ********************/
var importsExports= require('./app/importsExportsCli');

var options = require('optimist')
		.usage('\n\nThe importer.\nGive the flags for source and target and then strings to support them, example:\nimporter . --sf --dm "C:\\json-directory" "mongodb://user:password@127.0.0.1:27017/mydb" "mycollection" \nFor more information, visit https://github.com/deanshub/importer\n')
		// source
		.boolean('sf')
		.describe('sf','Use file as the source')
		.boolean('sd')
		.describe('sd','Use directory as the source')
		.boolean('su')
		.describe('su','Use URL as the source')
		.boolean('sm')
		.describe('sm','Use MongoDB as the source')
		// destination
		.boolean('df')
		.describe('df','Use file as the destination')
		.boolean('dm')
		.describe('dm','Use MongoDB as the destination')
	    .boolean('h')
	    .alias('h','help')
	    .describe('h','Print usage instructions')
		.argv;	


if (options&&options.help){
	console.log(require('optimist').help());
	app.quit();
}else if((options.sf||options.sd||options.su||options.sm) && (options.df||options.dm)){
	var selectedSource;
	var fromForm={};
	var selectedTarget;
	var toForm={};
	var argIndex=0;

	if (options.sf){
		selectedSource='File';
		fromForm.file={
			path:options._[argIndex]
		};
		argIndex++;
	}else if (options.sd){
		selectedSource='Directory';
		fromForm.folder={
			path:options._[argIndex]
		};
		argIndex++;
	}else if (options.su){
		selectedSource='URL';
		fromForm.url=options._[argIndex];
		fromForm.collection=options._[argIndex+1];
		argIndex++;
		argIndex++;
	}else if (options.sm){
		selectedSource='MongoDB';
		fromForm.url=options._[argIndex];
		argIndex++;
	}

	if(options.df){
		selectedTarget='File';
		toForm.fileName=options._[argIndex];
	}else if(options.dm){
		selectedTarget='MongoDB';
		toForm.url=options._[argIndex];
		toForm.collection=options._[argIndex+1];
	}

console.log(options._);
	var context = {
		selectedSource:selectedSource,
		selectedTarget:selectedTarget,
		fromForm:fromForm,
		toForm:toForm
	};

	importsExports(context).then(function(){
		console.log('All done!');
		app.quit();
	}).catch(function(err){
		console.log(err);
		app.quit();
	});

/******** CLI section ********************/
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