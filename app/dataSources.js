'use strict';

function dataSources() {
	return {
		from:[
		{name:'File'},
		{name:'Directory'},
		{name:'API'},		{name:'MongoDB'},
		{name:'Text'},
		],
		to:[
		{name:'MongoDB'},
		{name:'File'},
		{name:'Text'},
		]
	};
}

module.exports = [
dataSources
];