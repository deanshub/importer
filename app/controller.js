'use strict';
var browser = require('./browser');
var remote = browser.remote;
var MongoClient = remote.require('mongodb').MongoClient;

function mainCtrl(dataSources) {
	var self = this;

	function init(){
		self.loading = false;
		self.toForm={};
		self.fromForm={};

		self.dataSources = dataSources.from;
		self.dataTargets = dataSources.to;
	}

	self.close = function(){
		browser.app.quit();
	};

	self.getTargetForm = function(target){
		return target+'/toForm.html';
	};

	self.getSourceForm = function(target){
		return target+'/fromForm.html';
	};

	self.importer = function(){
		var imported;
		self.loading = true;

		// source handling
		if (self.selectedSource==='File'){
			if (/\.json$/i.test(self.fromForm.file.path)){
				try{
					imported = browser.remote.require(self.fromForm.file.path);
				}catch(e){
					console.log(e);
					self.error = self.fromForm.file.path + ' is not a valid json file';
				}
			}else if (/\.csv$/i.test(self.fromForm.file.path)){
				// parse csv
			}else{
				// try both
			}
			console.log(JSON.stringify(imported));
		}else if (self.selectedSource==='URL'){
		}else if (self.selectedSource==='Text'){
			// try json parsing
			try{
				imported = JSON.parse(self.fromForm.text);
			}catch(e){
				// try csv parsing

			}
		}else if (self.selectedSource==='MongoDB'){

		}



		if (!imported && !self.error){
			// if no errors present one
			self.error = 'This source can\'t be imported';
		// target handling
		}else if (imported) {
			if (self.selectedTarget==='File') {
				self.loading = false;
			}else if (self.selectedTarget==='Text'){
				self.toForm.text = JSON.stringify(imported,null,2);
				self.loading = false;
			}else if (self.selectedTarget==='MongoDB'){
				var url = 'mongodb://';
				if (self.toForm.user) {
					url+=self.toForm.user;
					if (self.toForm.password) {
						url+=':'+self.toForm.password;

					}	
					url+='@';
				}

				url+=self.toForm.host||'localhost';
				if (self.toForm.port){
					url+=':'+self.toForm.port;
				}

				if(self.toForm.db){
					url+='/'+self.toForm.db;
				}else{
					self.error = 'DB name not provided';
					self.loading = false;
					return;
				}

				console.log(MongoClient.connect);
				MongoClient.connect(url, function(err, db) {
					if (err){
						self.loading = false;
						self.error = 'Could not connect to the database';
						console.log(err);
					}

					db.collection(self.toForm.collection).insert(imported,function(err, result){
						if (err) {
							self.error = 'Could not insert to the specified collection';
							console.log(err);
						}
						self.loading = false;

						db.close();
					});
				});
			}
		}
	};

	init();
}

module.exports = [
'dataSources',
mainCtrl
];