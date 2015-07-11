'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var debug = require('./debug')();

exports['default'] = function (Model) {
  var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

  debug('TimeStamp mixin for Model %s', Model.modelName);

  options = _extends({ createdAt: 'createdAt', updatedAt: 'updatedAt', required: true }, options);

  debug('options', options);

  Model.defineProperty(options.createdAt, { type: Date, required: options.required, defaultFn: 'now' });
  Model.defineProperty(options.updatedAt, { type: Date, required: options.required });

  Model.observe('before save', function (ctx, next) {
    debug('ctx.options', ctx.options);
    if (ctx.options && ctx.options.skipUpdatedAt) {
      return next();
    }
    if (ctx.instance) {
      debug('%s.%s before save: %s', ctx.Model.modelName, options.updatedAt, ctx.instance.id);
      ctx.instance[options.updatedAt] = new Date();
    } else {
      debug('%s.%s before update matching %j', ctx.Model.pluralModelName, options.updatedAt, ctx.where);
      ctx.data[options.updatedAt] = new Date();
    }
    next();
  });
};

module.exports = exports['default'];
//# sourceMappingURL=time-stamp.js.map