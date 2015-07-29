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

      //navToggle.classList.add("active");
      nDrawer.open = true;
      nDrawer.toggleBurger(true);
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

      //navToggle.classList.remove("active");
      nDrawer.open = false;
      nDrawer.toggleBurger(false);
    },
    toggle: function(){
      if( nDrawer.open ){
        nDrawer.hide();
      }else{
        nDrawer.show();
      }
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
      nDrawer.animateBurger( pos, opacity );
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
    animateBurger: function( pos, percentage){
      var total = nDrawer.maxWidth;
      var current = total - Math.abs(pos);
      var currentPerc = Math.floor( (100/total)*current);
      if( currentPerc > 0 ){
        document.querySelector("#burger").style.transition = 'none';
        document.querySelector("#burger #top").style.transition = 'none';
        document.querySelector("#burger #bottom").style.transition = 'none';
        //
        console.log( currentPerc );
        //
        // translate3d(0px, 0px, 0px) rotate3d(0, 0, 1, 0deg)
        var startWidth = 18;
        var endWidth = 12;
        var currentWidth = startWidth - Math.floor(((6/100)*currentPerc));
        
        // Complete burger animation
        var rotateComplete = Math.floor(((180/100)*currentPerc));
        var transformComplete = 'translate3d(0px, 0px, 0) rotate3d( 0, 0, 1, '+rotateComplete+'deg )';
        document.querySelector("#burger").style.transform = transformComplete;

        // for both elements
        var rotate = Math.floor(((45/100)*currentPerc));
        
        //
        var x_pos_top = Math.floor(((30/100)*currentPerc));
        var y_pos_top = Math.floor(((9/100)*currentPerc));
            y_pos_top = y_pos_top < 9 ? y_pos_top : 9;
        // translate3d(32px, -9px, 0px) rotate3d(0, 0, 1, 45deg);
        var top_transform = 'translate3d('+x_pos_top+'px, -'+y_pos_top+'px, 0) rotate3d( 0, 0, 1, '+rotate+'deg )';
        document.querySelector("#burger #top").style.transform = top_transform;
        document.querySelector("#burger #top").setAttribute('width', currentWidth);

        //
        var x_pos_bottom = Math.floor(((9/100)*currentPerc));
        var y_pos_bottom = Math.floor(((26/100)*currentPerc));
            y_pos_bottom = y_pos_bottom < 26 ? y_pos_bottom : 26;
        // translate3d(-8px, 25px, 0px) rotate3d(0, 0, 1, -45deg);
        var bottom_transform = 'translate3d(-'+x_pos_bottom+'px, '+y_pos_bottom+'px, 0) rotate3d( 0, 0, 1, -'+rotate+'deg )';
        document.querySelector("#burger #bottom").style.transform = bottom_transform;
        document.querySelector("#burger #bottom").setAttribute('width', currentWidth);
      }
    },
    toggleBurger: function( toggle ){
      //
      document.querySelector("#burger").style.transition = 'all 0.3s ease';
      document.querySelector("#burger #top").style.transition = 'all 0.3s ease';
      document.querySelector("#burger #bottom").style.transition = 'all 0.3s ease';

      if(toggle){
        // ON
        var top_transform = 'translate3d(30px, -9px, 0) rotate3d( 0, 0, 1, 45deg )';
        document.querySelector("#burger #top").style.transform = top_transform;
        document.querySelector("#burger #top").setAttribute('width', 12);
        //
        var bottom_transform = 'translate3d(-9px, 26px, 0) rotate3d( 0, 0, 1, -45deg )';
        document.querySelector("#burger #bottom").style.transform = bottom_transform;
        document.querySelector("#burger #bottom").setAttribute('width', 12);
        //
        var transformComplete = 'translate3d(0px, 0px, 0) rotate3d( 0, 0, 1, 180deg )';
        document.querySelector("#burger").style.transform = transformComplete;
      }else{
        // OFF
        var top_transform = 'translate3d(0, 0, 0) rotate3d( 0, 0, 1, 0deg )';
        document.querySelector("#burger #top").style.transform = top_transform;
        document.querySelector("#burger #top").setAttribute('width', 18);
        //
        var bottom_transform = 'translate3d(0, 0, 0) rotate3d( 0, 0, 1, 0deg )';
        document.querySelector("#burger #bottom").style.transform = bottom_transform;
        document.querySelector("#burger #bottom").setAttribute('width', 18);
        //
        var transformComplete = 'translate3d(0px, 0px, 0) rotate3d( 0, 0, 1, 0deg )';
        document.querySelector("#burger").style.transform = transformComplete;
      }
      //
    },
    burgerTemplate: function(){
      //
      var burgerHolder = document.getElementsByTagName('nlmd-burger');
      burgerHolder[0].innerHTML = '<svg version="1.1" id="burger" class="menu-icon" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="56px" height="56px" viewBox="0 0 56 56" enable-background="new 0 0 56 56" xml:space="preserve"><rect id="top" x="19" y="20" fill="#fff" width="18" height="2"/><rect id="center" x="19" y="26" fill="#fff" width="18" height="2"/><rect id="bottom" x="19" y="32" fill="#fff" width="18" height="2"/></svg>';
    },
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
      nDrawer.burgerTemplate();
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