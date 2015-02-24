
var debug = require('debug')('loopback-ds-timestamp-mixin');

function timestamps(Model, options) {
  'use strict';

  var createdAt = options.createdAt || 'createdAt';
  var updatedAt = options.updatedAt || 'updatedAt';

  Model.defineProperty(createdAt, { type: Date, required : true, default: new Date() });
  Model.defineProperty(updatedAt, { type: Date, required : true });

  Model.observe('before save', function event (ctx, next) {
    if (ctx.instance) {
      debug('%s.before save: %s', ctx.Model.modelName, ctx.instance.id);
      ctx.instance[updatedAt] = new Date();
      next();
    } else {
      debug('%s.before update matching %j', ctx.Model.pluralModelName, ctx.where);
      ctx.data[updatedAt] = new Date();
      next();
    }
  });

}

module.exports = function mixin(app) {
  app.modelBuilder.mixins.define('TimeStamp', timestamps);
};
