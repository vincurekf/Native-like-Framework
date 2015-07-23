# Native-like Menu Drawer
Native-like menu implementation for angular mobile apps.

## What is this for?
If you are developing application for android with phogep or ionic or other alternative,
this is exactly for you. 
I've been struggling with menu implementations, found some but never got the feel and usability i wanted. No touch support or slow/no animations, if there was animations, they mostly have lags.

With this menu you have touch support, slide open/close, toggle function and all with smooth hardware accelerated animations.

# Usage
## Add 
**ng-nativeDrawer.js** to your project:
```
<script src="ng-nativeDrawer.js"></script>
```

## Add needed elements
Add drawer, drawer dimm, swipe stripe and menu toggle button to your projects index.html (or what represents your index)
```
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

```init()```: initializes the drawer, no parameters for now

```show()```: shows the drawer (slide in)

```hide()```: hides the drawer (slide out)

## Settings
You can set some options when initializing drawer with ```init()```:
```
options: {
  maxWidth: 300,
  marginTop: 0,
  speed: 0.2,
  animation: 'ease-out'
}
drawer.init( options );
```

# Example

There is example in the example folder, based on ionic framework, with action button bonus to explore and use. You can checkout the example source code which is in the example folder ;)

I hope this will help you.
