
var exampleApp = angular.module('exampleApp.controllers', ['ionic', 'ngRoute', 'ngCordova', 'nlFramework']);

exampleApp.controller('AppCtrl', function($rootScope, $scope, $nlFramework) {
	console.log( 'AppCtrl' );
	$rootScope.title = 'AppCtrl';
});

exampleApp.controller('SettingsCtrl', function($rootScope, $scope, $timeout) {
	console.log( 'SettingsCtrl' );  
	$rootScope.title = 'SettingsCtrl';
});