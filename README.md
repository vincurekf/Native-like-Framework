# Native-like-Menu-Drawer
Native-like menu implementation for angular mobile apps.

## What is this for?
If you are developing application for android with phogep or ionic or other alternative,
this is exactly for you. 
I've been struggling with menu implementations, found some but never got the feel and usability i wanted. No touch support or slow/no animations, if there was animations, they mostly have lags.

With this menu you have touch support, slide open/close, toggle function and all with smooth hardware accelerated animations.

# Usage

## Functions
Drawer has some basic functions:
```drawer.init()```: initializes the drawer, no parameters for now
```drawer.show()```: shows the drawer (slide in)
```drawer.hide()```: hides the drawer (slide out)

## Using drawer
Is easy:
1. add drawer, drawer dimm, swipe stripe and menu toggle button to your projects index.html (or what represents your index)
```
<!-- toggle icon for toggling menu -->
<a id="nav-toggle" class="menu-icon" href="#"><span></span></a>
<!-- stripe on the left of the screen to detect slide from side of the screen -->
<div id="swipe-stripe"></div>
<!-- the body of the menu drawer -->
<div id="drawer" ng-click="drawer.hide()">
  <div id="topbar" class="drawer large">
  </div>
  <ul class="nav">
    <li><a href="#app">Overview</a></li>
    <li><a href="#settings">Settings</a></li>
    <div class="bottom">
      <li><a href="#settings">Settings</a></li>
    </div>
  </ul>
</div>
<!-- the dimmet that takes care of the overlay dimming -->
<div id="drawer-dimm" ng-click="drawer.hide(); togglePlus(true);"></div>
```
So you have three elements:
```#drawer```: the main elements which is toggled
```#drawer-dimm```: dimms the background when drawer is shown
```#swipe-stripe```: small stripe to detect swipe from edge

Now for the javascript:
Copy and paste the content of native-like-drawer.js to your app.js into your 
The
Easy to use with native-like feel, html-css-javascript menu drawer with swipe and toggle actions.


