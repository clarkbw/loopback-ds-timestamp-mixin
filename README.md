WARNING
=============
Mixins are not fully supported in loopback as of yet.  See the [loopback-boot mixins issue](https://github.com/strongloop/loopback-boot/issues/79) for more information on this topic.  However if you would like to use this module it does work as expected, but isn't as clean as it could be.


[![NPM](https://nodei.co/npm/loopback-ds-timestamp-mixin.png?compact=true)](https://nodei.co/npm/loopback-ds-timestamp-mixin/)

[![dependencies](https://img.shields.io/david/clarkbw/loopback-ds-timestamp-mixin.svg)]()
[![devDependencies](https://img.shields.io/david/dev/clarkbw/loopback-ds-timestamp-mixin.svg)]()
[![Build Status](https://travis-ci.org/clarkbw/loopback-ds-timestamp-mixin.svg?branch=master)](https://travis-ci.org/clarkbw/loopback-ds-timestamp-mixin)

TIMESTAMPS
=============

This module is designed for the [Strongloop Loopback](https://github.com/strongloop/loopback) framework.  It adds `createdAt` and `updatedAt` attributes to any Model.

`createdAt` will be set to the current Date the by using the default property of the attribute.

`updatedAt` will be set for every update of an object through bulk `updateAll` or instance `model.save` methods.

This module is implemented with the `before save` [Operation Hook](http://docs.strongloop.com/display/public/LB/Operation+hooks#Operationhooks-beforesave) which is relatively new to the loopback framework so make sure you've updated your loopback-datasource-juggler module.

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

OPTIONS
=============

The attribute names `createdAt` and `updatedAt` are configurable.  To use different values for the default attribute names add the following parameters to the mixin options.

In this example we change `createdAt` and `updatedAt` to `createdOn` and `updatedOn`, respectively.

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
        "updatedAt" : "updatedOn"
      }
    }
  }
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
