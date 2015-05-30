'use strict';
var browser = require('./browser');
var importsExports= require('./importsExports.js');

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
	};

	

	init();
}

module.exports = [
'dataSources',
'$scope',
mainCtrl
];