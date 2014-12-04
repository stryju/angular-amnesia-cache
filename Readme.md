# Amnesia Cache

[![build status][travis-img]][travis-url]
[![code coverage][coveralls-img]][coveralls-url]

Really* convenient cache for $http requests that get querried in succession (shared remote config for some components). It will return the same entity as long as it's not querried for the same entity for given time. **It might be a better idea to write a service for those, if you need some more custom handling / behavior.** `AmnesiaCache` is just convenient.

Let's say that we give our `AmnesiaCache` a lifespan of `2000` (`2s`).
Any entity that will have at least `2s` of pause in between, `AmnesiaCache` will forget it, like so:
- `0ms`; get `/foo` - query to server, return `promise#1`, reset timer to `2000ms`
- `100ms`; get `/foo` - return `promise#1`, set timer to `2000ms`
- `1100ms`; get `/foo` - return `promise#1`, reset timer to `2000ms`
- `3100ms`; timeout reached - clear cache for `/foo`
- `3200ms`; get `/foo` - query to server, return `promise#2`, set timer to `2000ms`
- ...

---

## API

### `AmnesiaCacheProvider`
Provider for `AmnesiaCache`.

- `defaultLifespan( lifespan:int )` - sets the default global lifespan (in `ms`) for cache.

---

### `AmnesiaCache`
Cache generated with `$cacheFactory` (with `get( id )` proxied through timeout) , but capable of generating a custom amnesia cache with `#custom( lifespan, affectGlobal )`.

- `[new] AmnesiaCache( [timespan:int] )` - constructor. Will return the same cache entity, if **not** initialized with `new` operator (and create a new instance, if needed). If no `timespan` provided, it will use the default one.

## AMD (require.js, ...)

This module uses 'angular' as a dependency, so just make sure that you have it's path set up properly.

It's wrapped like so:
```js
define( [ 'angular' ], function ( angular ) { ... });
```

## CommonJS (browserify, ...)

This module uses 'angular' as a dependency, so just make sure that you have it's path set up properly.

It's declaration is equivalent to:
```
var angular = require( 'angular' );
```

---

## Sample integration

```js

// global
angular.module( 'fooModule', [ 'str.amnesia-cache' ] )
  .config( function ( $httpProvider, AmnesiaCacheProvider ) {
    AmnesiaCacheProvider.defaultLifespan( 10000 );
    $httpProvider.defaults.cache = 'AmnesiaCache'
  });

// custom

angular.module( 'fooModule' )
  .service( function ( $http, AmnesiaCache ) {
    this.get = function( url ) {
      return $http.get( url, {
        cache : new AmnesiaCache( 1000 )
      });
    };
  });
```

[angular-url]:https://angularjs.org/

[travis-img]:https://img.shields.io/travis/stryju/angular-amnesia-cache.svg?style=flat-square
[travis-url]:https://travis-ci.org/stryju/angular-amnesia-cache

[coveralls-img]:https://img.shields.io/coveralls/stryju/angular-amnesia-cache.svg?style=flat-square
[coveralls-url]:https://coveralls.io/r/stryju/angular-amnesia-cache?branch=master
