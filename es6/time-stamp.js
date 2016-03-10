import _debug from './debug';
const debug = _debug();

export default (Model, options = {}) => {

  debug('TimeStamp mixin for Model %s', Model.modelName);

  options = Object.assign({
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
    required: true,
    disableAllValidateUpsert: false
  }, options);

  debug('options', options);

  debug('Model.settings.validateUpsert', Model.settings.validateUpsert);
  if (options.disableAllValidateUpsert) {
    Model.settings.validateUpsert = false;
    console.warn('%s.settings.validateUpsert was overriden to false', Model.pluralModelName);
  } else {

    // Check base model
    if (Model.settings.base != 'PersistedModel') {
      // Check for PersistedModel static method
      try {
        Model.exists({ id: null }, function(err, exists) {
          // Continue normally
        });
      } catch (err) {
        if (Model.settings.validateUpsert && options.required) {
          console.warn('TimeStamp mixin requires validateUpsert be false in models not based on PersistedModel, ' +
                       'override with disableAllValidateUpsert. See @clarkbw/loopback-ds-timestamp-mixin#10');
        }
      }
    }
  }

  Model.settings.validateUpsert = false;

  Model.defineProperty(options.createdAt, {type: Date, required: options.required, defaultFn: 'now'});
  Model.defineProperty(options.updatedAt, {type: Date, required: options.required});

  Model.observe('before save', (ctx, next) => {
    debug('ctx.options', ctx.options);
    if (ctx.options && ctx.options.skipUpdatedAt) { return next(); }
    if (ctx.instance) {
      debug('%s.%s before save: %s', ctx.Model.modelName, options.updatedAt, ctx.instance.id);
      ctx.instance[options.updatedAt] = new Date();
    } else {
      debug('%s.%s before update matching %j', ctx.Model.pluralModelName, options.updatedAt, ctx.where);
      debug('ctx.currentInstance', ctx.currentInstance, ctx.currentInstance[options.createdAt]);
      if (ctx.currentInstance && ctx.currentInstance[options.createdAt]) {
        debug('currentInstance.%s timestamp reused %d', options.createdAt, ctx.currentInstance[options.createdAt]);
        ctx.data[options.createdAt] = ctx.currentInstance[options.createdAt];
      } else {
        ctx.data[options.createdAt] = new Date();
      }

      ctx.data[options.updatedAt] = new Date();
    }
    next();
  });

};

module.exports = exports.default;
