
var debug = require('debug')('loopback-ds-timestamp-mixin');

function timestamps(Model, options) {
  'use strict';

  var createdAt = options.createdAt || 'createdAt';
  var updatedAt = options.updatedAt || 'updatedAt';

  Model.defineProperty(createdAt, { type: Date, required : true });
  Model.defineProperty(updatedAt, { type: Date, required : true });

  Model.observe('before save', function event (ctx, next) {
    if (ctx.instance) {
      debug('%s.before save: %s', ctx.Model.modelName, ctx.instance.id);
      Model.applyTimestamps(ctx.instance, ctx.instance.isNewRecord());
      next();
    } else {
      debug('%s.before update matching %j', ctx.Model.pluralModelName, ctx.where);
      Model.applyTimestamps(ctx.data, false);
      next();
    }
  });

  Model.applyTimestamps = function(inst, creation) {
    inst[updatedAt] = new Date();
    if (creation) {
      inst[createdAt] = inst[updatedAt];
    }
  };
}

module.exports = function mixin(app) {
  app.modelBuilder.mixins.define('TimeStamp', timestamps);
};
