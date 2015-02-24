
var debug = require('debug')('loopback-ds-timestamp-mixin');

function timestamps(Model, options) {
  'use strict';

  debug('TimeStamp mixin for Model %s', Model.modelName);

  var createdAt = options.createdAt || 'createdAt';
  var updatedAt = options.updatedAt || 'updatedAt';

  debug('createdAt', createdAt, options.createdAt);
  debug('updatedAt', updatedAt, options.updatedAt);

  Model.defineProperty(createdAt, { type: Date, required : true, default: new Date() });
  Model.defineProperty(updatedAt, { type: Date, required : true });

  Model.observe('before save', function event (ctx, next) {
    if (ctx.instance) {
      debug('%s.%s before save: %s', ctx.Model.modelName, updatedAt, ctx.instance.id);
      ctx.instance[updatedAt] = new Date();
      next();
    } else {
      debug('%s.%s before update matching %j', ctx.Model.pluralModelName, updatedAt, ctx.where);
      ctx.data[updatedAt] = new Date();
      next();
    }
  });

}

module.exports = function mixin(app) {
  console.log(app);
  app.modelBuilder.mixins.define('TimeStamp', timestamps);
};
