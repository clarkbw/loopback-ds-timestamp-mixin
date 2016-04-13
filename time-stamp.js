'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _debug2 = require('./debug');

var _debug3 = _interopRequireDefault(_debug2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var debug = (0, _debug3.default)();

exports.default = function (Model) {
  var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];


  debug('TimeStamp mixin for Model %s', Model.modelName);

  options = _extends({
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
    required: true,
    validateUpsert: false // default to turning validation off
  }, options);

  debug('options', options);

  if (!options.validateUpsert) {
    Model.settings.validateUpsert = false;
    console.warn('%s.settings.validateUpsert was overriden to false', Model.pluralModelName);
  }

  if (Model.settings.validateUpsert && options.required) {
    console.warn('Upserts for %s will fail when validation is turned on' + ' and time stamps are required', Model.pluralModelName);
  }

  Model.defineProperty(options.createdAt, { type: Date, required: options.required, defaultFn: 'now' });
  Model.defineProperty(options.updatedAt, { type: Date, required: options.required });

  Model.observe('before save', function (ctx, next) {
    if (ctx.options && ctx.options.skipUpdatedAt) {
      return next();
    }
    if (ctx.instance) {
      // XXX: the presence of ctx.instance.id possibly means this was an upsert
      debug('%s.%s before save: %s', ctx.Model.modelName, options.updatedAt, ctx.instance.id);
      ctx.instance[options.updatedAt] = new Date();
    } else {
      debug('%s.%s before update matching %j', ctx.Model.pluralModelName, options.updatedAt, ctx.where);
      ctx.data[options.updatedAt] = new Date();
    }
    next();
  });
};

module.exports = exports.default;
//# sourceMappingURL=time-stamp.js.map
