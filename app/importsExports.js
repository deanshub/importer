'use strict';
var browser = require('./browser');
var remote = browser.remote;
var request = remote.require('request');
var mongo = remote.require('mongoskin');
var path = remote.require('path');
var $ = require('jquery');
var fs = remote.require('fs');

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

function importsExports(self, $scope){
	return new Promise(function(resolve,reject){
			// source handling
			if (self.selectedSource==='File'){
				if (self.fromForm.file){
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
				}else{
					reject('data source is not a valid file');
				}
			}else if (self.selectedSource==='Directory'){
				if (self.fromForm.folder && self.fromForm.folder.path){
					fs.readdir(self.fromForm.folder.path,function(err, files){
						var jsonsArr =[];
						if(err){
							reject('Directory in data source is not valid');
						}
						
						files.forEach(function(file){
							if(/\.json$/i.test(file)){
								jsonsArr.push(remote.require(path.join(self.fromForm.folder.path, file)));
							}
						});

						resolve(jsonsArr);
					});
				}else{
					reject('Directory in data source is not valid');
				}
			}else if (self.selectedSource==='URL'){
				if(self.fromForm.url){
					request(self.fromForm.url,function(err,res,body){
						if(!err && res.statusCode==200){
							resolve(JSON.parse(body));
						}else{
							reject('Could not get information from url');
						}
					});
				}else{
					reject('The url provided isn\'t allowd');
				}
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
			}else{
				reject('No data source choosen');
			}
		}).then(function(imported){
			return new Promise(function(resolve, reject){
				if (!imported){
					// if no errors present one
					reject('This source can\'t be imported');
				// target handling
				}else {
					if (self.selectedTarget==='File') {
						if (self.toForm.fileName!==''){
							fs.writeFile(path.join(self.toForm.folder?self.toForm.folder.path:'', self.toForm.fileName), JSON.stringify(imported, null, 2),function(err){
								if (err){
									reject('file could not be written in the specified path');
								}
								resolve();
							});
						}else{
							reject('data target has to be provided with a valid file name');
						}
					}else if (self.selectedTarget==='Text'){						
						$('#toFormText').html(JSON.stringify(imported,null,2).replace(/\n/g,'<br/>').replace(/ /g,'&nbsp;'));
						if (!$scope.$$phase){
							$scope.$apply();
						}
						resolve();
					}else if (self.selectedTarget==='MongoDB'){
						var url = getDbUrl(self.toForm);
						if (url){
							var db = mongo.db(url);
							if(!self.toForm.collection || self.toForm.collection===''){
								reject('Collection not specified in the data target');
							}else{
								db.collection(self.toForm.collection).insert(JSON.parse(JSON.stringify(imported)),function(err){
									if (err){
										console.log(JSON.stringify(err));
										reject('Could not insert to the specified collection');
									}
									db.close();
									resolve();
								});
							}
						}else{
							reject('DB name not provided in data target');
						}
					}else{
						reject('No data target choosen')
					}
				}
			});
		});
	}

module.exports = importsExports;