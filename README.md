[![NPM](https://nodei.co/npm/loopback-ds-timestamp-mixin.png?compact=true)](https://nodei.co/npm/loopback-ds-timestamp-mixin/)

[![dependencies](https://img.shields.io/david/clarkbw/loopback-ds-timestamp-mixin.svg)]()
[![devDependencies](https://img.shields.io/david/dev/clarkbw/loopback-ds-timestamp-mixin.svg)]()
[![Build Status](https://travis-ci.org/clarkbw/loopback-ds-timestamp-mixin.svg?branch=master)](https://travis-ci.org/clarkbw/loopback-ds-timestamp-mixin)
[![Coverage Status](https://coveralls.io/repos/clarkbw/loopback-ds-timestamp-mixin/badge.svg)](https://coveralls.io/r/clarkbw/loopback-ds-timestamp-mixin)

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

MIXINSOURCES
=============
With [loopback-boot@v2.8.0](https://github.com/strongloop/loopback-boot/)  [mixinSources](https://github.com/strongloop/loopback-boot/pull/131) have been implemented in a way which allows for loading this mixin without changes to the `server.js` file previously required.

Add the `mixins` property to your `server/model-config.json` like the following:

```json
{
  "_meta": {
    "sources": [
      "loopback/common/models",
      "loopback/server/models",
      "../common/models",
      "./models"
    ],
    "mixins": [
      "loopback/common/mixins",
      "../node_modules/loopback-ds-timestamp-mixin",
      "../common/mixins"
    ]
  }
}
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

DEVELOPMENT
=============

This package is written in ES6 JavaScript, check out [@getify/You-Dont-Know-JS](https://github.com/getify/You-Dont-Know-JS) if you want to learn more about ES6.

Source files are located in the `es6` directory.  Edit the source files to make changes while running `gulp` in the background.  Gulp is using [babel](https://babeljs.io/docs/setup/#gulp) to transform the es6 JavaScript into node compatible JavaScript.

```bash
  gulp
```

TESTING
=============

This package uses `jscs` and `jshint` as pretests to help maintain style and for error checking.  All test are run against the transformed versions of files, not the es6 versions.

Run the tests in the `test` directory.

```bash
  npm test
```

Run with debugging output on:

```bash
  DEBUG='loopback:mixins:time-stamp' npm test
```

LICENSE
=============
[ISC](LICENSE)
