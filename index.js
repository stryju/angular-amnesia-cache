/**
 * amnesia cache
 * -------------
 *
 * a simple, yet useful cache provider for angular
 */

/* global angular:false */

(function ( factory ) {
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

    var lifespan = 5000;
    var cache;

    this.setLifespan = setLifespan;
    this.$get        = $get;

    function setLifespan( value ) {
      value = parseInt( value, 10 );

      if ( isNaN( value ) ) {
        return lifespan;
      }

      lifespan = Math.max( 0, value );
    }

    function $get( $cacheFactory, $timeout ) {
      // jshint validthis:true
      // jshint latedef:false

      if ( cache ) {
        return cache;
      }

      cache = $cacheFactory( 'αμνε$ια' );

      var oldGet   = cache.get;
      var timeouts = {};

      cache.get = function ( id ) {
        if ( timeouts[ id ] ) {
          $timeout.cancel( timeouts[ id ] );
        }

        var clear = function () {
          cache.remove( id );
          delete timeouts[ id ];
        };

        timeouts[ id ] = $timeout( clear, lifespan, false );

        return oldGet.call( cache, id );
      };

      return cache;
    }

    $get.$inject = [
      '$cacheFactory', '$timeout'
    ];
  }

  var ngModule = angular.module( 'str.amnesia-cache', [] )
    .provider( 'AmnesiaCache', amnesiaCacheProvider );

  return ngModule;
}));


