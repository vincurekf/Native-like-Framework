
var exampleApp = angular.module('exampleApp.controllers', ['ionic', 'ngRoute', 'ngCordova', 'nlFramework']);

exampleApp.controller('AppCtrl', function($rootScope, $scope, $nlFramework) {
	console.log( 'AppCtrl' );
	$rootScope.title = 'AppCtrl';
	//
	$rootScope.menu = $nlFramework.menu;
  $rootScope.menu.init('nlMenu_2');
});

exampleApp.controller('SettingsCtrl', function($rootScope, $scope, $timeout) {
	console.log( 'SettingsCtrl' );  
	$rootScope.title = 'SettingsCtrl';
});