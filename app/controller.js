'use strict';
var browser = require('./browser');
var remote = browser.remote;
var mongo = remote.require('mongoskin');
var Q = remote.require('q');
var $ = require('jquery');

function mainCtrl(dataSources, $scope) {
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

	function getDbUrl(connObj){
		var url = 'mongodb://';
		if (connObj.user) {
			url+=connObj.user;
			if (connObj.password) {
				url+=':'+connObj.password;

			}	
			url+='@';
		}

		url+=connObj.host||'localhost';
		if (connObj.port){
			url+=':'+connObj.port;
		}

		if(connObj.db){
			url+='/'+connObj.db;
			return url;
		}else{
			return null;
		}
	}

	self.importer = function(){
		self.loading = true;

		Q.promise(function(resolve,reject){
			// source handling
			if (self.selectedSource==='File'){
				if (/\.json$/i.test(self.fromForm.file.path)){
					try{
						resolve(remote.require(self.fromForm.file.path));
					}catch(e){
						reject(self.fromForm.file.path + ' is not a valid json file');
					}
				}else if (/\.csv$/i.test(self.fromForm.file.path)){
					// parse csv
				}else{
					// try both
				}
			}else if (self.selectedSource==='URL'){
			}else if (self.selectedSource==='Text'){
				// try json parsing
				try{
					resolve(JSON.parse(self.fromForm.text));
				}catch(e){
					// try csv parsing

				}
			}else if (self.selectedSource==='MongoDB'){
				var url = getDbUrl(self.fromForm);
				if (url){
					var db = mongo.db(url);
					db.collection(self.fromForm.collection).find().toArray(function(err,result){
						if(err){
							reject('could not get specified collection form data source');
						}
						resolve(result);
					});
				}else{
					reject('DB name not provided in data source');
				}
			}
		}).then(function(imported){
			return Q.promise(function(resolve, reject){
				if (!imported){
					// if no errors present one
					reject('This source can\'t be imported');
				// target handling
				}else if (imported) {
					if (self.selectedTarget==='File') {
						resolve();
					}else if (self.selectedTarget==='Text'){						
						$scope.$apply(function(){
							$('#toFormText').html(JSON.stringify(imported,null,2).replace(/\n/g,'<br/>'));
						});
						resolve();
					}else if (self.selectedTarget==='MongoDB'){
						var url = getDbUrl(self.toForm);
						if (url){
							var db = mongo.db(url);
							db.collection(self.toForm.collection).insert(imported,function(err){
								if (err){
									reject('Could not insert to the specified collection');
								}
								db.close();
								resolve();
							});
						}else{
							reject('DB name not provided in data target');
						}
					}
				}
			});
		}).then(function(){
			self.loading = false;
		}).catch(function(err){
			console.log(err);
			self.loading=false;
			self.error = err;
		})
	};

	init();
}

module.exports = [
'dataSources',
'$scope',
mainCtrl
];