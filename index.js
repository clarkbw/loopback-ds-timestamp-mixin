
var debug = require('debug')('loopback-ds-timestamp-mixin');

function timestamps(Model, options) {
  'use strict';

  debug('TimeStamp mixin for Model %s', Model.modelName);

  var createdAt = options.createdAt || 'createdAt';
  var updatedAt = options.updatedAt || 'updatedAt';
  var required = options.required == undefined ? true : options.required

  debug('createdAt', createdAt, options.createdAt);
  debug('updatedAt', updatedAt, options.updatedAt);

  Model.defineProperty(createdAt, { type: Date, required: required, defaultFn: 'now' });
  Model.defineProperty(updatedAt, { type: Date, required: required });

  Model.observe('before save', function event(ctx, next) {
    debug('ctx.options', ctx.options);
    if (ctx.options && ctx.options.skipUpdatedAt) { return next(); }
    if (ctx.instance) {
      debug('%s.%s before save: %s', ctx.Model.modelName, updatedAt, ctx.instance.id);
      ctx.instance[updatedAt] = new Date();
    } else {
      debug('%s.%s before update matching %j', ctx.Model.pluralModelName, updatedAt, ctx.where);
      ctx.data[updatedAt] = new Date();
    }
    next();
  });

}

module.exports = function mixin(app) {
  app.loopback.modelBuilder.mixins.define('TimeStamp', timestamps);
};
