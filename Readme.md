# Amnesia Cache
Short-term cache for angular.js

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

- `setLifespan( lifespan:int )`
    Sets the global lifespan (in `ms`) for cache.

---

### `AmnesiaCache`
Cache generated with `$cacheFactory` (with `get( id )` proxied through timeout) , but capable of generating a custom amnesia cache with `#custom( lifespan, affectGlobal )`.

- `custom( lifespan:int, affectGlobal:bool )`
    Generates a new `AmnesiaCache` instance with given lifespan (useful for those requests with the same generated ID; to learn how this works, please refer to [official angular docs on $http caching](https://docs.angularjs.org/api/ng/service/$http#caching).
    If `affectGlobal` flag is set to true, this `custom` cache with affect the "main `AmnesiaCache` instance" (`main`) - this means that:
    - `custom` will clear the cached instance from `main` cache
    - `custom.get( id )` will check the `main.get( id )` first, then try to check the `custom` (in that order) - if it will get the entity from `main` cache, no entity will be added to `custom` cache.

