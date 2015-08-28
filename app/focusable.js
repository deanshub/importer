'use strict';
var $ = require('jquery');

function focusable() {
	return {
		restrict: 'A',
		link: function(scope, element, attrs){
			var $element = $(element);
			$element.click(function(){
				$element.find(attrs.focusable||'input').focus();
			});
		}
	};
} 


module.exports=[
focusable
];