
var exampleApp = angular.module('exampleApp.controllers', ['ionic', 'ngRoute', 'ngCordova']);

exampleApp.controller('AppCtrl', function($rootScope, $scope) {
	console.log( 'AppCtrl' );
});

exampleApp.controller('SettingsCtrl', function($rootScope, $scope, $timeout) {
	console.log( 'SettingsCtrl' );  
});