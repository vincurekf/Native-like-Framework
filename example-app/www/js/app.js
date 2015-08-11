// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
var exampleApp = angular.module('exampleApp', ['ionic', 'ngRoute', 'ngCordova', 'exampleApp.controllers', 'nlFramework']);

exampleApp.run(function($rootScope, $ionicPlatform, $nlDrawer, $nlBurger, $nlConfig, $nlRefresh) {

  $ionicPlatform.ready(function() {

    // Native-like Drawer is HERE! ---------------------------
    // the drawer initialization
    $rootScope.drawer = $nlDrawer;
    // default options (all of them)
    var options = {
      maxWidth: 300,
      speed: 0.2,
      animation: 'ease',
      topBarHeight: 56,
      modifyViewContent: true,
      useActionButton: true
    }
    // initialize with options
    $rootScope.drawer.init( options );
    // Done! -------------------------------------------------
    
    // swipe from top to refresh!
    $nlRefresh.init();
    // set custom callback
    // DON'T FORGET to call $nlRefresh.syncEnd(); after finish!
    $nlRefresh.callback = function(){
      // here is just timeout to wait 5sec before ending sync animation
      setTimeout( function(){
        console.log( 'custom callback onSync' );
        // after doing some stuff end syncing animation
        $nlRefresh.syncEnd();
      }, 5000 );
    };
    //

    // assign config object
    $rootScope.config = $nlConfig;
    
    /*
    // show drawer
    setTimeout( function(){
      $rootScope.drawer.show();
    }, 1000 );
    // toggle burger
    setTimeout( function(){
      $nlBurger.toggle();
    }, 2000 );
    setTimeout( function(){
      $nlBurger.toggle( true );
    }, 3000 );
    // hide drawer
    setTimeout( function(){
      $rootScope.drawer.hide();
    }, 4000 );
    */

    /*
    // set new options
    setTimeout( function(){
      $rootScope.drawer.set({
        speed: 0.6,
        maxWidth: 250,
        animation: 'ease-out'
      });
    }, 5000 );
    // show drawer
    setTimeout( function(){
      $rootScope.drawer.show();
    }, 6000 );
    // hide drawer
    setTimeout( function(){
      $rootScope.drawer.hide();
    }, 8000 );
    // set new options
    setTimeout( function(){
      $rootScope.drawer.set({
        speed: 0.2,
        maxWidth: 300,
        animation: 'ease'
      });
    }, 8500 );
    */

    // If you like you can register backbutton handle --------
    $ionicPlatform.registerBackButtonAction(function () {
      if ( !$nlDrawer.open ) {
        // thedrawer is closed - exit the app
        navigator.app.exitApp();
      } else {
        // thedrawer is openned - close
        $rootScope.drawer.hide();
      }
    }, 100);
    // -------------------------------------------------------

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