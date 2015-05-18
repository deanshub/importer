'use strict';

function dataSources() {
	return {
		from:[
		{name:'File'},
		{name:'URL'},
		{name:'MongoDB'},
		{name:'Text'}
		],
		to:[
		{name:'MongoDB'},
		{name:'File'},
		{name:'Text'}
		]
	};
}

module.exports = [
dataSources
];