# Native-like Menu Drawer
Native-like menu implementation for angular mobile/desktop apps.
Build with hammer.js fot touch support.
4kb minified.

<p data-height="266" data-theme-id="8844" data-slug-hash="bdmVpM" data-default-tab="result" data-user="vincurekf" class='codepen'>See the Pen <a href='http://codepen.io/vincurekf/pen/bdmVpM/'>Native-like Menu Drawer</a> by Filip Vincůrek (<a href='http://codepen.io/vincurekf'>@vincurekf</a>) on <a href='http://codepen.io'>CodePen</a>.</p>
<script async src="//assets.codepen.io/assets/embed/ei.js"></script>

## What is this for?
If you are developing application for android with phogep or ionic or other alternative,
this is exactly for you. 
I've been struggling with menu implementations, found some but never got the feel and usability i wanted. No touch support or slow/no animations, if there was animations, they mostly have lags.

With this menu you have touch support, slide open/close, toggle function and all with smooth hardware accelerated animations.

# Usage
Add **hammer.js**, **ng-nativeDrawer.js** and **ng-nativeDrawer.css** to your project:
```html
<script src="hammer.js"></script>
<script src="ng-nativeDrawer.min.js"></script>
<link href="ng-nativeDrawer.css" rel="stylesheet">
```

## Needed elements
Add drawer, drawer dimm, swipe stripe, content view and menu toggle button to your projects index.html (or what represents your index),
if you dont want to use the view-content, just leave it, and the same is for action buttons. Read more in **Settings**.
```html
<!-- toggle icon for toggling menu -->
<a id="nav-toggle" class="menu-icon" href="#"><span></span></a>
<!-- stripe on the left of the screen to detect slide from side of the screen -->
<div id="swipe-stripe"></div>
<!-- body of the menu drawer -->
<div id="drawer" ng-click="drawer.hide()">
  <div id="topbar" class="drawer large">
    <img class="gravatar depth z1" src="http://placehold.it/150x150">
    <div class="username">
      <strong>John</strong><br>
      Doe
    </div>
  </div>
  <ul class="nav">
    <li><a href="#app">Overview</a></li>
    <li><a href="#settings">Settings</a></li>
    <div class="bottom">
      <li><a href="#settings">Settings</a></li>
    </div>
  </ul>
</div>
<!-- takes care of the overlay dimming -->
<div id="drawer-dimm" ng-click="drawer.hide(); drawer.togglePlus(true);"></div>
<!-- your part of the code, views etc.. -->
<ion-scroll id="view-content" zooming="false" direction="y">
  <div ng-view=""></div>
</div> 
```
So you have four elements:

```#drawer```: the main elements which is toggled

```#drawer-dimm```: dimms the background when drawer is shown

```#swipe-stripe```: small stripe to detect swipe from edge

and ```#view-content``` which is where you content belongs

## Functions
Drawer has some basic functions:

```init()```: initializes the drawer

```show()```: shows the drawer (slide in)

```hide()```: hides the drawer (slide out)

# Settings
Drawer has some options to play with:

```maxWidth```: the maximum width that can drawer take, can be any number value (pixels)

Transitions can be modified with:

```speed```: speed of the drawer movement, defined in seconds (0.2, 1, 5...) 

```animation```: css transition style property, could be ```linear```, ```ease```, ```ease-in```, ```ease-out```, ```ease-in-out```

(it's standart css transition property)

Additional options, (you can leave those if you don't want use action buttons or view-content elements):

```topBarHeight```: define the height of your topbar, you must set this if you'll use ```modifyViewContent```

```modifyViewContent```: if you are using ionic view or angular ng-view this comes handy as it adds margin to your content and changes the size of it (when you rotate device etc.)

```useActionButton```: wheter or not you are using action buttons provided with Native-like Drawer

You can pass options with ```init()```:
```js
options: {
  maxWidth: 300,
  speed: 0.2,
  animation: 'ease-out',
  topBarHeight: 56,
  modifyViewContent: false,
  useActionButton: false
}
drawer.init( options );
```
Now you just need to initialize your drawer. In your main javascript file where you start your angulat app you need to assign the drawer module and call the initialization:

# Full example code
```js
var exampleApp = angular.module('exampleApp', ['ionic', 'nativeDrawer']);

exampleApp.run(function($rootScope, $ionicPlatform, $nativeDrawer ) {

  $ionicPlatform.ready(function() {

    // Native-like Drawer is HERE! ---------------------------
    // assign drawer module
    $rootScope.drawer = $nativeDrawer;
    // set options (these are the default options)
    var options = {
      maxWidth: 300,
      speed: 0.2,
      animation: 'ease-out',
      topBarHeight: 56,
      modifyViewContent: false,
      useActionButton: false
    }
    // and initialize with options
    $rootScope.drawer.init( options );
    // Done! -------------------------------------------------

  });
});
```
# Example app
There is example app alongside with its source code, so feel free to check it and play with it :)
I hope this will help you.

# Licence
[MIT](http://choosealicense.com/licenses/mit/)
