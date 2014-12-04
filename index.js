/**
 * amnesia cache
 * -------------
 *
 * a simple, yet useful cache provider for angular
 */

/* global angular:false, define:false, module:false, require:false */

(function ( factory ) {
  'use strict';

  /* istanbul ignore next */
  if ( typeof define === 'function' && define.amd ) {
    return define( [ 'angular' ], factory );
  }

  /* istanbul ignore next */
  if ( typeof exports === 'object' ) {
    return ( module.exports = factory( require( 'angular' ) ) );
  }

  factory( window.angular );
}( function ( angular ) {
  'use strict';

  function amnesiaCacheProvider() {
    // jshint validthis:true
    // jshint latedef:false

    var _lifespan = 5000;
    var _i = 0;

    this.defaultLifespan = defaultLifespan;
    this.$get            = $get;

    function defaultLifespan( value ) {
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

      var cache;

      return Amnesia;

      function Amnesia( lifespan ) {
        if ( ! ( this instanceof Amnesia ) ) {
          return cache || new Amnesia( lifespan );
        }

        cache = $cacheFactory( 'αμνε$ια' + ( _i++ || '' ) );

        var _get       = cache.get;
        var _put       = cache.put;
        var _remove    = cache.remove;
        var _removeAll = cache.removeAll;
        var _destroy   = cache.destroy;
        var timeouts   = {};

        cache.get       = get;
        cache.put       = put;
        cache.remove    = remove;
        cache.removeAll = removeAll;
        cache.destroy   = destroy;

        cache.amnesia = {
          lifespan : validateLifespan( lifespan ) || _lifespan
        };

        return cache;

        /////

        function ticktock( id ) {
          if ( timeouts[ id ] ) {
            $timeout.cancel( timeouts[ id ] );
          }

          timeouts[ id ] = $timeout( function () {
            cache.remove( id );
            delete timeouts[ id ];
          }, cache.amnesia.lifespan, false );
        }

        function get( id ) {
          ticktock( id );

          return _get.call( cache, id );
        }

        function put( id, value ) {
          ticktock( id );

          return _put.call( cache, id, value );
        }

        function remove( id ) {
          if ( timeouts[ id ] ) {
            $timeout.cancel( timeouts[ id ] );
            delete timeouts[ id ];
          }

          return _remove.call( cache, id );
        }

        function removeAll() {
          angular.forEach( timeouts, function ( timeout, id ) {
            $timeout.cancel( timeout );
            delete timeouts[ id ];
          });

          return _removeAll.call( cache );
        }

        function destroy() {
          removeAll();

          return _destroy.call( cache );
        }
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
    .provider( 'AmnesiaCache', amnesiaCacheProvider );

  return ngModule;
}));
