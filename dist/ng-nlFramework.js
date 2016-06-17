/**
 * Native-like Framework
 * Depends on Hammer.js
 * for smooth touch handeling
 *
 * This module was mainly developed for android apps build with Ionic
 * but can be used within any Angular project.
 */

angular.module('nlFramework', [])
.factory('$nlFramework',
  ['$nlConfig', '$nlDrawer', '$nlBurger', '$nlRefresh', '$nlToast', '$nlMenu', '$nlFab', '$nlHelpers', '$nlElements',
  function($nlConfig, $nlDrawer, $nlBurger, $nlRefresh, $nlToast, $nlMenu, $nlFab, $nlHelpers, $nlElements){
  var nlFramework = {
    init: function( config ){
      nlFramework.set( config );
      // find device width and height
      $nlConfig.deviceW = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
      $nlConfig.deviceH = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
      // get body reference
      $nlElements.body = document.body;
      $nlElements.bodyH = new Hammer($nlElements.body);
      // add burger menu icon
      if( config.burger && config.burger.use ){
          $nlBurger.init();
      }
      // add dimmer
      document.body.insertAdjacentHTML( 'beforeend', '<div id="nlDimm"></div>' );
      $nlElements.drawerDimm = document.getElementById( 'nlDimm' );
      $nlElements.drawerDimmH = new Hammer($nlElements.drawerDimm);
      // add toast refresh
      if( config.refresh ){
        $nlRefresh.init();
      }
      // add swipe element
      if( config.drawer ){
        document.body.insertAdjacentHTML( 'beforeend', '<div id="nlSwipe"></div>' );
        $nlDrawer.init(config.drawer);
      }
      // add toast container
      if( config.toast ){
        document.body.insertAdjacentHTML( 'beforeend', '<div id="nlToast"></div>' );
        $nlToast.init();
      }
      // add toast container
      if( config.secMenu ) $nlMenu.init();
      // add toast container
      if( config.actionButton ) $nlFab.init();

      // modify view-content?
      if ( config.content && config.content.modify ){
        $nlElements.viewContent = document.getElementById( 'nlContent' );
        $nlElements.viewContentH = new Hammer($nlElements.viewContent);
        $nlElements.viewContent.style['margin-top'] = $nlConfig.options.content.topBarHeight+'px';
        $nlElements.viewContent.style['min-height'] = $nlConfig.deviceH-$nlConfig.options.content.topBarHeight+'px';
        $nlElements.viewContent.style.width = $nlConfig.deviceW+'px';
      };
      // listen to resize event, mainly for updating size of drawer when changing view portrait <-> landscape
      window.onresize = function(event) {
        $nlConfig.deviceW = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
        $nlConfig.deviceH = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
        if ( config.content && config.content.modify ){
          $nlElements.viewContent.style.width = $nlConfig.deviceW+'px';
          $nlElements.viewContent.style['min-height'] = $nlConfig.deviceH-$nlConfig.options.content.topBarHeight+'px';
        }
        if( config.drawer ){
          if ( !$nlDrawer.openned ){
            $nlHelpers.translate( $nlElements.drawer, $nlConfig.maxWidth, '-', 0, '', 0, '', $nlConfig.maxWidth );
          }else{
            $nlHelpers.translate( $nlElements.drawer, 0, '', 0, '', 0, '', $nlConfig.maxWidth );
          }
        }
      }
    },
    drawer: $nlDrawer,
    burger: $nlBurger,
    refresh: $nlRefresh,
    toast: $nlToast,
    menu: $nlMenu,
    config: $nlConfig,
    fab: $nlFab,
    set: function( config ){
      var oldOptions = $nlConfig.options;
      $nlConfig.options = $nlHelpers.merge(oldOptions,config);
      console.info( '%c[≡]%c nlFramework: new settings set', 'color: #333;', 'color: #558844;' );
      console.info( '%c[≡]', 'color: #333;', $nlConfig.options );
    }
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
      // global settings
      speed: 0.2,
      animation: 'ease',
      // use action button
      actionButton: false,
      // use toast messages
      toast: false,
      // use three dot menu
      secMenu: false,
      // burger specific
      burger: {
        show: false,
        endY: 6,
        startScale: 1, // X scale of bottom and top line of burger menu at starting point (OFF state)
        endScale: 0.7 // X scale of bottom and top line of burger menu at end point (ON state)
      },
      // content specific
      content:{
        topBarHeight: 0,
        modify: false
      },
      // drawer specific
      drawer: {
        maxWidth: 300,
        openCb: function(){
          console.info('%c[≡]%c $nlDrawer: opened', 'color: #333;', 'color: #558844;');
        },
        closeCb: function(){
          console.info('%c[≡]%c $nlDrawer: closed', 'color: #333;', 'color: #558844;');
        }
      },
      // refresh specific
      refresh: {
        defaultColor: '#aa3344', // default(inactive) color
        activeColor: '#558844', // active color
        callback: function(){
          // after doing some stuff end syncing animation
          console.info('%c[≡]%c $nlRefresh: callback', 'color: #333;', 'color: #558844;');
          $nlRefresh.syncEnd();
        }
      }
    }
  }
})
.factory('$nlHelpers', function(){
  var nlHelpers = {
    translate: function(myElement, x, pmX, y, pmY, deg, pmDeg, width, scale, mozieo, opacity){
      var x = x || 0,
          y = y || 0,
          pmX = pmX || '',
          pmY = pmY || '',
          pmDeg = pmDeg || '',
          width = width || false,
          el = myElement;
      //
      if ( el.id === 'nlRefresh'){
        if ( scale ){
          scale = 'scale3d('+scale+','+scale+',1)';
        }else{
          scale = 'scale3d(1,1,1)';
        }
      }else{
        //
        scale = scale ? 'scale3d('+scale+',1,1)' : '';
      }
      //
      if ( el.id === 'burger-top' ){
        //
        el.style.transformOrigin = '100% 100%';
      }else if ( el.id === 'burger-bottom' ){
        //
        el.style.transformOrigin = '100% 0%';
      }
      //
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
      for (var attrname in obj2) {
        if( typeof obj1[attrname] === 'object' ){
          obj3[attrname] = nlHelpers.merge( obj1[attrname], obj2[attrname]);
        }else{
          obj3[attrname] = obj2[attrname];
        }
      }
      return obj3;
    }
  }
  return nlHelpers
})
.factory('$nlBurger', [ '$nlConfig', '$nlHelpers', '$nlElements', function($nlConfig, $nlHelpers, $nlElements){
  var nlBurger = {
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
        //console.log( $nlConfig.options.burger.endY );
        var y_pos = Math.floor((($nlConfig.options.burger.endY/100)*currentPerc));
            y_pos = y_pos < $nlConfig.options.burger.endY ? y_pos : $nlConfig.options.burger.endY;
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
        $nlHelpers.translate( $nlElements.burgerTop, 0, '', y_pos, '', rotate, '', '', scale );
        $nlHelpers.translate( $nlElements.burgerBottom, 0, '', y_pos, '-', rotate, '-', '', scale );
      }
    },
    toggle: function( toggle ){
      // set transitions length for animation
      $nlElements.burger.style.transition = 'all '+$nlConfig.options.speed+'s '+$nlConfig.options.animation;
      $nlElements.burgerTop.style.transition = 'all '+$nlConfig.options.speed+'s '+$nlConfig.options.animation;
      $nlElements.burgerBottom.style.transition = 'all '+$nlConfig.options.speed+'s '+$nlConfig.options.animation;
      //
      if ( toggle || (toggle && !nlBurger.isOn) ){
        // ON
        nlBurger.setOn();
      }else{
        // OFF
        nlBurger.setOff();
      }
    },
    toggleEnd: function(){
      setTimeout( function(){
        $nlElements.burger.style.transition = 'none';
        $nlElements.burgerTop.style.transition = 'none';
        $nlElements.burgerBottom.style.transition = 'none';
        if (!nlBurger.isOn){
          $nlHelpers.translate( $nlElements.burger, 0, '', 0, '-', 0, '' );
          $nlConfig.options.reverse = false;
        }else{
          $nlConfig.options.reverse = true;
        }
      }, $nlConfig.options.speed*1000 );
    },
    setOn: function(){
      $nlHelpers.translate( $nlElements.burgerTop, 0, '', $nlConfig.options.burger.endY, '', 45, '', '', $nlConfig.options.burger.endScale );
      $nlHelpers.translate( $nlElements.burgerBottom, 0, '', $nlConfig.options.burger.endY, '-', 45, '-', '', $nlConfig.options.burger.endScale );
      $nlHelpers.translate( $nlElements.burger, 0, '', 0, '-', 180, '' );
      nlBurger.isOn = true;
      // reset burger state after the animation is done
      nlBurger.toggleEnd();
    },
    setOff: function(){
      $nlHelpers.translate( $nlElements.burgerTop, 0, '', 0, '', 0, '', '', $nlConfig.options.burger.startScale );
      $nlHelpers.translate( $nlElements.burgerBottom, 0, '', 0, '', 0, '', '', $nlConfig.options.burger.startScale );
      if ( $nlConfig.options.reverse ){
        $nlHelpers.translate( $nlElements.burger, 0, '', 0, '-', 360, '' );
      }else{
        $nlHelpers.translate( $nlElements.burger, 0, '', 0, '-', 0, '' );
      }
      nlBurger.isOn = false;
      // reset burger state after the animation is done
      nlBurger.toggleEnd();
    },
    init: function(){
      // burger elements
        var burger = '<div id="nlBurger"><div id="burger-top"></div><div id="burger-center"></div><div id="burger-bottom"></div></div>';
        if( document.getElementById( 'nlBurger' ) === null ) document.body.insertAdjacentHTML( 'beforeend', burger );
        //
        $nlElements.burger = document.getElementById( 'nlBurger' );
        $nlElements.burgerH = new Hammer($nlElements.burger);
        $nlElements.burgerTop = document.getElementById( 'burger-top' );
        $nlElements.burgerBottom = document.getElementById( 'burger-bottom' );
        if( typeof $nlConfig.options.drawer !== 'object' ){
          $nlElements.burgerH.on("tap", function(ev) {
            nlBurger.toggle();
          });
        }
    }
  }
  return nlBurger;
}])
.factory('$nlDrawer', [ '$nlConfig', '$nlBurger', '$nlHelpers', '$nlElements', '$nlFab', function($nlConfig, $nlBurger, $nlHelpers, $nlElements, $nlFab){
  var nlDrawer = {
    init: function( config ){
      if( config.openCb ) nlDrawer.on.show = config.openCb;
      if( config.closeCb ) nlDrawer.on.hide = config.closeCb;
      // get options passed from initialization and merge them with default ones
        $nlConfig.options = $nlHelpers.merge($nlConfig.options, config);
      // get references to all needed elements on page
        $nlElements.swipe = document.getElementById('nlSwipe');
        $nlElements.swipeH = new Hammer($nlElements.swipe);
        $nlElements.drawer = document.getElementById( 'nlDrawer' );
        $nlElements.drawerH = new Hammer($nlElements.drawer);
        $nlElements.drawerDimm = document.getElementById( 'nlDimm' );
        $nlElements.drawerDimmH = new Hammer($nlElements.drawerDimm);
      // get device width and height for proper scaling of drawer
        $nlConfig.deviceW = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
        $nlConfig.deviceH = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
      // set initial styles (position and size)
        $nlConfig.maxWidth = $nlConfig.options.drawer.maxWidth > $nlConfig.deviceW-56 ? $nlConfig.deviceW-56 : $nlConfig.options.drawer.maxWidth;
        $nlHelpers.translate( $nlElements.drawer, $nlConfig.maxWidth, '-', 0, '', 0, '', $nlConfig.maxWidth );
      // listen for pan and tap events on elements
        $nlElements.drawerH.on("panleft panright", function( ev ){
          if ( nlDrawer.openned ) nlDrawer.move( ev, true );
        });
        $nlElements.drawerDimmH.on("panleft panright", function(ev) {
          if ( nlDrawer.openned ) nlDrawer.move( ev );
        });
        $nlElements.swipeH.on("panleft panright", function(ev) {
          nlDrawer.move( ev );
        });
        $nlElements.drawerH.on("tap", function(ev) {
          nlDrawer.hide();
        });
        $nlElements.drawerDimmH.on("tap", function(ev) {
          nlDrawer.hide();
        });
        if($nlConfig.options.burger ){
          if($nlConfig.options.burger.use ){
            $nlElements.burgerH.on("tap", function(ev) {
              if( !$nlElements.burger.hasAttribute("ng-click") ){
                nlDrawer.toggle();
              }
            });
          }
        }
      // register touch end listeners
        nlDrawer.touchEnd( $nlElements.swipe );
        nlDrawer.touchEnd( $nlElements.drawer );
        nlDrawer.touchEnd( $nlElements.drawerDimm );
    },
    on: {
      show: function(){},
      hide: function(){},
    },
    show: function(){
      // show drawer with animation
      $nlElements.drawer.style.transition = 'all '+$nlConfig.options.speed+'s '+$nlConfig.options.animation;
      $nlConfig.maxWidth = $nlConfig.options.drawer.maxWidth > $nlConfig.deviceW-56 ? $nlConfig.deviceW-56 : $nlConfig.options.drawer.maxWidth;
      $nlHelpers.translate( $nlElements.drawer, 0, '', 0, '', 0, '', $nlConfig.maxWidth );
      // dimm background
      $nlElements.drawerDimm.style.transition = 'all '+$nlConfig.options.speed+'s '+$nlConfig.options.animation;
      $nlElements.drawerDimm.style.visibility = 'visible';
      $nlElements.drawerDimm.style.opacity = '1';
      // set open state and toggle burger
      nlDrawer.openned = true;
      $nlConfig.options.reverse = true;
      if( $nlConfig.options.burger && $nlConfig.options.burger.use ){
        $nlBurger.toggle(true);
      };
      setTimeout( function () {
        nlDrawer.on.show();
      }, $nlConfig.options.speed*1000)
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
      if ( $nlConfig.options.burger && $nlConfig.options.burger.use ){
        $nlBurger.toggle(false);
      }
      // set open state
      $nlFab.toggle(true);
      nlDrawer.openned = false;
      setTimeout( function () {
        nlDrawer.on.hide();
      }, $nlConfig.options.speed*1000)
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
      var opacityModder = $nlConfig.options.drawer.maxWidth - Math.abs(pos);
      var opacity = ( opacityModder / ($nlConfig.options.drawer.maxWidth/100) / 100 ).toFixed(2);
          opacity = opacity < 1 ? opacity : 1;
      // animate burger menu icon
      if ( $nlConfig.options.burger.use ){
        $nlBurger.animate( pos );
      }
      // dimm background
      $nlElements.drawerDimm.style.transition = 'none';
      $nlElements.drawerDimm.style.visibility = 'visible';
      $nlElements.drawerDimm.style.opacity = opacity;
      //$nlElements.drawerDimm.style.webkitTransform = 'translate(0,0) translateZ(0)';
      // move the drawer
      $nlElements.drawer.style.transition = 'none';
      $nlConfig.maxWidth = $nlConfig.options.drawer.maxWidth > $nlConfig.deviceW-56 ? $nlConfig.deviceW-56 : $nlConfig.options.drawer.maxWidth;
      $nlHelpers.translate( $nlElements.drawer, pos, '', 0, '', 0, '', $nlConfig.maxWidth );
      // if this is final touch (mouse move) event
      // show or hide the drawer (pannig left = open, right = close)
      // and clean our temp values
      if ( ev.isFinal ){
        if ( $nlConfig.options.direction === 'left' ){
          nlDrawer.hide();
        }else if( $nlConfig.options.direction === 'right' ){
          nlDrawer.show();
        }else{
          nlDrawer.onEnd(ev, false);
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
          nlDrawer.onEnd(e, true);
        }, false);
      }else{
        element.addEventListener('mouseup', function(e){
          nlDrawer.onEnd(e, false);
        }, false);
      };
    },
    onEnd: function(e, touch){
      // get the touch reference
      // reference first touch point for this event
      var touchobj = touch ? e.changedTouches[0] : e;
      // if the drawer is pulled more than 50% of its maxWidth
      var isBigger = touchobj.clientX > ($nlConfig.options.drawer.maxWidth/2);
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
  };
  return nlDrawer;
}])
.factory('$nlRefresh', [ '$nlConfig', '$nlHelpers', '$nlElements', function($nlConfig, $nlHelpers, $nlElements){
  var nlRefresh = {
    init: function(){
      // are we on touch device?
        $nlConfig.onTouch = 'ontouchstart' in window ? true : false;
      // get references to elements

        document.body.insertAdjacentHTML( 'afterbegin', '<div id="nlRefresh"><svg version="1.1" id="reload-icon" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 342.5 342.5" style="enable-background:new 0 0 342.5 342.5;" xml:space="preserve"><path d="M254.37,22.255c-1.161-0.642-2.53-0.795-3.803-0.428c-1.274,0.367-2.35,1.226-2.992,2.387l-21.758,39.391'
        +'c-1.335,2.417-0.458,5.459,1.96,6.794C264.616,90.748,287.5,129.495,287.5,171.52c0,63.649-51.782,115.431-115.431,115.431'
        +'S56.638,235.169,56.638,171.52c0-23.888,7.557-47.427,21.382-66.897l34.478,34.478c1.338,1.337,3.315,1.806,5.109,1.21'
        +'c1.795-0.596,3.101-2.152,3.374-4.024L139.963,6.271c0.228-1.563-0.295-3.141-1.412-4.258c-1.117-1.117-2.7-1.639-4.258-1.412'
        +'L4.278,19.584c-1.872,0.273-3.428,1.579-4.023,3.374c-0.596,1.795-0.127,3.772,1.21,5.109l37.292,37.292'
        +'C14.788,95.484,1.638,133,1.638,171.52c0,93.976,76.455,170.431,170.431,170.431c93.976,0,170.431-76.455,170.431-170.431'
        +'C342.5,109.478,308.731,52.283,254.37,22.255z"/></svg></div>' );

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
            $nlConfig.nlRefresh.minY = $nlConfig.options.content.topBarHeight+$nlConfig.options.content.topBarHeight/3;

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
      $nlElements.menu.insertAdjacentHTML( 'afterbegin', '<div id="nlIcon"><div id="dot-top"></div><div id="dot-center"></div><div id="dot-bottom"></div></div>' );
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
}])
.factory('$nlFab', [ '$nlConfig', '$nlHelpers', '$nlElements', function($nlConfig, $nlHelpers, $nlElements){
  var nlFab = {
    openned: false,
    init: function(){
      $nlElements.actionPanel = document.getElementById('nlActionButton');
      $nlElements.actionPanelH = new Hammer($nlElements.actionPanel);
      $nlElements.actionPlus = document.getElementById('nlPlus');
      $nlElements.actionPlusH = new Hammer($nlElements.actionPlus);
      $nlElements.actionPanelH.on("tap", function(ev) {
        if( !$nlElements.actionPlus.hasAttribute("ng-click") ){
          nlFab.toggle();
        }
      });
    },
    toggle: function( hide ){
      // action button
      // used only if enabled in setting when initializing
      if ( $nlConfig.options.actionButton ){
        $nlElements.drawerDimm.style.transition = 'all '+$nlConfig.options.speed+'s '+$nlConfig.options.animation;
        if ( !nlFab.active && !hide ){
          nlFab.active = true;
          if( $nlConfig.options.burger && $nlConfig.options.burger.use ){
            $nlElements.burger.style['z-index'] = '1104';
          }
          $nlElements.actionPlus.style['z-index'] = '1106';
          $nlElements.actionPanel.classList.add('active');
          setTimeout( function(){
            $nlElements.drawerDimm.style.visibility = 'visible';
            $nlElements.drawerDimm.style.opacity = '1';
          }, 100);
        }else{
          nlFab.active = false;
          if( $nlConfig.options.burger && $nlConfig.options.burger.use ){
            $nlElements.burger.style['z-index'] = '1106';
          }
          $nlElements.drawerDimm.style.visibility = 'hidden';
          $nlElements.drawerDimm.style.opacity = '0';
          $nlElements.actionPlus.style['z-index'] = '1104';
          $nlElements.actionPanel.classList.remove('active');
        }
      }
    }
  };
  return nlFab;
}]);
