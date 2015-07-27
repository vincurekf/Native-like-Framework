// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
var exampleApp = angular.module('exampleApp', ['ionic', 'ngRoute', 'ngCordova', 'exampleApp.controllers', 'nativeDrawer']);

exampleApp.run(function($rootScope, $ionicPlatform, $nativeDrawer ) {

  $ionicPlatform.ready(function() {

    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }

    // Native-like Drawer is HERE! ---------------------------
    // the drawer initialization
    $rootScope.drawer = $nativeDrawer;
    // default options (all of them)
    var options = {
      maxWidth: 300,
      speed: 0.2,
      animation: 'ease-out',
      topBarHeight: 56,
      modifyViewContent: true,
      useActionButton: true
    }
    // initialize with options
    $rootScope.drawer.init( options );
    // Done! -------------------------------------------------

  });
});

// just some routes to show some content
exampleApp.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider
    .when('/app', {
      templateUrl: 'views/app.html',
      controller: 'AppCtrl'
    }).
    when('/settings', {
      templateUrl: 'views/settings.html',
      controller: 'SettingsCtrl'
    }).
    otherwise({
      redirectTo: '/app'
    });
}]);