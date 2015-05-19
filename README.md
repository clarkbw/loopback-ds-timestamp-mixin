WARNING
=============
Mixins are actively being implemented in loopback.  See the [loopback-boot mixins issue](https://github.com/strongloop/loopback-boot/issues/79) for more information on loopback mixins.  This module works as expected but may change as loopback changes.


[![NPM](https://nodei.co/npm/loopback-ds-timestamp-mixin.png?compact=true)](https://nodei.co/npm/loopback-ds-timestamp-mixin/)

[![dependencies](https://img.shields.io/david/clarkbw/loopback-ds-timestamp-mixin.svg)]()
[![devDependencies](https://img.shields.io/david/dev/clarkbw/loopback-ds-timestamp-mixin.svg)]()
[![Build Status](https://travis-ci.org/clarkbw/loopback-ds-timestamp-mixin.svg?branch=master)](https://travis-ci.org/clarkbw/loopback-ds-timestamp-mixin)

TIMESTAMPS
=============

This module is designed for the [Strongloop Loopback](https://github.com/strongloop/loopback) framework.  It adds `createdAt` and `updatedAt` attributes to any Model.

`createdAt` will be set to the current Date the by using the default property of the attribute.

`updatedAt` will be set for every update of an object through bulk `updateAll` or instance `model.save` methods.

This module is implemented with the `before save` [Operation Hook](http://docs.strongloop.com/display/public/LB/Operation+hooks#Operationhooks-beforesave) which is relatively new to the loopback framework so your loopback-datasource-juggler module must greater than version [2.23.0](0002aaedeffadda34ae03752d03d0805ab661665).

INSTALL
=============

```bash
  npm install --save loopback-ds-timestamp-mixin
```

SERVER.JS
=============

In your `server/server.js` file add the following line before the `boot(app, __dirname);` line.

```js
...
var app = module.exports = loopback();
...
// Add Timestamp Mixin to loopback
require('loopback-ds-timestamp-mixin')(app);

boot(app, __dirname, function(err) {
  'use strict';
  if (err) throw err;

  // start the server if `$ node server.js`
  if (require.main === module)
    app.start();
});
```

CONFIG
=============

To use with your Models add the `mixins` attribute to the definition object of your model config.

```json
  {
    "name": "Widget",
    "properties": {
      "name": {
        "type": "string",
      }
    },
    "mixins": {
      "TimeStamp" : true
    }
  }
```

BOOT OPTIONS
=============

The attribute names `createdAt` and `updatedAt` are configurable.  To use different values for the default attribute names add the following parameters to the mixin options.

You can also configure whether `createdAt` and `updatedAt` are required or not. This can be useful when applying this mixin to existing data where the `required` constraint would fail by default.

In this example we change `createdAt` and `updatedAt` to `createdOn` and `updatedOn`, respectively. We also change the default `required` to `false`.

```json
  {
    "name": "Widget",
    "properties": {
      "name": {
        "type": "string",
      }
    },
    "mixins": {
      "TimeStamp" : {
        "createdAt" : "createdOn",
        "updatedAt" : "updatedOn",
        "required" : false
      }
    }
  }
```

OPERATION OPTIONS
=============

By passing in additional options to an update or save operation you can control when this mixin updates the `updatedAt` field.  The passing true to the option `skipUpdatedAt` will skip updating the `updatedAt` field.

In this example we assume a book object with the id of 2 already exists. Normally running this operation would change the `updatedAt` field to a new value.

```js
Book.updateOrCreate({name: 'New name', id: 2}, {skipUpdatedAt: true}, function(err, book) {
  // book.updatedAt will not have changed
});
```

TESTING
=============

Run the tests in `test.js`

```bash
  npm test
```

Run with debugging output on:

```bash
  DEBUG='loopback-ds-timestamp-mixin' npm test
```
