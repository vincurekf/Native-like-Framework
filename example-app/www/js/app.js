// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
var exampleApp = angular.module('exampleApp', ['ionic', 'ngRoute', 'ngCordova', 'exampleApp.controllers', 'nlFramework']);

exampleApp.run(function($rootScope, $ionicPlatform, $nlFramework) {

  $ionicPlatform.ready(function() {

    // assign parts for better usage
    $rootScope.fw = $nlFramework;
    $rootScope.drawer = $nlFramework.drawer;
    $rootScope.refresh = $nlFramework.refresh;
    $rootScope.burger = $nlFramework.burger;
    $rootScope.config = $nlFramework.config;
    $rootScope.toast = $nlFramework.toast;
    $rootScope.menu = $nlFramework.menu;
    // show me config
    console.log( $rootScope.config );

    // initialize the whole framework
    // Options
    // 
    var nlOptions = {
      // global settings
      speed: 0.2,
      animation: 'ease',
      // use action button
      actionButton: true,
      // use toast messages
      toast: true,
      // burger specific
      burger: {
        startScale: 1, // X scale of bottom and top line of burger menu at starting point (OFF state)
        endScale: 0.7 // X scale of bottom and top line of burger menu at end point (ON state)
      },
      // content specific
      content:{
        topBarHeight: 56,
        modify: true
      },
      // drawer specific
      drawer: {
        maxWidth: 300,
        openCb: function(){
          console.log('nlDrawer: openned')
        },
        closeCb: function(){ 
          console.log('nlDrawer closed')
        }
      },
      // refresh specific
      refresh: {
        defaultColor: '#aa3344', // default(inactive) color
        activeColor: '#558844', // active color
        callback: function(){
          // here is just timeout to wait 5sec before ending sync animation
          setTimeout( function(){
            console.log( 'nlRefresh custom callback' );
            // after doing some stuff end syncing animation
            $nlRefresh.syncEnd();
          }, 5000 );
        }
      },
      actionButton: true,
      secMenu: true
    }
    $nlFramework.init( nlOptions );

    // Native-like Drawer is HERE! ---------------------------
    /*
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
    */
    // Done! -------------------------------------------------
    
    // swipe from top to refresh!
    // set custom callback
    // DON'T FORGET to call $nlRefresh.syncEnd(); after finish!
    $rootScope.refresh.callback = function(){
      // here is just timeout to wait 5sec before ending sync animation
      setTimeout( function(){
        console.log( 'custom callback onSync' );
        // after doing some stuff end syncing animation
        $rootScope.refresh.syncEnd();
      }, 5000 );
    };
    //

    // in app toast message
    // cet custom callbacks
    $rootScope.toastOk = function(){
      console.log('Custom CB TRUE');
    }
    $rootScope.toastFalse = function(){
      console.log('Custom CB False');
    }
    // set options
    var options = {
      title: 'I\'m a Toast! Yummy!',
      trueCallback: $rootScope.toastOk,
      falseCallback: $rootScope.toastFalse,
      timeout: 2500 
    }
    // show the notification
    $rootScope.toast.show( options );
    //

    /* examples of usage
      // set new options
      setTimeout( function(){
        $rootScope.drawer.set({
          speed: 0.6,
          maxWidth: 250,
          animation: 'ease-out'
        });
      }, 500 );
      
      // show drawer
      setTimeout( function(){
        $rootScope.drawer.show();
      }, 1000 );
      
      // toggle burger
      setTimeout( function(){
        $rootScope.burger.toggle();
      }, 2000 );
      setTimeout( function(){
        $rootScope.burger.toggle( true );
      }, 3000 );
      
      // hide drawer
      setTimeout( function(){
        $rootScope.drawer.hide();
      }, 4000 );
    */

    // If you like you can register backbutton handle --------
    $ionicPlatform.registerBackButtonAction(function () {
      if ( !$rootScope.drawer.openned ) {
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