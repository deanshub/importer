'use strict';
require('./general.css');
require('materialize-css/bin/materialize.css');
require('expose?jQuery!jquery');
require('materialize-css/bin/materialize.js');
require('./angular-materialize.js');

var angular = require('angular');


var app = angular.module('importer',['ui.materialize']);
app.controller('mainCtrl', require('./controller.js'));
app.factory('dataSources', require('./dataSources.js'));