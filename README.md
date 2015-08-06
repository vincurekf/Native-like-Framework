![Native-like Framework](title_image.jpg)
# Native-like Framework
Native-like **menu**, **pull-to-sync**, **action button** and **burger menu icon** implementation for angular mobile/desktop apps.

- using hammer.js for better touch support.
- fully animated burger menu icon
- animated action button (optional: see settings)
- adjust content height (optional: see settings)
- animated **pull-to-refresh** with callback (needs content-view: see settings)
- ~10kB minified.

You can find [working example here](http://nlmd.vincurekf.cz).

## What is this for?
If you are developing application for android with Phonegap or Ionic or other alternative,
this is exactly for you. 
I've been struggling with menu implementations, found some but never got the feel and usability i wanted. No touch support or slow/no animations, if there was animations, they mostly have lags.

With this menu you have touch support, slide open/close, toggle function, action button, pull-to-refresh and all with smooth hardware accelerated animations.

## Basic usage
Add **hammer.js**, **ng-nlFramework-min.js** and **ng-nlFramework.css** to your project:
```html
<script src="hammer.js"></script>
<script src="ng-nativeDrawer-min.js"></script>
<link href="ng-nativeDrawer.css" rel="stylesheet">
```

## Html elements
**nlFramework** uses these elements to work with,

```html
  
  <!-- action button -->
  <div id="nlActionButton" class="switch">
    <div class="action-button depth z1 option one" ng-click="drawer.togglePlus()">
        2
    </div>
    <div class="action-button depth z1 option two" ng-click="drawer.togglePlus()">
        1
    </div>
    <div class="action-button depth z1 plus" ng-click="drawer.togglePlus()">
      <span>
        +
      </span>
    </div>
  </div>
  
  <!-- pull-to-refresh indicator -->
  <div id="nlRefresh">
    <svg version="1.1" id="reload-icon" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 342.5 342.5" style="enable-background:new 0 0 342.5 342.5;" xml:space="preserve">
    <path d="M254.37,22.255c-1.161-0.642-2.53-0.795-3.803-0.428c-1.274,0.367-2.35,1.226-2.992,2.387l-21.758,39.391
      c-1.335,2.417-0.458,5.459,1.96,6.794C264.616,90.748,287.5,129.495,287.5,171.52c0,63.649-51.782,115.431-115.431,115.431
      S56.638,235.169,56.638,171.52c0-23.888,7.557-47.427,21.382-66.897l34.478,34.478c1.338,1.337,3.315,1.806,5.109,1.21
      c1.795-0.596,3.101-2.152,3.374-4.024L139.963,6.271c0.228-1.563-0.295-3.141-1.412-4.258c-1.117-1.117-2.7-1.639-4.258-1.412
      L4.278,19.584c-1.872,0.273-3.428,1.579-4.023,3.374c-0.596,1.795-0.127,3.772,1.21,5.109l37.292,37.292
      C14.788,95.484,1.638,133,1.638,171.52c0,93.976,76.455,170.431,170.431,170.431c93.976,0,170.431-76.455,170.431-170.431
      C342.5,109.478,308.731,52.283,254.37,22.255z"/>
    </svg>
  </div>

  <!-- top bar with title ( current cestion, action, etc.) -->
  <div id="topbar" class="fixed depth z1">
    <div class="title">
      {{ title }}
    </div>
  </div>

  <!-- toggle icon for toggling menu -->
  <div id="burger" ng-click="drawer.toggle()">
    <div id="burger-top"></div>
    <div id="burger-center"></div>
    <div id="burger-bottom"></div>
  </div>

  <!-- stripe on the left of the screen to detect slide from side of the screen -->
  <div id="swipe-stripe"></div>

  <!-- body of the menu drawer -->
  <div id="drawer" ng-click="drawer.hide()">
    <div id="topbar" class="drawer large">
      <img class="gravatar depth z1" src="./img/free-flat-icons-set-thumb.jpg">
      <div class="username">
        <strong>John</strong><br>
        Doe
      </div>
    </div>
    <ul class="nav">
      <li><a href="#app">App</a></li>
      <li><a href="#settings">Settings</a></li>
      <div class="bottom">
        <li><a href="#settings">Settings</a></li>
      </div>
    </ul>
  </div>

  <!-- takes care of the overlay dimming -->
  <div id="drawer-dimm" ng-click="drawer.hide();"></div>
  
  <!-- view content - used as a wrapper -->
  <div id="view-content">
    <!-- your part of the code, views etc.. -->
    <div ng-view="" class="page {{ title }}"></div>
  </div>
  
```
So you have:

```#nlSwipe```: small stripe to detect swipe from edge

```#nlDrawer```: the main elements which is toggled

```#nlDimm```: dimms the background when drawer is shown

```#nlContent``` which is where you content belongs

```#nlburger``` the burger menu icon
```#nlRefresh``` pull-to-refresh indicator

## Objects

- **$nlDrawer**
 - ```init()```: initializes the drawer
 - ```set()```: set new options (see [Configuration](#Configuration))
 - ```show()```: shows the drawer (slide in)
 - ```hide()```: hides the drawer (slide out)
 - ```toggle()```: toggles the drawer (show/hide)
 - ```togglePlus()```: toggles the action button (ON/OFF)


- **$nlBurger**
 - ```toggle(true)```: Toggles the burger ON - active
 - ```toggle(false)```: Toggles the burger OFF - inactive


- **nlRefresh**
 - ```init()```: call in your app if you wish to use **pull-to-sync**
 - ```callback()```: your custom callback function
   - remeber to call ```syncEnd()``` at the end of your process to end the animation
 - ```syncEnd()```: as mentioned above, this ends the syncing animation


## Configuration

You can use **nlDrawer** function ```set()``` to set options for drawer look and feel.
```js
var options: {
  maxWidth: 300, //the maximum width that can drawer take, can be any number value (pixels)
  topBarHeight: 56, //define the height of your topbar, you must set this if you'll use modifyViewContent
  speed: 0.2, //Speed of the drawer movement, defined in seconds (0.2, 1, 5...)
  animation: 'ease', //css transition style property, could be **linear**, **ease**, **ease-in**, **ease-out**, **ease-in-out**
  modifyViewContent: true, //if you are using ionic view or angular ng-view this comes handy as it adds margin to your content and changes the size of it (when you rotate device etc.)
  useActionButton: true, //wheter or not you are using action buttons provided with Native-like Drawer
  burger: { // you can adjust the burger look a bit
    startScale: 1, //X scale of bottom and top line of burger menu at starting point (OFF state)
    endScale: 0.7 //X scale of bottom and top line of burger menu at end point (ON state)
  }
};

$nlDrawer.set( options );
```

## Styles
There is **ng-nativeDrawer.scss** file with default styles and color which are there for you prepared to customize the look of menu however you like.

## Full example code
Now you just need to initialize your drawer. In your main javascript file where you start your angulat app you need to assign the drawer module and call the initialization:
```js
// load nlFramework in your app
var exampleApp = angular.module('exampleApp', ['ionic', 'nlFramework']);
// include all parts of nlFramework
exampleApp.run(function($rootScope, $ionicPlatform, $nlDrawer, $nlBurger, $nlRefresh) {
    
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

    // show drawer
    $rootScope.drawer.show();
    // hide drawer
    $rootScope.drawer.hide();
    
    // toggle burger OFF
    $nlBurger.toggle();
    // toggle burger ON
    $nlBurger.toggle( true );

    // set new options
    $rootScope.drawer.set({
      speed: 0.6,
      maxWidth: 250,
      animation: 'ease-out'
    });

    // If you like you can register backbutton handle --------
    // this is for ionic but you can use any whatever you want
    $ionicPlatform.registerBackButtonAction(function () {
      if ( !$nlConfig.open ) {
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
```
## Example app
There is example app alongside with its source code, so feel free to check it and play with it :)
I hope this will help you.

## Support
If You feel fancy You can donate me via Bitcoin:
```
3BqUd7WnZy4jMBZJc3UHhd7ND8RH69mwgs
```

## Licence
[MIT](http://choosealicense.com/licenses/mit/)
