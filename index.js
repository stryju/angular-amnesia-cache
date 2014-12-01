/**
 * amnesia cache
 * -------------
 *
 * a simple, yet useful cache provider for angular
 */

/* global angular:false, define:false, module:false */

(function ( factory ) {
  'use strict';

  if ( typeof define === 'function' && define.amd ) {
    return define( factory );
  }

  if ( typeof exports === 'object' ) {
    return ( module.exports = factory() );
  }

  factory();
}( function () {
  'use strict';

  function amnesiaCacheProvider() {
    // jshint validthis:true
    // jshint latedef:false

    var _lifespan = 5000;
    var _cache;
    var i = 0;

    this.setLifespan = setLifespan;
    this.$get        = $get;

    function setLifespan( value ) {
      var lifespan = validateLifespan( value );

      if ( ! lifespan ) {
        return false;
      }

      _lifespan = lifespan;

      return _lifespan;
    }

    function $get( $cacheFactory, $timeout ) {
      // jshint validthis:true
      // jshint latedef:false

      if ( _cache ) {
        return _cache;
      }

      _cache = generateCache();

      return _cache;

      function generateCache( lifespan, affectGlobal ) {
        var cache = $cacheFactory( 'αμνε$ια' + ( i++ || '' ) );

        var oldGet   = cache.get;
        var timeouts = {};

        cache.get    = get;
        cache.custom = generateCache;

        lifespan  = validateLifespan( lifespan );

        return cache;

        function get( id ) {
          if ( timeouts[ id ] ) {
            $timeout.cancel( timeouts[ id ] );
          }

          var clear = function () {
            cache.remove( id );
            delete timeouts[ id ];

            if ( affectGlobal ) {
              global( cache ).remove( id );
            }
          };

          timeouts[ id ] = $timeout( clear, lifespan || _lifespan, false );

          if ( affectGlobal ) {
            return global( cache ).get( id ) || oldGet.call( cache, id );
          }

          return oldGet.call( cache, id );
        }
      }

      function global( cache ) {
        if ( cache === _cache ) {
          return {
            get    : angular.noop,
            remove : angular.noop
          };
        }

        return _cache;
      }
    }

    $get.$inject = [
      '$cacheFactory', '$timeout'
    ];
  }

  function validateLifespan( value ) {
    value = parseInt( value, 10 );

    if ( isNaN( value ) ) {
      return false;
    }

    return Math.max( 1, value );
  }

  var ngModule = angular.module( 'str.amnesia-cache', [] )
    .provider( 'amnesiaCache', amnesiaCacheProvider );

  return ngModule;
}));


