'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _debug2 = require('./debug');

var _debug3 = _interopRequireDefault(_debug2);

var debug = (0, _debug3['default'])();

exports['default'] = function (Model) {
  var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

  debug('TimeStamp mixin for Model %s', Model.modelName);

  options = _extends({ createdAt: 'createdAt', updatedAt: 'updatedAt', required: true, disableAllValidateUpsert: false }, options);

  debug('options', options);

  if (options.disableAllValidateUpsert) {
    console.warn('%s.settings.validateUpsert was overriden to false', Model.pluralModelName);
    Model.settings.validateUpsert = false;  
  } else {
  
    // Check for PersistedModel static method
    try {
        Model.exists({id: null}, function (err, exists) {
        // Continue normally
        });
    }
    catch(err) {
        if (Model.settings.validateUpsert && options.required) {
            console.warn('TimeStamp mixin requires validateUpsert be false in models not based on PersistedModel, override with disableAllValidateUpsert. See @clarkbw/loopback-ds-timestamp-mixin#10');
        }
    }
  }

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
      
      if (ctx.currentInstance && ctx.currentInstance[options.createdAt]) {
        debug('currentInstance.%s timestamp reused', options.createdAt);
        ctx.data[options.createdAt] = ctx.currentInstance[options.createdAt];
      } else {
        ctx.data[options.createdAt] = new Date();
      }
      
      ctx.data[options.updatedAt] = new Date();
    }
    next();
  });
};

module.exports = exports['default'];
//# sourceMappingURL=time-stamp.js.map