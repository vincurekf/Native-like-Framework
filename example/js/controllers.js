
var exampleApp = angular.module('exampleApp.controllers', ['ionic', 'ngRoute', 'ngCordova']);

exampleApp.controller('AppCtrl', function($rootScope, $scope) {
	console.log( 'AppCtrl' );
	$rootScope.title = 'AppCtrl';
});

exampleApp.controller('SettingsCtrl', function($rootScope, $scope, $timeout) {
	console.log( 'SettingsCtrl' );  
	$rootScope.title = 'SettingsCtrl';
});