'use strict';
var browser = require('./browser');
var importsExports= require('./importsExports.js');
var fs = browser.remote.require('fs');
var path = browser.remote.require('path');

function mainCtrl(dataSources, $scope) {
	var self = this;
	var tableTemplate = {
				Name:'',
				Base_Url:'',
				DataPath:'',
				Pages:{
					type:'',
					nextPageURL:'',
					chunkSize:'',
					paramStart:'',
					paramEnd:'',
					keepURL:'',
					appendParam:'',
				},
				Params:[
				{
					name:'',
					value:''
				}
				]
			};
	var manifestTemplate = {
			Config:{
				TimeBetweenCalls:1000,
				Params:[
				{
					name:'',
					value:''
				}
				]
			}, 
			Tables:[
				tableTemplate
			]
		};

	function init(){
		self.loading = false;
		self.toForm={};
		self.fromForm={};

		self.dataSources = dataSources.from;
		self.dataTargets = dataSources.to;
		self.newManifest = jQuery.extend(true, {}, manifestTemplate);
	}

	self.close = function(){
		browser.app.quit();
	};

	self.getTargetForm = function(target){
		// return require('../'+ target +'/toForm.html');
		return target +'/toForm.html';
	};

	self.getSourceForm = function(target){
		// return require('../'+ target +'/fromForm.html');
		return target +'/fromForm.html';
	};

	

	self.importer = function(){
		self.loading = true;

		importsExports(self, $scope).then(function(){
			self.loading=false;
			Materialize.toast('Done!', 4000, 'green');
			if (!$scope.$$phase){
				$scope.$apply();
			}
		}).catch(function(err){
			self.loading=false;
			console.log(err);
			Materialize.toast(err, 4000, 'red');
			self.error = err;
			if (!$scope.$$phase){
				$scope.$apply();
			}
		});
		$('.modal-trigger').leanModal();
	};

	self.keyPressed = function(event){
		if(event.keyCode===13){
			self.importer();
		}else if (event.keyCode===27){
			self.close();
		}
	};

	function sanitizeBeforeSaving(json){
		delete(json.directory);
		delete(json.fileName);
		json.Config.Params = json.Config.Params.filter(function(param){
			return param.name !== '';
		});
		if (json.Config.Params.length===0){
			delete(json.Config.Params);
		}

		json.Tables = json.Tables.filter(function(table){
			return table.Name !== '';
		});
		if (json.Tables.length===0){
			delete(json.Tables);
		}

		if (json.Tables && json.Tables.Params){
			json.Tables.Params = json.Tables.Params.filter(function(param){
				return param.Name !== '';
			});
		}
		if (json.Tables && json.Tables.Params && json.Tables.Params.length===0){
			delete(json.Tables.Params);
		}
	}

	self.createManifest = function(){
		console.log(JSON.stringify(self.newManifest));
		var directory = self.newManifest.directory;
		var fileName = /\.json$/i.test(self.newManifest.fileName)?self.newManifest.fileName:self.newManifest.fileName+'.json';
		sanitizeBeforeSaving(self.newManifest);

		fs.writeFile(path.join(directory.path,fileName), JSON.stringify(self.newManifest,null,2), function (err) {
		  if (err) throw err;
		});

		self.newManifest = jQuery.extend(true, {}, manifestTemplate);
	};

	self.addParam = function(arr){
		arr.push({name:'',value:''});
	};

	self.addTable = function(tables){
		tables.push(jQuery.extend(true, {}, tableTemplate));
	};

	init();
}

module.exports = [
'dataSources',
'$scope',
mainCtrl
];