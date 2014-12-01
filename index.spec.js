/* global angular:false, module:false, inject:false */

// jshint jasmine:true
// jshint strict:false

describe( 'amnesia-cache module', function () {
  var amnesiaProvider;

  beforeEach( function () {
    angular.module( 'dummy', [] )
      .config( function ( AmnesiaCacheProvider ) {
        amnesiaProvider = AmnesiaCacheProvider;
      });

    module( 'str.amnesia-cache', 'dummy' );

    inject();
  });

  describe( 'AmnesiaCacheProvider', function () {
    it( 'should be exposed', function () {
      expect( amnesiaProvider ).toBeDefined();
    });

    describe( 'AmnesiaCacheProvider.$get', function () {
      it( 'should be exposed', function () {
        expect( angular.isFunction( amnesiaProvider.$get ) ).toBeTruthy();
      });
    });

    describe( 'AmnesiaCacheProvider.defaultLifespan', function () {
      it( 'should be exposed', function () {
        expect( angular.isFunction( amnesiaProvider.defaultLifespan ) ).toBeTruthy();
      });

      it( 'should handle correct values', function () {
        expect( amnesiaProvider.defaultLifespan( 10 ) ).toEqual( 10 );
        expect( amnesiaProvider.defaultLifespan( '100' ) ).toEqual( 100 );
        expect( amnesiaProvider.defaultLifespan( 1e3 ) ).toEqual( 1000 );
      });

      it( 'should handle non-positive values', function () {
        expect( amnesiaProvider.defaultLifespan( 0 ) ).toEqual( 1 );
        expect( amnesiaProvider.defaultLifespan( -1 ) ).toEqual( 1 );
      });

      it( 'should handle incorrect values', function () {
        expect( amnesiaProvider.defaultLifespan( false ) ).toEqual( false );
        expect( amnesiaProvider.defaultLifespan( NaN ) ).toEqual( false );
        expect( amnesiaProvider.defaultLifespan( void 0 ) ).toEqual( false );
        expect( amnesiaProvider.defaultLifespan( 'xxx' ) ).toEqual( false );
        expect( amnesiaProvider.defaultLifespan( true ) ).toEqual( false );
        expect( amnesiaProvider.defaultLifespan( -Infinity ) ).toEqual( false );
        expect( amnesiaProvider.defaultLifespan( Infinity ) ).toEqual( false );
      });
    });
  });

  describe( 'AmnesiaCache', function () {
    var cache;
    var AmnesiaCache;
    var amnesiaCache;
    var $timeout;

    beforeEach( function () {
      amnesiaProvider.defaultLifespan( 100 );

      inject( function ( _AmnesiaCache_, _$timeout_ ) {
        AmnesiaCache = _AmnesiaCache_;
        amnesiaCache = _AmnesiaCache_;
        cache        = amnesiaCache();

        $timeout     = _$timeout_;
      });
    });

    afterEach( function () {
      $timeout.verifyNoPendingTasks();
    });

    it( 'should be exposed as construictor and work as one', function () {
      expect( angular.isFunction( AmnesiaCache ) ).toBeTruthy();
      expect( angular.isObject( cache ) ).toBeTruthy();
      expect( cache.amnesia.lifespan ).toEqual( 100 );
    });

    it( 'should return the same cache', function () {
      expect( cache ).toBe( amnesiaCache() );
      cache.destroy();

      expect( cache ).not.toBe( new AmnesiaCache() );
    });

    it( 'should reflect $cacheFactory cache', function () {
      expect( angular.isFunction( cache.get ) ).toBeTruthy();
      expect( angular.isFunction( cache.put ) ).toBeTruthy();
      expect( angular.isFunction( cache.remove ) ).toBeTruthy();
      expect( angular.isFunction( cache.removeAll ) ).toBeTruthy();
      expect( angular.isFunction( cache.destroy ) ).toBeTruthy();
    });

    it( 'should work like a $cacheFactory cache', function () {
      expect( $timeout.verifyNoPendingTasks ).not.toThrow();
      expect( cache.get( 'foo' ) ).not.toBeDefined();
      expect( $timeout.verifyNoPendingTasks ).toThrow();
      $timeout.flush();

      expect( cache.put( 'foo', 'bar' ) ).toEqual( 'bar' );
      expect( cache.get( 'foo' ) ).toEqual( 'bar' );
      $timeout.flush( 99 );

      expect( cache.get( 'foo', 'bar' ) ).toEqual( 'bar' );
      expect( cache.put( 'foo', 'baz' ) ).toEqual( 'baz' );
      expect( cache.get( 'foo', 'bar' ) ).toEqual( 'baz' );
      $timeout.flush( 100 );

      expect( cache.get( 'foo' ) ).not.toBeDefined();

      expect( $timeout.verifyNoPendingTasks ).toThrow();
      $timeout.flush( 100 );
    });

    it( 'should clean up timeouts @ remove( id )', function () {
      cache.put( 'baz', 'quux' );
      expect( $timeout.verifyNoPendingTasks ).toThrow();

      cache.remove( 'baz' );
    });

    it( 'should clean up timeouts @ removeAll()', function () {
      cache.put( 'foo', 'qwe' );
      $timeout.flush();
      cache.put( 'bar', 'asd' );
      cache.put( 'baz', 'zxc' );
      cache.put( 'quux', '123' );
      expect( $timeout.verifyNoPendingTasks ).toThrow();

      cache.removeAll();
    });

    it( 'should clean up timeouts @ destroy()', function () {
      cache.put( 'foo', 'qwe' );
      $timeout.flush();
      cache.put( 'bar', 'asd' );
      cache.put( 'baz', 'zxc' );
      cache.put( 'quux', '123' );
      expect( $timeout.verifyNoPendingTasks ).toThrow();

      cache.destroy();
    });
  });

  describe( 'AmnesiaCache as $http cache', function () {
    var AmnesiaCache;
    var $httpBackend;
    var $http;
    var httpConfig1;
    var httpConfig2;
    var httpConfig3;

    beforeEach( function () {
      amnesiaProvider.defaultLifespan( 2500 );

      inject( function ( _AmnesiaCache_ , _$httpBackend_, _$http_ ) {
        AmnesiaCache = _AmnesiaCache_;
        $httpBackend = _$httpBackend_;
        $http = _$http_;

        httpConfig1 = {
          cache : AmnesiaCache
        };

        httpConfig2 = {
          cache : 'AmnesiaCache'
        };

        httpConfig2 = {
          cache : new AmnesiaCache( 5000 )
        };
      });
    });

    afterEach( function () {
      $httpBackend.verifyNoOutstandingExpectation();
      $httpBackend.verifyNoOutstandingRequest();
    });

    it ( 'should work :D', function () {
      $httpBackend.expectGET( '/foo' ).respond( 200, 'bar' );
      $httpBackend.expectGET( '/foo' ).respond( 200, 'baz' );
      $httpBackend.expectGET( '/foo' ).respond( 200, 'quux' );

      $http.get( '/foo', httpConfig1 );
      $http.get( '/foo', httpConfig1 );
      $http.get( '/foo', httpConfig2 );
      $http.get( '/foo', httpConfig3 );

      $httpBackend.flush();
    });
  });
});
