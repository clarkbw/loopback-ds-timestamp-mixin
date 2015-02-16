[![dependencies](https://img.shields.io/david/clarkbw/loopback-ds-timestamp-mixin.svg)]()
[![devDependencies](https://img.shields.io/david/dev/clarkbw/loopback-ds-timestamp-mixin.svg)]()

TIMESTAMPS
=============

This module is designed for the [Strongloop Loopback](https://github.com/strongloop/loopback) framework.  It adds `createdAt` and `updatedAt` attributes to any Model.

`createdAt` will be set to the current Date the first time an object is saved.

`updatedAt` will be set for every update of an object through static bulk or instance methods.

This module uses the `before save` [Operation Hook](http://docs.strongloop.com/display/public/LB/Operation+hooks#Operationhooks-beforesave) which is relatively new to the loopback framework so make sure you've updated your loopback module.

INSTALL
=============

```bash
  npm install --save loopback-ds-timestamp-mixin
```

SERVER.JS
=============

In your `server/server.js` file add the following line before the `boot(app, __dirname);` line.

```js
  require('loopback-ds-timestamp-mixin')(app);
```

CONFIG
=============

To use with your Models add the `mixin` attribute to the methods object of your model config.

```json
  {
    "name": "Widget",
    "plural": "Widgets",
    "properties": {
      "name": {
        "type": "string",
      }
    },
    "validations": [],
    "relations": { },
    "acls": [ ],
    "methods": [ {
      "mixin" : {
        "TimeStamp" : true
      }
    } ]
  }
```

OPTIONS
=============

The attribute names `createdAt` and `updatedAt` are configurable.  To use different values for the default attribute names add the following parameters to the mixin options.

In this example we change `createdAt` and `updatedAt` to `createdOn` and `updatedOn`, respectively.

```json
  {
    "name": "Widget",
    "plural": "Widgets",
    "properties": {
      "name": {
        "type": "string",
      }
    },
    "validations": [],
    "relations": { },
    "acls": [ ],
    "methods": [ {
      "mixin" : {
        "TimeStamp" : {
          "createdAt" : "createdOn",
          "updatedAt" : "updatedOn"
        }
      }
    } ]
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
