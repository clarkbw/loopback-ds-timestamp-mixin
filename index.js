var deprecate = require('util').deprecate;

module.exports = deprecate(function mixin(app) {
  app.loopback.modelBuilder.mixins.define('TimeStamp', require('./time-stamp'));
}, 'DEPRECATED: Use mixinSources, see https://github.com/clarkbw/loopback-ds-timestamp-mixin#mixinsources');
