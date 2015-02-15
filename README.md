TIMESTAMPS
=============

This is for the Strongloop Loopback framework.  It adds `createdAt` and `updatedAt` attributes to any Model.

`createdAt` will be set to the current Date the first time an object is saved via the `before save` callback.

`updatedAt` will be set for every update of an object.

INSTALL
=============

  npm install --save loopback-ds-timestamp-mixin

SERVER.JS???

CONFIG
=============

To use add the `mixin` attribute to the methods object of your model config.

  {
    "name": "Widget",
    "plural": "Widgets",
    "properties": {
      "name": {
        "type": "string",
        "comments": "A person's name"
      },
      "type": {
        "type": "string",
      }
    },
    "validations": [],
    "relations": { },
    "acls": [ ],
    "methods": [ {
      mixin : {
        TimeStamp : true
      }
    } ]
  }

OPTIONS
=============

To use different values than `createdAt` and `updatedAt` for the default attribute names just add that to the mixin options.

  {
    "name": "Widget",
    "plural": "Widgets",
    "properties": {
      "name": {
        "type": "string",
        "comments": "A person's name"
      },
      "type": {
        "type": "string",
      }
    },
    "validations": [],
    "relations": { },
    "acls": [ ],
    "methods": [ {
      mixin : {
        TimeStamp : {
          createdAt : 'createdOn',
          updatedAt : 'updatedOn'
        }
      }
    } ]
  }

TESTING
=============

  npm test


  DEBUG='loopback-ds-timestamp-mixin' npm test
