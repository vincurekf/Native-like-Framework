/**
 * Native-like menu Drawer 
 * Depends on Hammer.js 
 * for smooth touch handeling
 * 
 * This module was mainly developed for android apps build with Ionic
 * but can be used within any Angular project.
 * 
 * TODO: Cleanup of code
 */

angular.module('nativeDrawer', [])
.factory('$nativeDrawer', [function(){
  // set global variables needed for proper drawer functioning
  var swipe, swipeH, body, bodyH, 
      drawer, drawerH, drawerDimm, drawerDimmH, 
      navToggle, deviceW, viewContent;
  var settings = {};
  
  /**
  * Overwrites obj1's values with obj2's and adds obj2's if non existent in obj1
  * @param obj1
  * @param obj2
  * @returns obj3 a new object based on obj1 and obj2
  */

  var nDrawer = {
    open: false,
    plusActive: false,
    holdingDrawerPosition: null,
    options: {
      maxWidth: 300,
      topBarHeight: 0,
      speed: 0.2,
      animation: 'ease-out',
      modifyViewContent: false,
      useActionButton: false
    },
    show: function(){
      drawer.style.transition = 'all '+nDrawer.options.speed+'s '+nDrawer.options.animation;
      drawer.style.webkitTransform = 'translate(0,0)' + 'translateZ(0)';
      drawer.style.msTransform =
      drawer.style.MozTransform =
      drawer.style.OTransform = 'translateX(0)';
      drawer.style.boxShadow = '0 0 10px rgba(0,0,0,0.4)';

      drawerDimm.style.transition = 'all '+nDrawer.options.speed+'s '+nDrawer.options.animation;
      drawerDimm.style.visibility = 'visible';
      drawerDimm.style.opacity = '1';

      navToggle.classList.add("active");
      nDrawer.open = true;
    },
    hide: function(){
      drawer.style.transition = 'all '+nDrawer.options.speed+'s '+nDrawer.options.animation;
      drawer.style.webkitTransform = 'translate(-' + nDrawer.maxWidth + 'px,0)' + 'translateZ(0)';
      drawer.style.msTransform =
      drawer.style.MozTransform =
      drawer.style.OTransform = 'translateX(-' + nDrawer.maxWidth + 'px)';
      drawer.style.boxShadow = 'none';

      drawerDimm.style.transition = 'all '+nDrawer.options.speed+'s '+nDrawer.options.animation;
      drawerDimm.style.visibility = 'hidden';
      drawerDimm.style.opacity = '0';

      navToggle.classList.remove("active");
      nDrawer.open = false;
    },
    move: function( ev, holdingDrawer ){
      // check for direction
      nDrawer.direction = ev.type === 'panleft' ? 'left' : 'right';
      // figure out position, depending on wheter we are holding drawer itself somwhere in the middle
      // or just the edge
      var pos = ev.center.x - nDrawer.maxWidth;
      if( holdingDrawer ){
        nDrawer.holdingDrawerPosition = nDrawer.holdingDrawerPosition ? nDrawer.holdingDrawerPosition : pos;
        pos = pos + Math.abs(nDrawer.holdingDrawerPosition);
      };
      pos = pos < 0 ? pos : 0;
      // calculate opacity of background dimmer based on touch position (within max width range 0-100%)
      var opacityModder = nDrawer.maxWidth - Math.abs(pos); 
      var opacity = ( opacityModder / (nDrawer.maxWidth/100) / 100 ).toFixed(2);
          opacity = opacity < 1 ? opacity : 1;
      // animate burger menu icon
      //nDrawer.animateBurger( pos, opacity );
      // apply styles when moving
      drawerDimm.style.visibility = 'visible';
      drawerDimm.style.opacity = opacity;
      drawer.style.transition = 'none';
      drawer.style.webkitTransform = 'translate(' + pos + 'px,0)' + 'translateZ(0)';
      drawer.style.msTransform = drawer.style.MozTransform = drawer.style.OTransform = 'translateX(' + pos + 'px)';
      drawer.style.boxShadow = '0 0 10px rgba(0,0,0,0.4)';
      // if this is final touch (mouse move) event
      // show or hide the drawer (pannig left = open, right = close)
      // and clean our temp values
      nDrawer.open = true;
      if( ev.isFinal ){
        if( nDrawer.direction === 'left' ){
          nDrawer.hide();
        }else{
          nDrawer.show();
        }
        nDrawer.endTrue = false;
        nDrawer.holdingDrawerPosition = null;
      }else{
        nDrawer.endTrue = true;
      }
    },
    /* WIP: Not working properly right now
    animateBurger: function( pos, percentage){
      //
      var perc = Math.floor( percentage*100 );
      console.log( pos, perc );
      if( perc < 100 ){
        var start_width = 18;
        var end_width = 12;
        var length = start_width - Math.floor((6/100) * perc);
        var deg_one = Math.floor((45/100) * perc);
        var x_one = Math.floor((3/100) * perc);
        var y_one = Math.floor((3/100) * perc);
        var one_piece_degs = 'translate3d(-'+x_one+'px, '+y_one+'px, 0) rotate3d( 0, 0, 1, -'+deg_one+'deg )';
        document.querySelector("#nav-toggle span.one").style.transform = one_piece_degs;
        document.querySelector("#nav-toggle span.one").style.transition = 'none';
        document.querySelector("#nav-toggle span.one").style.width = length+'px';
      }else{
        document.querySelector("#nav-toggle span.one").style.transform = '';
        document.querySelector("#nav-toggle span.one").style.transition = '';
        document.querySelector("#nav-toggle span.one").style.width = '';
        navToggle.classList.add("active");
      }
    },
    */
    // Fired on touch end event
    touchEnd: function( element ){
      // listen for touch end event on touch devices
      element.addEventListener('touchend', function(e){
        /*
        document.querySelector("#nav-toggle span.one").style.transition = '';
        document.querySelector("#nav-toggle span.one").style.width = '';
        document.querySelector("#nav-toggle span.one").style.transform = '';
        */
        // get the touch reference
        var touchobj = e.changedTouches[0] // reference first touch point for this event
        // if the drawer is pulled more than its maxWidth
        var isBigger = touchobj.clientX > (nDrawer.maxWidth/2);
        // combined with the direction
        var isLeft = nDrawer.direction === 'left';
        var isRight = nDrawer.direction === 'right';
        var endTrue = nDrawer.endTrue;
        // we can decide here if we want show or hide the drawer
        if( endTrue ){
          if( (isBigger && isLeft) || (isBigger && isRight) ){
            nDrawer.show();
          }else if( (!isBigger && isLeft) || (!isBigger && isRight) ){
            nDrawer.hide();
          }
        }
        // clean up ours temp variables
        nDrawer.direction = false;
        nDrawer.endTrue = false;
        nDrawer.holdingDrawerPosition = null;
        e.preventDefault()
      }, false)
    },// Initialize the drawer
    init: function( config ){
      // get options passed from initialization and merge them with default ones
      var options = nDrawer.merge_options(nDrawer.options, config);
      nDrawer.options = options;
      console.log( nDrawer.options );

      // get references to all needed elements on page
      console.log( 'init drawer' );
        swipe = document.getElementById('swipe-stripe');
        swipeH = new Hammer(swipe);
        body = document.getElementById('cont');
        bodyH = new Hammer(body);
        drawer = document.getElementById( 'drawer' );
        drawerH = new Hammer(drawer);
        drawerDimm = document.getElementById( 'drawer-dimm' );
        drawerDimmH = new Hammer(drawerDimm);
        navToggle = document.getElementById( 'nav-toggle' );
      // get device width and height for proper scaling of drawer
      deviceW = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
      deviceH = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
      // modify view-content,
      // used only when the drawer is set to have offset from top (so the topbar remains visible)
      if( nDrawer.options.modifyViewContent ){
        viewContent = document.getElementById( 'view-content' );
        viewContent.style.position = 'absolute';
        viewContent.style.width = deviceW+'px';
        viewContent.style.height = deviceH-nDrawer.options.topBarHeight+'px';
        viewContent.style.top = nDrawer.options.topBarHeight+'px';
      }
      // set initial styles (position and size)
      nDrawer.maxWidth = nDrawer.options.maxWidth > deviceW-56 ? deviceW-56 : nDrawer.options.maxWidth;
      drawer.style.width = nDrawer.maxWidth+'px';
      drawer.style.webkitTransform = 'translate(-' + nDrawer.maxWidth + 'px,0)' + 'translateZ(0)';
      drawer.style.msTransform =
      drawer.style.MozTransform =
      drawer.style.OTransform = 'translateX(-' + nDrawer.maxWidth + 'px)';
      // listen to resize event, mainly for updating size of drawer when changing view portrait <-> landscape
      window.onresize = function(event) {
        deviceW = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
        deviceH = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
        if( nDrawer.options.modifyViewContent ){
          viewContent.style.position = 'absolute';
          viewContent.style.width = deviceW+'px';
          viewContent.style.height = deviceH-nDrawer.options.topBarHeight+'px';
        }
        nDrawer.maxWidth = nDrawer.options.maxWidth > deviceW-56 ? deviceW-56 : nDrawer.options.maxWidth;
        drawer.style.width = nDrawer.maxWidth+'px';
        if( !nDrawer.open ){
          drawer.style.webkitTransform = 'translate(-' + nDrawer.maxWidth + 'px,0)' + 'translateZ(0)';
          drawer.style.msTransform =
          drawer.style.MozTransform =
          drawer.style.OTransform = 'translateX(-' + nDrawer.maxWidth + 'px)';
        }
      }
      // listen for pan events on elements
      drawerH.on("panleft panright", function( ev ){
        if( nDrawer.open ) nDrawer.move( ev, true );
      });
      swipeH.on("panright panleft", function(ev) {
        nDrawer.move( ev );
      });
      drawerDimmH.on("panleft panright", function(ev) {
        if( nDrawer.open ) nDrawer.move( ev );
      });
      // register touch end listeners
      nDrawer.touchEnd( swipe );
      nDrawer.touchEnd( drawer );
      nDrawer.touchEnd( drawerDimm );
    },// Toggle plus action icon
    togglePlus: function( hide ){
      // action button
      // used only if enabled in setting when initializing
      if( nDrawer.options.useActionButton ){
        var add_panel = document.getElementById('add-panel-switch');
        var drawer_overlay = document.getElementById('drawer-dimm');
        if( !nDrawer.plusActive && !hide ){
          nDrawer.plusActive = true;
          add_panel.classList.add('active');
          drawer_overlay.style.visibility = 'visible';
          drawer_overlay.style.opacity = '1';
        }else{
          if( !nDrawer.open ){
            drawer_overlay.style.visibility = 'hidden';
            drawer_overlay.style.opacity = '0';
          } 
          nDrawer.plusActive = false;
          add_panel.classList.remove('active');
        }
      }
    },
    merge_options: function(obj1,obj2){
      var obj3 = {};
      for (var attrname in obj1) { obj3[attrname] = obj1[attrname]; }
      for (var attrname in obj2) { obj3[attrname] = obj2[attrname]; }
      return obj3;
    }
  };
  return nDrawer; 
}]);