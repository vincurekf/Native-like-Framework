/**
 * Native-like menu Drawer 
 * Depends on Hammer.js 
 * for smooth touch handeling
 * 
 * This module was mainly developed for android apps build with Ionic
 * but can be used within any Angular project.
 */

angular.module('nlFramework', [])
.factory('$nlFramework', 
  ['$nlConfig', '$nlDrawer', '$nlBurger', '$nlRefresh', '$nlToast', '$nlMenu', 
  function($nlConfig, $nlDrawer, $nlBurger, $nlRefresh, $nlToast, $nlMenu){
  var nlFramework = {
    drawer: $nlDrawer,
    burger: $nlBurger,
    refresh: $nlRefresh,
    toast: $nlToast,
    menu: $nlMenu,
    config: $nlConfig,
    set: function( config ){
      var oldOptions = $nlConfig.options;
      $nlConfig.options = $nlHelpers.merge(oldOptions, config);
    },
    
  };
  return nlFramework;
}])
.factory('$nlElements', function(){
  var nlElements = {};
  return nlElements;
})
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
.factory('$nlBurger', [ '$nlConfig', '$nlHelpers', '$nlElements', function($nlConfig, $nlHelpers, $nlElements){
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
        $nlElements.burger.style.transition = 'none';
        $nlElements.burgerTop.style.transition = 'none';
        $nlElements.burgerBottom.style.transition = 'none';
        //
        $nlHelpers.translate( $nlElements.burger, 0, '', 0, '', rotateComplete, '', '' );
        $nlHelpers.translate( $nlElements.burgerTop, 0, '', y_pos_top, '', rotate, '', '', scale );
        $nlHelpers.translate( $nlElements.burgerBottom, 0, '', y_pos_bottom, '-', rotate, '-', '', scale );
      }
    },
    toggle: function( toggle ){
      // set transitions length for animation
      $nlElements.burger.style.transition = 'all '+$nlConfig.options.speed+'s '+$nlConfig.options.animation;
      $nlElements.burgerTop.style.transition = 'all '+$nlConfig.options.speed+'s '+$nlConfig.options.animation;
      $nlElements.burgerBottom.style.transition = 'all '+$nlConfig.options.speed+'s '+$nlConfig.options.animation;
      //
      if (toggle){
        // ON
        $nlHelpers.translate( $nlElements.burgerTop, 0, '', $nlConfig.options.burger.endY, '', 45, '', '', $nlConfig.options.burger.endScale );
        $nlHelpers.translate( $nlElements.burgerBottom, 0, '', $nlConfig.options.burger.endY, '-', 45, '-', '', $nlConfig.options.burger.endScale );
        $nlHelpers.translate( $nlElements.burger, 0, '', 0, '-', 180, '' );
      }else{
        // OFF
        $nlHelpers.translate( $nlElements.burgerTop, 0, '', 0, '', 0, '', '', $nlConfig.options.burger.startScale );
        $nlHelpers.translate( $nlElements.burgerBottom, 0, '', 0, '', 0, '', '', $nlConfig.options.burger.startScale );
        if ( $nlConfig.options.reverse ){
          $nlHelpers.translate( $nlElements.burger, 0, '', 0, '-', 360, '' );
        }else{
          $nlHelpers.translate( $nlElements.burger, 0, '', 0, '-', 0, '' );
        }
      }
      // reset burger state after the animation is done
      setTimeout( function(){
        $nlElements.burger.style.transition = 'none';
        $nlElements.burgerTop.style.transition = 'none';
        $nlElements.burgerBottom.style.transition = 'none';
        if (!toggle){
          $nlHelpers.translate( $nlElements.burger, 0, '', 0, '-', 0, '' );
          $nlConfig.options.reverse = false;
        }else{
          $nlConfig.options.reverse = true;
        }
      }, $nlConfig.options.speed*1000 );
    }
  }
}])
.factory('$nlDrawer', [ '$nlConfig', '$nlBurger', '$nlHelpers', '$nlElements', function($nlConfig, $nlBurger, $nlHelpers, $nlElements){
  var nlDrawer = {
    init: function( config ){
      // get options passed from initialization and merge them with default ones
        $nlConfig.options = $nlHelpers.merge($nlConfig.options, config);
      // get references to all needed elements on page
        $nlElements.body = document.body;
        $nlElements.bodyH = new Hammer($nlElements.body);
        $nlElements.swipe = document.getElementById('nlSwipe');
        $nlElements.swipeH = new Hammer($nlElements.swipe);
        $nlElements.drawer = document.getElementById( 'nlDrawer' );
        $nlElements.drawerH = new Hammer($nlElements.drawer);
        $nlElements.drawerDimm = document.getElementById( 'nlDimm' );
        $nlElements.drawerDimmH = new Hammer($nlElements.drawerDimm);
      // burger elements
        $nlElements.burger = document.getElementById( 'nlBurger' );
        $nlElements.burgerH = new Hammer($nlElements.burger);
        $nlElements.burgerTop = document.getElementById( 'burger-top' );
        $nlElements.burgerBottom = document.getElementById( 'burger-bottom' );
      // get device width and height for proper scaling of drawer
        $nlConfig.deviceW = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
        $nlConfig.deviceH = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
      // modify view-content?
        if ( $nlConfig.options.modifyViewContent ){
          $nlElements.viewContent = document.getElementById( 'nlContent' );
          $nlElements.viewContentH = new Hammer($nlElements.viewContent);
          $nlElements.viewContent.style['margin-top'] = $nlConfig.options.topBarHeight+'px';
          $nlElements.viewContent.style['min-height'] = $nlConfig.deviceH-$nlConfig.options.topBarHeight+'px';
          $nlElements.viewContent.style.width = $nlConfig.deviceW+'px';
        }
      // use action button?
        if ( $nlConfig.options.useActionButton ){
          $nlElements.actionPanel = document.getElementById('nlActionButton');
          $nlElements.actionPlus = document.getElementById('nlPlus');
        }
      // set initial styles (position and size)
        $nlConfig.maxWidth = $nlConfig.options.maxWidth > $nlConfig.deviceW-56 ? $nlConfig.deviceW-56 : $nlConfig.options.maxWidth;
        $nlHelpers.translate( $nlElements.drawer, $nlConfig.maxWidth, '-', 0, '', 0, '', $nlConfig.maxWidth );
      // listen to resize event, mainly for updating size of drawer when changing view portrait <-> landscape
        window.onresize = function(event) {
          $nlConfig.deviceW = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
          $nlConfig.deviceH = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
          if ( $nlConfig.options.modifyViewContent ){
            $nlElements.viewContent.style.width = $nlConfig.deviceW+'px';
            $nlElements.viewContent.style['min-height'] = $nlConfig.deviceH-$nlConfig.options.topBarHeight+'px';
          }
          $nlConfig.maxWidth = $nlConfig.options.maxWidth > $nlConfig.deviceW-56 ? $nlConfig.deviceW-56 : $nlConfig.options.maxWidth;
          if ( !nlDrawer.openned ){
            $nlHelpers.translate( $nlElements.drawer, $nlConfig.maxWidth, '-', 0, '', 0, '', $nlConfig.maxWidth );
          }else{
            $nlHelpers.translate( $nlElements.drawer, 0, '', 0, '', 0, '', $nlConfig.maxWidth );
          }
        }
      // listen for pan events on elements
        $nlElements.drawerH.on("panleft panright", function( ev ){
          if ( nlDrawer.openned ) nlDrawer.move( ev, true );
        });
        $nlElements.drawerDimmH.on("panleft panright", function(ev) {
          if ( nlDrawer.openned ) nlDrawer.move( ev );
        });
        $nlElements.swipeH.on("panright panleft", function(ev) {
          nlDrawer.move( ev );
        });
        $nlElements.drawerH.on("tap", function(ev) {
          nlDrawer.hide();
        });
        $nlElements.drawerDimmH.on("tap", function(ev) {
          nlDrawer.hide();
        });
        $nlElements.burgerH.on("tap", function(ev) {
          nlDrawer.toggle();
        });
      // register touch end listeners
        nlDrawer.touchEnd( $nlElements.swipe );
        nlDrawer.touchEnd( $nlElements.drawer );
        nlDrawer.touchEnd( $nlElements.drawerDimm );
    },
    show: function(){
      // show drawer with animation
      $nlElements.drawer.style.transition = 'all '+$nlConfig.options.speed+'s '+$nlConfig.options.animation;
      $nlConfig.maxWidth = $nlConfig.options.maxWidth > $nlConfig.deviceW-56 ? $nlConfig.deviceW-56 : $nlConfig.options.maxWidth;
      $nlHelpers.translate( $nlElements.drawer, 0, '', 0, '', 0, '', $nlConfig.maxWidth );
      // dimm background
      $nlElements.drawerDimm.style.transition = 'all '+$nlConfig.options.speed+'s '+$nlConfig.options.animation;
      $nlElements.drawerDimm.style.visibility = 'visible';
      $nlElements.drawerDimm.style.opacity = '1';
      // set open state and toggle burger
      nlDrawer.openned = true;
      $nlConfig.options.reverse = true;
      $nlBurger.toggle(true);
    },
    hide: function(){
      // hide drawer
      $nlElements.drawer.style.transition = 'all '+$nlConfig.options.speed+'s '+$nlConfig.options.animation;
      $nlHelpers.translate( $nlElements.drawer, $nlConfig.maxWidth, '-', 0, '', 0, '' );
      // dimm background
      $nlElements.drawerDimm.style.transition = 'all '+$nlConfig.options.speed+'s '+$nlConfig.options.animation;
      $nlElements.drawerDimm.style.visibility = 'hidden';
      $nlElements.drawerDimm.style.opacity = '0';
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
      $nlElements.drawerDimm.style.transition = 'none';
      $nlElements.drawerDimm.style.visibility = 'visible';
      $nlElements.drawerDimm.style.opacity = opacity;
      //$nlElements.drawerDimm.style.webkitTransform = 'translate(0,0) translateZ(0)';
      // move the drawer
      $nlElements.drawer.style.transition = 'none';
      $nlConfig.maxWidth = $nlConfig.options.maxWidth > $nlConfig.deviceW-56 ? $nlConfig.deviceW-56 : $nlConfig.options.maxWidth;
      $nlHelpers.translate( $nlElements.drawer, pos, '', 0, '', 0, '', $nlConfig.maxWidth );
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
        $nlElements.drawerDimm.style.transition = 'all '+$nlConfig.options.speed+'s '+$nlConfig.options.animation;
        if ( !nlDrawer.plusActive && !hide ){
          nlDrawer.plusActive = true;
          $nlElements.burger.style['z-index'] = '1104';
          $nlElements.actionPlus.style['z-index'] = '1106';
          $nlElements.actionPanel.classList.add('active');
          setTimeout( function(){
            $nlElements.drawerDimm.style.visibility = 'visible';
            $nlElements.drawerDimm.style.opacity = '1';
          }, 100);
        }else{
          nlDrawer.plusActive = false;
          $nlElements.burger.style['z-index'] = '1106';
          $nlElements.drawerDimm.style.visibility = 'hidden';
          $nlElements.drawerDimm.style.opacity = '0';
          $nlElements.actionPlus.style['z-index'] = '1104';
          $nlElements.actionPanel.classList.remove('active');
        }
      }
    }
  };
  return nlDrawer; 
}])
.factory('$nlRefresh', [ '$nlConfig', '$nlHelpers', '$nlElements', function($nlConfig, $nlHelpers, $nlElements){
  var nlRefresh = {
    init: function(){
      // are we on touch device?
        $nlConfig.onTouch = 'ontouchstart' in window ? true : false;
      // get references to elements
        $nlElements.topbar = document.getElementById( 'nlTopbar' );
        $nlElements.topbarH = new Hammer($nlElements.topbar);
        $nlElements.refEl = document.getElementById( 'nlRefresh' );
        $nlElements.refIcon = document.getElementById( 'reload-icon' );
        $nlElements.refIcon.style.transition = 'all '+($nlConfig.options.speed)+'s '+$nlConfig.options.animation;
      // set initial values
        $nlConfig.syncTrue = false;
        $nlConfig.scroll.top = 0;
        $nlConfig.center = ($nlConfig.deviceW/2) - ($nlElements.refEl.offsetWidth/2);
      // move the element on pan
        $nlElements.topbarH.on("pan", function( ev ){
          nlRefresh.move( ev );
        });
      // register touch end event
        nlRefresh.touchEnd( $nlElements.body );
    },
    move: function( ev ){
      $nlConfig.center = ($nlConfig.deviceW/2) - ($nlElements.refEl.offsetWidth/2);
      if ( !$nlConfig.syncing ){
        //if ( $nlConfig.scroll.top < 1 ){
          $nlElements.refEl.style.transition = 'none';
          var end = Math.floor($nlConfig.deviceH/2);
          var perc = ((100/$nlConfig.deviceH) * ev.center.y);

          if ( ev.center.y < end ){
            $nlConfig.syncTrue = false;
            var y = (perc/2) * (end/100);
            var opacity = (perc*2) * (0.5/100);
            var rotate = 0.36 * (end/100 * (ev.center.y));
            $nlElements.refIcon.style.transition = 'none';
            $nlElements.refIcon.style.fill = $nlConfig.options.refresh.defaultColor;
            $nlHelpers.translate($nlElements.refIcon, '', '', '', '', '', '', '', '', '', opacity);
            $nlHelpers.translate($nlElements.refEl, $nlConfig.center, '', y, '', rotate);
          }else{
            $nlElements.refIcon.style.transition = 'fill '+$nlConfig.options.speed*4+'s '+$nlConfig.options.animation;
            $nlConfig.syncTrue = true;
            var perc = (end/100 * (ev.center.y - end));
            var percY = ((100/$nlConfig.deviceH) * ev.center.y);
            var percFull = ((100/($nlConfig.deviceH/2)) * (ev.center.y - end) );
            var y = percY/2 * (end/100);
                y = y - ((y/100)*percFull)/3.5;
            var rotate = 0.36 * (end/100 * (ev.center.y));
            $nlElements.refIcon.style.fill = $nlConfig.options.refresh.activeColor;
            $nlHelpers.translate($nlElements.refIcon, '', '', '', '', '', '', '', '', '', '1');
            $nlHelpers.translate($nlElements.refEl, $nlConfig.center, '', y, '', rotate);
          }
        //}
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
          $nlElements.refEl.style.transition = 'all '+($nlConfig.options.speed/2)+'s '+$nlConfig.options.animation;
          if ( touchobj.clientY > end && $nlConfig.syncTrue && !$nlConfig.syncing){
            $nlConfig.syncTrue = false;
            $nlConfig.syncing = true;
            $nlConfig.nlRefresh.ended = false;
            nlRefresh.callback();
            var step = 0;
            var rotateStep = 0;
            var rotate = 0.36 * (end/100 * (touchobj.clientY - end)) + 360;
            $nlConfig.nlRefresh.minY = $nlConfig.options.topBarHeight+$nlConfig.options.topBarHeight/3;
          
            $nlHelpers.translate($nlElements.refEl, $nlConfig.center, '', $nlConfig.nlRefresh.minY, '', rotate, ''); 
            
            setTimeout( function(){
              $nlElements.refEl.style.transition = 'all '+($nlConfig.options.speed/2)+'s linear';
              var waiter = setInterval(function(){ 
                if ( $nlConfig.nlRefresh.ended ){
                  clearInterval(waiter);
                }else{
                  var rotation = rotate+rotateStep;
                  $nlHelpers.translate($nlElements.refEl, $nlConfig.center, '', $nlConfig.nlRefresh.minY, '', rotation, ''); 
                  step += 0.1;
                  rotateStep += 6+step;
                }
              }, 25 );
            }, ($nlConfig.options.speed*1000));
          }else{
            $nlElements.refEl.style.transition = 'all '+($nlConfig.options.speed)+'s '+$nlConfig.options.animation;
            $nlHelpers.translate($nlElements.refEl, $nlConfig.center, '', 0, '', 0, '');
            $nlConfig.syncTrue = false;
            $nlConfig.syncing = false;
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
        $nlElements.refEl.style.transition = 'all '+($nlConfig.options.speed/2)+'s '+$nlConfig.options.animation;
        $nlHelpers.translate($nlElements.refEl, $nlConfig.center, '', $nlConfig.nlRefresh.minY, '', 0, '', '', '1.2');     
      }, 100);
      setTimeout( function(){
        $nlHelpers.translate($nlElements.refEl, $nlConfig.center, '', $nlConfig.nlRefresh.minY, '', 0, '', '', '0');     
      }, 200);
      setTimeout( function(){
        $nlHelpers.translate($nlElements.refEl, $nlConfig.center, '', 0, '', 0, '', '', '0');     
      }, 300);
      $nlConfig.syncTrue = false;
      $nlConfig.syncing = false;
    }
  }
  return nlRefresh;
}])
.factory('$nlToast', [ '$nlConfig', '$nlHelpers', '$nlElements', function($nlConfig, $nlHelpers, $nlElements){
  var nlToast = {
    init: function( config ){
      // get options passed from initialization and merge them with default ones
        $nlConfig.options = $nlHelpers.merge($nlConfig.options, config);
      // get references to all needed elements on page
        $nlElements.toast = document.getElementById('nlToast');
        $nlElements.toastH = new Hammer($nlElements.toast);
      // listen for pan events on elements
        $nlElements.toastH.on("panleft panright", function( ev ){
          nlToast.move( ev );
        });
      // register touch end listeners
        nlToast.touchEnd( $nlElements.toast );
    },
    show: function( options ){
      var title = options.title || 'I\'m a Toast! Yummy!';
      var position = options.position || null;
      var trueCb = options.trueCallback;
      var falseCb = options.falseCallback;
      var timeout = options.timeout;
      if( $nlConfig.runnigTimeout ) clearTimeout( $nlConfig.runnigTimeout );
      console.log( $nlConfig.runnigTimeout );

      if( position === 'top' ){
        $nlElements.toast.style.top = '75px';
        $nlElements.toast.style.bottom = 'auto';
      }else{
        $nlElements.toast.style.top = '';
        $nlElements.toast.style.bottom = '1rem';
      }

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
       
      if(title) $nlElements.toast.innerHTML = title;
      
      if( position === 'top' ){
        $nlElements.toast.style.transition = 'none';
        $nlHelpers.translate( $nlElements.toast, 0, '', $nlConfig.deviceH, '-', 0, '' );
      }else{
        $nlElements.toast.style.transition = 'none';
        $nlHelpers.translate( $nlElements.toast, 0, '', $nlConfig.deviceH, '', 0, '' );
      }
      setTimeout( function(){
        $nlElements.toast.style.transition = 'all '+$nlConfig.options.speed/2+'s '+$nlConfig.options.animation;
        $nlHelpers.translate( $nlElements.toast, 0, '', 0, '', 0, '' );
      }, 100);
      if( timeout ){
        $nlConfig.runnigTimeout = setTimeout( function(){
          nlToast.hide( true );
        }, timeout);
      }
    },
    center: function(){
      $nlElements.toast.style.transition = 'all '+$nlConfig.options.speed/2+'s '+$nlConfig.options.animation;
      $nlHelpers.translate( $nlElements.toast, 0, '', 0, '', 0, '' );
    },
    right: function(){
      nlToast.trueCb();
      $nlElements.toast.style.transition = 'all '+$nlConfig.options.speed/2+'s '+$nlConfig.options.animation;
      $nlHelpers.translate( $nlElements.toast, $nlConfig.deviceW, '', 0, '', 0, '' );
      setTimeout( function(){
        nlToast.hide();
      }, $nlConfig.options.speed/2*1000);
    },
    left: function(){
      nlToast.falseCb();
      $nlElements.toast.style.transition = 'all '+$nlConfig.options.speed/2+'s '+$nlConfig.options.animation;
      $nlHelpers.translate( $nlElements.toast, $nlConfig.deviceW, '-', 0, '', 0, '' );
      setTimeout( function(){
        nlToast.hide();
      }, $nlConfig.options.speed/2*1000);
    },
    hide: function( transitions ){
      console.log( transitions );
      if( transitions ){
        $nlElements.toast.style.transition = 'all '+$nlConfig.options.speed+'s '+$nlConfig.options.animation;
      }else{
        $nlElements.toast.style.transition = 'none';
      }
      setTimeout( function(){
        $nlHelpers.translate( $nlElements.toast, 0, '', $nlConfig.deviceH, '', 0, '' );
      }, 100);
    },
    move: function( ev ){
      $nlElements.toast.style.transition = 'none';
      nlToast.direction = ev.type === 'panleft' ? 'left' : 'right';
      var pos = ev.center.x - $nlConfig.deviceW;
          nlToast.holdPos = nlToast.holdPos ? nlToast.holdPos : pos;
          pos = pos + Math.abs(nlToast.holdPos);
      $nlHelpers.translate( $nlElements.toast, pos, '', 0, '', 0 );
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
        var touchobj = touch ? e.changedTouches[0] : e;
        var isBigger = touchobj.clientX > ($nlConfig.deviceW/2);
        var isLeft = nlToast.direction === 'left';
        var isRight = nlToast.direction === 'right';
        var endTrue = nlToast.endTrue;
        if( endTrue ) nlToast.center();
        // clean up temp variables
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
}])
.factory('$nlMenu', [ '$nlConfig', '$nlHelpers', '$nlElements', function($nlConfig, $nlHelpers, $nlElements){
  var nlMenu = {
    openned: false,
    init: function(){
      $nlElements.menu = document.getElementById('nlMenu');
      $nlElements.menuContent = document.getElementById('nlMenuContent');
      $nlElements.menuContentH = new Hammer($nlElements.menuContent);
      $nlElements.menuIcon = document.getElementById('nlIcon');
      $nlElements.menuIconH = new Hammer($nlElements.menuIcon);
      $nlElements.bodyH.on('tap', function( ev ){
        if(nlMenu.openned){
          nlMenu.hide();
        }
      });
      $nlElements.menuIconH.on('tap', function( ev ){
        nlMenu.show();
      });
    },
    show: function(){
      //child.style.transition = 'all '+$nlConfig.options.speed/2+'s '+$nlConfig.options.animation;
      $nlElements.menuContent.style.visibility = 'visible';
      $nlElements.menuContent.style.opacity = '1';
      $nlHelpers.translate( $nlElements.menuContent, 0, '', 0, '', 0 );
      setTimeout(function(){
        nlMenu.openned = true;
      }, 50);
    },
    hide: function(){
      //child.style.transition = 'all '+$nlConfig.options.speed/2+'s '+$nlConfig.options.animation;
      $nlElements.menuContent.style.visibility = 'hidden';
      $nlElements.menuContent.style.opacity = '0';
      $nlHelpers.translate( $nlElements.menuContent, 0, '', 0, '', 0 );
      nlMenu.openned = false;
    }
  };
  return nlMenu; 
}]);