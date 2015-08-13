/**
 * Native-like menu Drawer 
 * Depends on Hammer.js 
 * for smooth touch handeling
 * 
 * This module was mainly developed for android apps build with Ionic
 * but can be used within any Angular project.
 */

// set global variables needed for proper functioning
var swipe, swipeH, drawer, drawerH, drawerDimm, drawerDimmH,
    navToggle, viewContent,
    burger, burgerTop, burgerBottom,
    topbar, topbarH, refEl,
    toast, toastH;
//

angular.module('nlFramework', [])
.factory('$nlFramework', 
  ['$nlConfig', '$nlDrawer', '$nlBurger', '$nlRefresh', '$nlToast', 
  function($nlConfig, $nlDrawer, $nlBurger, $nlRefresh, $nlToast){
  var nlFramework = {
    drawer: $nlDrawer,
    burger: $nlBurger,
    refresh: $nlRefresh,
    toast: $nlToast,
    config: $nlConfig
  };
  return nlFramework;
}])
.factory('$nlConfig', function(){
  return {
    openned: false,
    plusActive: false,
    holdPos: null,
    reverse: false,
    scroll: {},
    nlRefresh: {},
    options: {
      maxWidth: 300,
      topBarHeight: 56,
      speed: 0.2,
      animation: 'ease',
      modifyViewContent: true,
      useActionButton: true,
      refresh: {
        activeColor: '#558844',
        defaultColor: '#aa3344'
      },
      burger: {
        endY: 6,
        startScale: 1,
        endScale: 0.7
      }
    }
  }
})
.factory('$nlBurger', [ '$nlConfig', '$nlHelpers', function($nlConfig, $nlHelpers){
  return {
    animate: function( pos ){
      var total = $nlConfig.maxWidth;
      var current = total - Math.abs(pos);
      var currentPerc = Math.floor( (100/total)*current);
      if ( currentPerc > 0 ){
        //
        //var currentWidth = $nlConfig.options.burger.startWidth - Math.floor(((6/100)*currentPerc));
        var scale = $nlConfig.options.burger.startScale - Math.abs((((1-$nlConfig.options.burger.endScale)/100)*currentPerc)).toFixed(2);
        // for both lines
        var rotate = Math.floor(((45/100)*currentPerc));
        var y_pos_top = Math.floor((($nlConfig.options.burger.endY/100)*currentPerc));
            y_pos_top = y_pos_bottom = y_pos_top < $nlConfig.options.burger.endY ? y_pos_top : $nlConfig.options.burger.endY;
        // Complete burger rotation
        var rotateComplete = Math.floor(((180/100)*currentPerc));
        //
        if ( $nlConfig.options.reverse ){
          rotateComplete = 180+(180-rotateComplete);
        }
        //
        burger.style.transition = 'none';
        burgerTop.style.transition = 'none';
        burgerBottom.style.transition = 'none';
        //
        $nlHelpers.translate( burger, 0, '', 0, '', rotateComplete, '', '' );
        $nlHelpers.translate( burgerTop, 0, '', y_pos_top, '', rotate, '', '', scale );
        $nlHelpers.translate( burgerBottom, 0, '', y_pos_bottom, '-', rotate, '-', '', scale );
      }
    },
    toggle: function( toggle ){
      // set transitions length for animation
      burger.style.transition = 'all '+$nlConfig.options.speed+'s '+$nlConfig.options.animation;
      burgerTop.style.transition = 'all '+$nlConfig.options.speed+'s '+$nlConfig.options.animation;
      burgerBottom.style.transition = 'all '+$nlConfig.options.speed+'s '+$nlConfig.options.animation;
      //
      if (toggle){
        // ON
        $nlHelpers.translate( burgerTop, 0, '', $nlConfig.options.burger.endY, '', 45, '', '', $nlConfig.options.burger.endScale );
        $nlHelpers.translate( burgerBottom, 0, '', $nlConfig.options.burger.endY, '-', 45, '-', '', $nlConfig.options.burger.endScale );
        $nlHelpers.translate( burger, 0, '', 0, '-', 180, '' );
      }else{
        // OFF
        $nlHelpers.translate( burgerTop, 0, '', 0, '', 0, '', '', $nlConfig.options.burger.startScale );
        $nlHelpers.translate( burgerBottom, 0, '', 0, '', 0, '', '', $nlConfig.options.burger.startScale );
        if ( $nlConfig.options.reverse ){
          $nlHelpers.translate( burger, 0, '', 0, '-', 360, '' );
        }else{
          $nlHelpers.translate( burger, 0, '', 0, '-', 0, '' );
        }
      }
      // reset burger state after the animation is done
      setTimeout( function(){
        burger.style.transition = 'none';
        burgerTop.style.transition = 'none';
        burgerBottom.style.transition = 'none';
        if (!toggle){
          $nlHelpers.translate( burger, 0, '', 0, '-', 0, '' );
          $nlConfig.options.reverse = false;
        }else{
          $nlConfig.options.reverse = true;
        }
      }, $nlConfig.options.speed*1000 );
    }
  }
}])
.factory('$nlHelpers', function(){
  return {
    translate: function(myElement, x, pmX, y, pmY, deg, pmDeg, width, scale, mozieo, opacity){
      var x = x || 0,
          y = y || 0,
          pmX = pmX || '',
          pmY = pmY || '',
          pmDeg = pmDeg || '',
          width = width || false,
          el = myElement;
      
      if ( el.id === 'nlRefresh' ){
        if ( scale ){
          scale = 'scale3d('+scale+','+scale+',1)';
        }else{
          scale = 'scale3d(1,1,1)';
        }
      }else{
        scale = scale ? 'scale3d('+scale+',1,1)' : '';
      }
      
      if ( el.id === 'burger-top' ){
        el.style.transformOrigin = '100% 100%';
      }else if ( el.id === 'burger-bottom' ){
        el.style.transformOrigin = '100% 0%';
      }
      el.style.transform = 'translate3d('+pmX+x+'px, '+pmY+y+'px, 0) rotate3d( 0, 0, 1, '+pmDeg+deg+'deg ) ' + scale;
      el.style.webkitTransform = 'translate('+pmX+x+'px, '+pmY+y+'px) translateZ(0) rotate('+pmDeg+deg+'deg) ' + scale;
      if ( width ) el.style.width = width+'px';
      if ( opacity ) el.style.opacity = opacity;
      if ( width ) el.style['max-width'] = width+'px';
      // only for mozzila, opera and IE
      if ( mozieo ) el.style.msTransform = el.style.MozTransform = el.style.OTransform = 'translateX('+pmX+x+'px) translateY('+pmY+y+'px) rotate('+pmDeg+deg+'deg)';
    },
    merge: function(obj1,obj2){
      var obj3 = {};
      for (var attrname in obj1) { obj3[attrname] = obj1[attrname]; }
      for (var attrname in obj2) { obj3[attrname] = obj2[attrname]; }
      return obj3;
    }
  }
})
.factory('$nlDrawer', [ '$nlConfig', '$nlBurger', '$nlHelpers', function($nlConfig, $nlBurger, $nlHelpers){
  var nlDrawer = {
    init: function( config ){
      // get options passed from initialization and merge them with default ones
        $nlConfig.options = $nlHelpers.merge($nlConfig.options, config);
      // get references to all needed elements on page
        swipe = document.getElementById('nlSwipe');
        swipeH = new Hammer(swipe);
        drawer = document.getElementById( 'nlDrawer' );
        drawerH = new Hammer(drawer);
        drawerDimm = document.getElementById( 'nlDimm' );
        drawerDimmH = new Hammer(drawerDimm);
      // burger elements
        burger = document.getElementById( 'nlBurger' );
        burgerTop = document.getElementById( 'burger-top' );
        burgerBottom = document.getElementById( 'burger-bottom' );
      // get device width and height for proper scaling of drawer
        $nlConfig.deviceW = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
        $nlConfig.deviceH = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
      // modify view-content,
        if ( $nlConfig.options.modifyViewContent ){
          viewContent = document.getElementById( 'nlContent' );
          viewContentH = new Hammer(viewContent);
          viewContent.style.position = 'fixed';
          viewContent.style.width = $nlConfig.deviceW+'px';
          viewContent.style.height = $nlConfig.deviceH-$nlConfig.options.topBarHeight+'px';
          viewContent.style.top = $nlConfig.options.topBarHeight+'px';
        }
      // use action button?
        if ( $nlConfig.options.useActionButton ){
          actionPanel = document.getElementById('nlActionButton');
          actionPlus = document.getElementById('nlPlus');
        }
      // set initial styles (position and size)
        $nlConfig.maxWidth = $nlConfig.options.maxWidth > $nlConfig.deviceW-56 ? $nlConfig.deviceW-56 : $nlConfig.options.maxWidth;
        $nlHelpers.translate( drawer, $nlConfig.maxWidth, '-', 0, '', 0, '', $nlConfig.maxWidth );
      // listen to resize event, mainly for updating size of drawer when changing view portrait <-> landscape
        window.onresize = function(event) {
          $nlConfig.deviceW = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
          $nlConfig.deviceH = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
          if ( $nlConfig.options.modifyViewContent ){
            viewContent.style.position = 'fixed';
            viewContent.style.width = $nlConfig.deviceW+'px';
            viewContent.style.height = $nlConfig.deviceH-$nlConfig.options.topBarHeight+'px';
          }
          $nlConfig.maxWidth = $nlConfig.options.maxWidth > $nlConfig.deviceW-56 ? $nlConfig.deviceW-56 : $nlConfig.options.maxWidth;
      if ( !nlDrawer.openned ){
            $nlHelpers.translate( drawer, $nlConfig.maxWidth, '-', 0, '', 0, '', $nlConfig.maxWidth );
          }else{
            $nlHelpers.translate( drawer, 0, '', 0, '', 0, '', $nlConfig.maxWidth );
          }
        }
      // listen for pan events on elements
        drawerH.on("panleft panright", function( ev ){
          if ( nlDrawer.openned ) nlDrawer.move( ev, true );
        });
        drawerDimmH.on("panleft panright", function(ev) {
          if ( nlDrawer.openned ) nlDrawer.move( ev );
        });
        swipeH.on("panright panleft", function(ev) {
          nlDrawer.move( ev );
        });
      // register touch end listeners
        nlDrawer.touchEnd( swipe );
        nlDrawer.touchEnd( drawer );
        nlDrawer.touchEnd( drawerDimm );
    },
    show: function(){
      // show drawer with animation
      drawer.style.transition = 'all '+$nlConfig.options.speed+'s '+$nlConfig.options.animation;
      $nlConfig.maxWidth = $nlConfig.options.maxWidth > $nlConfig.deviceW-56 ? $nlConfig.deviceW-56 : $nlConfig.options.maxWidth;
      $nlHelpers.translate( drawer, 0, '', 0, '', 0, '', $nlConfig.maxWidth );
      // dimm background
      drawerDimm.style.transition = 'all '+$nlConfig.options.speed+'s '+$nlConfig.options.animation;
      drawerDimm.style.visibility = 'visible';
      drawerDimm.style.opacity = '1';
      // set open state and toggle burger
      nlDrawer.openned = true;
      $nlConfig.options.reverse = true;
      $nlBurger.toggle(true);
    },
    hide: function(){
      // hide drawer
      drawer.style.transition = 'all '+$nlConfig.options.speed+'s '+$nlConfig.options.animation;
      $nlHelpers.translate( drawer, $nlConfig.maxWidth, '-', 0, '', 0, '' );
      // dimm background
      drawerDimm.style.transition = 'all '+$nlConfig.options.speed+'s '+$nlConfig.options.animation;
      drawerDimm.style.visibility = 'hidden';
      drawerDimm.style.opacity = '0';
      // toggle burger
      if ( nlDrawer.openned ){
        $nlBurger.toggle(false);
      }
      // set open state
      nlDrawer.togglePlus(true);
      nlDrawer.openned = false;
    },
    toggle: function(){
      //alert('drawer.toggle()!');
      if ( nlDrawer.openned ){
        nlDrawer.hide();
      }else{
        nlDrawer.show();
      }
    },
    move: function( ev, hold ){
      // check for direction
      $nlConfig.options.direction = ev.type === 'panleft' ? 'left' : 'right';
      // figure out position, depending on wheter we are holding drawer itself somwhere in the middle
      // or just the edge
      var pos = ev.center.x - $nlConfig.maxWidth;
      if ( hold ){
        $nlConfig.options.holdPos = $nlConfig.options.holdPos ? $nlConfig.options.holdPos : pos;
        pos = pos + Math.abs($nlConfig.options.holdPos);
      };
      pos = pos < 0 ? pos : 0;
      // calculate opacity of background dimmer based on touch position (within max width range 0-100%)
      var opacityModder = $nlConfig.options.maxWidth - Math.abs(pos); 
      var opacity = ( opacityModder / ($nlConfig.options.maxWidth/100) / 100 ).toFixed(2);
          opacity = opacity < 1 ? opacity : 1;
      // animate burger menu icon
      $nlBurger.animate( pos );
      // dimm background
      drawerDimm.style.transition = 'none';
      drawerDimm.style.visibility = 'visible';
      drawerDimm.style.opacity = opacity;
      //drawerDimm.style.webkitTransform = 'translate(0,0) translateZ(0)';
      // move the drawer
      drawer.style.transition = 'none';
      $nlConfig.maxWidth = $nlConfig.options.maxWidth > $nlConfig.deviceW-56 ? $nlConfig.deviceW-56 : $nlConfig.options.maxWidth;
      $nlHelpers.translate( drawer, pos, '', 0, '', 0, '', $nlConfig.maxWidth );
      // if this is final touch (mouse move) event
      // show or hide the drawer (pannig left = open, right = close)
      // and clean our temp values
      nlDrawer.openned = true;
      if ( ev.isFinal ){
        if ( $nlConfig.options.direction === 'left' ){
          nlDrawer.hide();
        }else{
          nlDrawer.show();
        }
        $nlConfig.options.holdPos = null;
        $nlConfig.options.endTrue = false;
      }else{
        $nlConfig.options.endTrue = true;
      }
    },
    touchEnd: function( element ){
      // listen for touch end event on touch devices
      $nlConfig.onTouch = 'ontouchstart' in window ? true : false;
      if ( $nlConfig.onTouch ){
        element.addEventListener('touchend', function(e){
          onEnd(e, true);
        }, false);
      }else{
        element.addEventListener('mouseup', function(e){
          onEnd(e, false);
        }, false);
      };
      var onEnd = function(e, touch){
        // get the touch reference
        // reference first touch point for this event
        var touchobj = touch ? e.changedTouches[0] : e; 
        // if the drawer is pulled more than 50% of its maxWidth
        var isBigger = touchobj.clientX > ($nlConfig.options.maxWidth/2);
        // combined with the direction
        var isLeft = $nlConfig.options.direction === 'left';
        var isRight = $nlConfig.options.direction === 'right';
        var endTrue = $nlConfig.options.endTrue;
        // decide if show or hide the drawer
        if ( (isBigger && isLeft && endTrue) || (isBigger && isRight && endTrue) ){
          nlDrawer.show();
        }else if ( (!isBigger && isLeft && endTrue) || (!isBigger && isRight && endTrue) ){
          nlDrawer.hide();
        }
        // clean up our temp variables
        $nlConfig.options.direction = false;
        $nlConfig.options.endTrue = false;
        $nlConfig.options.holdPos = null;
        e.preventDefault()
      }
    },
    set: function( config ){
      var oldOptions = $nlConfig.options;
      $nlConfig.options = $nlHelpers.merge(oldOptions, config);
    },
    togglePlus: function( hide ){
      // action button
      // used only if enabled in setting when initializing
      if ( $nlConfig.options.useActionButton ){
        drawerDimm.style.transition = 'all '+$nlConfig.options.speed+'s '+$nlConfig.options.animation;
        if ( !nlDrawer.plusActive && !hide ){
          nlDrawer.plusActive = true;
          burger.style['z-index'] = '1104';
          actionPlus.style['z-index'] = '1106';
          actionPanel.classList.add('active');
          setTimeout( function(){
            drawerDimm.style.visibility = 'visible';
            drawerDimm.style.opacity = '1';
          }, 100);
        }else{
          nlDrawer.plusActive = false;
          burger.style['z-index'] = '1106';
          drawerDimm.style.visibility = 'hidden';
          drawerDimm.style.opacity = '0';
          actionPlus.style['z-index'] = '1104';
          actionPanel.classList.remove('active');
        }
      }
    }
  };
  return nlDrawer; 
}])
.factory('$nlRefresh', [ '$nlConfig', '$nlHelpers', function($nlConfig, $nlHelpers){
  var nlRefresh = {
    init: function(){
      // are we on touch device?
        $nlConfig.onTouch = 'ontouchstart' in window ? true : false;
      // get references to elements
        topbar = document.getElementById( 'nlTopbar' );
        topbarH = new Hammer(topbar);
        refEl = document.getElementById( 'nlRefresh' );
        refIcon = document.getElementById( 'reload-icon' );
        refIcon.style.transition = 'all '+($nlConfig.options.speed)+'s '+$nlConfig.options.animation;
        if ( !$nlConfig.options.modifyViewContent ){
          viewContent = document.getElementById( 'nlContent' );
          viewContentH = new Hammer(viewContent);
        }
      // set initial values
        $nlConfig.syncTrue = false;
        $nlConfig.scroll.top = 0;
        $nlConfig.center = ($nlConfig.deviceW/2) - (refEl.offsetWidth/2);
      // chech for scroll position
        window.addEventListener("scroll", function(event) {
          $nlConfig.scroll.top   = window.pageYOffset || document.documentElement.scrollTop;
          $nlConfig.scroll.left  = window.pageXOffset || document.documentElement.scrollLeft;
        }, false);
      // move the element on pan
        topbarH.on("pan", function( ev ){
          nlRefresh.move( ev );
        });
      // register touch end event
        nlRefresh.touchEnd( topbar );
        nlRefresh.touchEnd( viewContent );
    },
    move: function( ev ){
      $nlConfig.center = ($nlConfig.deviceW/2) - (refEl.offsetWidth/2);
      if ( !$nlConfig.syncing ){
        if ( $nlConfig.scroll.top < 1 ){
          refEl.style.transition = 'none';
          var end = Math.floor($nlConfig.deviceH/2);
          var perc = ((100/$nlConfig.deviceH) * ev.center.y);
          if ( ev.center.y < end ){
            $nlConfig.syncTrue = false;
            var y = (perc/2) * (end/100);
            var opacity = (perc*2) * (0.5/100);
            var rotate = 0.36 * (end/100 * (ev.center.y));
            refIcon.style.transition = 'none';
            refIcon.style.fill = $nlConfig.options.refresh.defaultColor;
            $nlHelpers.translate(refIcon, '', '', '', '', '', '', '', '', '', opacity);
            $nlHelpers.translate(refEl, $nlConfig.center, '', y, '', rotate);
          }else{
            refIcon.style.transition = 'fill '+$nlConfig.options.speed*4+'s '+$nlConfig.options.animation;
            $nlConfig.syncTrue = true;
            var perc = (end/100 * (ev.center.y - end));
            var percY = ((100/$nlConfig.deviceH) * ev.center.y);
            var percFull = ((100/($nlConfig.deviceH/2)) * (ev.center.y - end) );
            var y = percY/2 * (end/100);
                y = y - ((y/100)*percFull)/3.5;
            var rotate = 0.36 * (end/100 * (ev.center.y));
            refIcon.style.fill = $nlConfig.options.refresh.activeColor;
            $nlHelpers.translate(refIcon, '', '', '', '', '', '', '', '', '', '1');
            $nlHelpers.translate(refEl, $nlConfig.center, '', y, '', rotate);
          }
        }
      }
    },
    touchEnd: function( element ){
      // listen for touch end event on touch devices
      if ( $nlConfig.onTouch ){
        element.addEventListener('touchend', function(e){
          onEnd(e, true);
        }, false);
      }else{
        element.addEventListener('mouseup', function(e){
          onEnd(e, false);
        }, false);
      };
      var onEnd = function(e, touch){
        var end = Math.floor($nlConfig.deviceH/2);
        var touchobj = touch ? e.changedTouches[0] : e; 
        // wait for move event to end (0.1s)
        // then call callback function
        setTimeout( function(){
          refEl.style.transition = 'all '+($nlConfig.options.speed/2)+'s '+$nlConfig.options.animation;
          if ( touchobj.clientY > end && $nlConfig.syncTrue && !$nlConfig.syncing){
            $nlConfig.syncTrue = false;
            $nlConfig.syncing = true;
            $nlConfig.nlRefresh.ended = false;
            nlRefresh.callback();
            var step = 0;
            var rotateStep = 0;
            var rotate = 0.36 * (end/100 * (touchobj.clientY - end)) + 360;
            $nlConfig.nlRefresh.minY = $nlConfig.options.topBarHeight+$nlConfig.options.topBarHeight/3;
          
            $nlHelpers.translate(refEl, $nlConfig.center, '', $nlConfig.nlRefresh.minY, '', rotate, ''); 
            
            setTimeout( function(){
              refEl.style.transition = 'all '+($nlConfig.options.speed/2)+'s linear';
              var waiter = setInterval(function(){ 
                if ( $nlConfig.nlRefresh.ended ){
                  clearInterval(waiter);
                }else{
                  var rotation = rotate+rotateStep;
                  $nlHelpers.translate(refEl, $nlConfig.center, '', $nlConfig.nlRefresh.minY, '', rotation, ''); 
                  step += 0.1;
                  rotateStep += 6+step;
                }
              }, 25 );
            }, ($nlConfig.options.speed*1000));
          }else{
            refEl.style.transition = 'all '+($nlConfig.options.speed)+'s '+$nlConfig.options.animation;
            $nlHelpers.translate(refEl, $nlConfig.center, '', 0, '', 0, ''); 
          }
        }, 50 );
      }
    },
    callback: function(){
      setTimeout( function(){
        $nlConfig.syncEndTrue();
      }, 2500 );
    },
    syncEnd: function(){
      $nlConfig.nlRefresh.ended = true;
      setTimeout( function(){
        refEl.style.transition = 'all '+($nlConfig.options.speed/2)+'s '+$nlConfig.options.animation;
        $nlHelpers.translate(refEl, $nlConfig.center, '', $nlConfig.nlRefresh.minY, '', 0, '', '', '1.2');     
      }, 100);
      setTimeout( function(){
        $nlHelpers.translate(refEl, $nlConfig.center, '', $nlConfig.nlRefresh.minY, '', 0, '', '', '0');     
      }, 200);
      setTimeout( function(){
        $nlHelpers.translate(refEl, $nlConfig.center, '', 0, '', 0, '', '', '0');     
      }, 300);
      $nlConfig.syncTrue = false;
      $nlConfig.syncing = false;
    }
  }
  return nlRefresh;
}])
.factory('$nlToast', [ '$nlConfig', '$nlHelpers', function($nlConfig, $nlHelpers){
  var nlToast = {
    init: function( config ){
      // get options passed from initialization and merge them with default ones
        $nlConfig.options = $nlHelpers.merge($nlConfig.options, config);
      // get references to all needed elements on page
        toast = document.getElementById('nlToast');
        toastH = new Hammer(toast);
      // listen for pan events on elements
        toastH.on("panleft panright", function( ev ){
          nlToast.move( ev );
        });
      // register touch end listeners
        nlToast.touchEnd( toast );
    },
    show: function( text, position, trueCb, falseCb, timeout ){
      if( position === 'top' ){
        toast.style.top = '75px';
        toast.style.bottom = 'auto';
      }else{
        toast.style.top = '';
        toast.style.bottom = '1rem';
      }
      console.log( trueCb, falseCb );

      if( typeof trueCb === 'function' ){
        nlToast.trueCb = trueCb;
      }else{
        nlToast.trueCb = function(){};
      }

      if( typeof falseCb === 'function' ){
        nlToast.falseCb = falseCb;
      }else{
        nlToast.falseCb =  function(){};
      }
      
      if(text) toast.innerHTML = text;
      
      if( position === 'top' ){
        toast.style.transition = 'none';
        $nlHelpers.translate( toast, 0, '', $nlConfig.deviceH, '-', 0, '' );
      }else{
        toast.style.transition = 'none';
        $nlHelpers.translate( toast, 0, '', $nlConfig.deviceH, '', 0, '' );
      }
      setTimeout( function(){
        toast.style.transition = 'all '+$nlConfig.options.speed/2+'s '+$nlConfig.options.animation;
        $nlHelpers.translate( toast, 0, '', 0, '', 0, '' );
      }, 100);
      if( timeout ){
        setTimeout( function(){
          nlToast.hide( true );
        }, timeout);
      }
    },
    center: function(){
      toast.style.transition = 'all '+$nlConfig.options.speed/2+'s '+$nlConfig.options.animation;
      $nlHelpers.translate( toast, 0, '', 0, '', 0, '' );
    },
    right: function(){
      nlToast.trueCb();
      toast.style.transition = 'all '+$nlConfig.options.speed/2+'s '+$nlConfig.options.animation;
      $nlHelpers.translate( toast, $nlConfig.deviceW, '', 0, '', 0, '' );
      setTimeout( function(){
        nlToast.hide();
      }, $nlConfig.options.speed/2*1000);
    },
    left: function(){
      nlToast.falseCb();
      toast.style.transition = 'all '+$nlConfig.options.speed/2+'s '+$nlConfig.options.animation;
      $nlHelpers.translate( toast, $nlConfig.deviceW, '-', 0, '', 0, '' );
      setTimeout( function(){
        nlToast.hide();
      }, $nlConfig.options.speed/2*1000);
    },
    hide: function( transitions ){
      console.log( transitions );
      if( transitions ){
        toast.style.transition = 'all '+$nlConfig.options.speed+'s '+$nlConfig.options.animation;
      }else{
        toast.style.transition = 'none';
      }
      setTimeout( function(){
        $nlHelpers.translate( toast, 0, '', $nlConfig.deviceH, '', 0, '' );
      }, 100);
    },
    move: function( ev ){
      toast.style.transition = 'none';
      var pos = ev.center.x - $nlConfig.deviceW;
      nlToast.holdPos = nlToast.holdPos ? nlToast.holdPos : pos;
      pos = pos + Math.abs(nlToast.holdPos);
      // pos = pos < 0 ? pos : 0;
      nlToast.direction = ev.type === 'panleft' ? 'left' : 'right';
      // calculate opacity of background dimmer based on touch position (within max width range 0-100%)
      // move the drawer
      toast.style.transition = 'none';
      $nlHelpers.translate( toast, pos, '', 0, '', 0 );
      // if this is final touch (mouse move) event
      // show or hide the drawer (pannig left = open, right = close)
      // and clean our temp values
      if ( ev.isFinal ){
        if ( nlToast.direction === 'left' ){
          nlToast.left();
        }else{
          nlToast.right();
        }
        nlToast.holdPos = null;
        nlToast.endTrue = false;
      }else{
        nlToast.endTrue = true;
      }
    },
    touchEnd: function( element ){
      // listen for touch end event on touch devices
      $nlConfig.onTouch = 'ontouchstart' in window ? true : false;
      if ( $nlConfig.onTouch ){
        element.addEventListener('touchend', function(e){
          onEnd(e, true);
        }, false);
      }else{
        element.addEventListener('mouseup', function(e){
          onEnd(e, false);
        }, false);
      };
      var onEnd = function(e, touch){
        // get the touch reference
        // reference first touch point for this event
        var touchobj = touch ? e.changedTouches[0] : e; 
        // if the drawer is pulled more than 50% of its maxWidth
        var isBigger = touchobj.clientX > ($nlConfig.deviceW/2);
        // combined with the direction
        
        var isLeft = nlToast.direction === 'left';
        var isRight = nlToast.direction === 'right';
        var endTrue = nlToast.endTrue;
        // decide if show or hide the drawer
        if( endTrue ) nlToast.center();

        // clean up our temp variables
        nlToast.direction = false;
        nlToast.endTrue = false;
        nlToast.holdPos = null;
        e.preventDefault()
      }
    },
    trueCb: function(){
      console.log( 'True Callback' );
    },
    falseCb: function(){
      console.log( 'False Callback' );
    }
  };
  return nlToast; 
}]);