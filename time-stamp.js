'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _debug = require('./debug');

var _debug2 = _interopRequireDefault(_debug);

exports['default'] = function (Model, options) {

  (0, _debug2['default'])('TimeStamp mixin for Model %s', Model.modelName);

  _extends(options, { createdAt: 'createdAt', updatedAt: 'updatedAt', required: true });

  (0, _debug2['default'])('options', options);

  Model.defineProperty(options.createdAt, { type: Date, required: options.required, defaultFn: 'now' });
  Model.defineProperty(options.updatedAt, { type: Date, required: options.required });

  Model.observe('before save', function (ctx, next) {
    (0, _debug2['default'])('ctx.options', ctx.options);
    if (ctx.options && ctx.options.skipUpdatedAt) {
      return next();
    }
    if (ctx.instance) {
      (0, _debug2['default'])('%s.%s before save: %s', ctx.Model.modelName, options.updatedAt, ctx.instance.id);
      ctx.instance[options.updatedAt] = new Date();
    } else {
      (0, _debug2['default'])('%s.%s before update matching %j', ctx.Model.pluralModelName, options.updatedAt, ctx.where);
      ctx.data[options.updatedAt] = new Date();
    }
    next();
  });
};

module.exports = exports['default'];
//# sourceMappingURL=time-stamp.js.map