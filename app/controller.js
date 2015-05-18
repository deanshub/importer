'use strict';
var browser = require('./browser');
var $ = require('jquery');

function mainCtrl(dataSources, $timeout) {
	var self = this;

	function init(){
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
		// if (self.selectedSource==='File'){
		// 	self.fromForm.file
		// }
		// self.selectedTarget
		console.log(JSON.stringify(self.fromForm));
		console.log(JSON.stringify(self.toForm));
	};

	init();
}

module.exports = [
	'dataSources',
	'$timeout',
	mainCtrl
];