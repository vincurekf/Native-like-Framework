angular.module('nativeDrawer', [])
.factory('$nativeDrawer', [function(){
  // NAV DRAWER !!! 
  // Depends on Hammer.js 
  // for smooths touch handeling
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
  var merge_options = function(obj1,obj2){
    var obj3 = {};
    for (var attrname in obj1) { obj3[attrname] = obj1[attrname]; }
    for (var attrname in obj2) { obj3[attrname] = obj2[attrname]; }
    return obj3;
  }

  var nDrawer = {
    open: false,
    plusActive: false,
    options: {
      maxWidth: 300,
      marginTop: 0,
      speed: 0.2,
      animation: 'ease-out'
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
    move: function( ev ){
      var opacity = ( ev.center.x / (deviceW/100) / 100 ).toFixed(2);
          opacity = opacity < 1 ? opacity : 1;
      var pos = ev.center.x - nDrawer.maxWidth;
          pos = pos < 0 ? pos : 0;

      drawerDimm.style.visibility = 'visible';
      drawerDimm.style.opacity = opacity;
      drawer.style.transition = 'none';
      
      drawer.style.webkitTransform = 'translate(' + pos + 'px,0)' + 'translateZ(0)';
      drawer.style.msTransform =
      drawer.style.MozTransform =
      drawer.style.OTransform = 'translateX(' + pos + 'px)';

      drawer.style.boxShadow = '0 0 10px rgba(0,0,0,0.4)';
      nDrawer.open = true;
      //nDrawer.endTrue = true;
    },
    moveLeft: function( ev ){
      nDrawer.move( ev );
      nDrawer.direction = 'left';

      if( ev.isFinal ){
        nDrawer.hide();
        nDrawer.endTrue = false;
      }else{
        nDrawer.endTrue = true;
      }
    },
    moveRight: function( ev ){
      nDrawer.move( ev );
      nDrawer.direction = 'right';
      
      if( ev.isFinal ){
        nDrawer.show();
        nDrawer.endTrue = false;
      }else{
        nDrawer.endTrue = true;
      }
    },
    touchEnd: function( element ){
      element.addEventListener('touchend', function(e){

        var touchobj = e.changedTouches[0] // reference first touch point for this event
        var isBigger = touchobj.clientX > (nDrawer.maxWidth/2);
        var isLeft = nDrawer.direction === 'left';
        var isRight = nDrawer.direction === 'right';
        var endTrue = nDrawer.endTrue;
        if( endTrue ){
          if( (isBigger && isLeft) || (isBigger && isRight) ){
            nDrawer.show();
          }else if( (!isBigger && isLeft) || (!isBigger && isRight) ){
            nDrawer.hide();
          }
        }
        nDrawer.direction = false;
        nDrawer.endTrue = false;
        e.preventDefault()
      }, false)
    },
    init: function( config ){
      var options = merge_options(nDrawer.options, config);
      nDrawer.options = options;
      console.log( nDrawer.options );

      console.log( 'init drawer' );
        swipe = document.getElementById('swipe-stripe');
        //console.log( swipe );
        swipeH = new Hammer(swipe);
        body = document.getElementById('cont');
        //console.log( body );
        bodyH = new Hammer(body);
        drawer = document.getElementById( 'drawer' );
        //console.log( drawer );
        drawerH = new Hammer(drawer);
        //console.log( drawerH );
        drawerDimm = document.getElementById( 'drawer-dimm' );
        //console.log( drawerDimm );
        drawerDimmH = new Hammer(drawerDimm);
        navToggle = document.getElementById( 'nav-toggle' );
        //console.log( navToggle );
        //viewContent = document.getElementById( 'view-content' );
        deviceW = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
        deviceH = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
      
      //viewContent.style.height = deviceH-56+'px';
      //viewContent.style.top = 56+'px';
      nDrawer.maxWidth = nDrawer.options.maxWidth > deviceW-56 ? deviceW-56 : nDrawer.options.maxWidth;
      drawer.style.width = nDrawer.maxWidth+'px';

      drawer.style.webkitTransform = 'translate(-' + nDrawer.maxWidth + 'px,0)' + 'translateZ(0)';
      drawer.style.msTransform =
      drawer.style.MozTransform =
      drawer.style.OTransform = 'translateX(-' + nDrawer.maxWidth + 'px)';

      window.onresize = function(event) {
        deviceW = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
        deviceH = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
        //viewContent.style.height = deviceH-56+'px';
        nDrawer.maxWidth = nDrawer.options.maxWidth > deviceW-56 ? deviceW-56 : nDrawer.options.maxWidth;
        drawer.style.width = nDrawer.maxWidth+'px';
        if( !nDrawer.open ){

          drawer.style.webkitTransform = 'translate(-' + nDrawer.maxWidth + 'px,0)' + 'translateZ(0)';
          drawer.style.msTransform =
          drawer.style.MozTransform =
          drawer.style.OTransform = 'translateX(-' + nDrawer.maxWidth + 'px)';
        }
      }

      swipeH.on("panright", function(ev) {
        nDrawer.moveRight( ev );
      });
      swipeH.on("panleft", function(ev) {
        if( nDrawer.open ){
          nDrawer.moveLeft( ev );
        }
      });

      drawerDimmH.on("panleft", function(ev) {
        if( nDrawer.open ) nDrawer.moveLeft( ev );
      });
      drawerDimmH.on("panright", function(ev) {
        if( nDrawer.open ) nDrawer.moveRight( ev );
      });

      nDrawer.touchEnd( swipe );
      nDrawer.touchEnd( drawerDimm );
      
      /*
        drawerH.on("panleft", function( ev ){
          if( nDrawer.open ) nDrawer.moveLeft( ev );
        });
        drawerH.on("panright", function( ev ){
          if( nDrawer.open ) nDrawer.moveRight( ev );
        });
      */
    },// Toggle plus action icon
    togglePlus: function( hide ){
      console.log( nDrawer.plusActive );
      
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
        //$('.add-panel').css('z-index', '10');
      }
    }// #
  };
  return nDrawer; 
}]);