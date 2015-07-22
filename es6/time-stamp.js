import _debug from './debug';
const debug = _debug();

export default (Model, options = {}) => {

  debug('TimeStamp mixin for Model %s', Model.modelName);

  options = Object.assign({createdAt: 'createdAt', updatedAt: 'updatedAt', required: true}, options);

  debug('options', options);

  debug('Model.settings.validateUpsert', Model.settings.validateUpsert);
  if (Model.settings.validateUpsert && options.required) {
    console.warn('TimeStamp mixin requires validateUpsert be false. See @clarkbw/loopback-ds-timestamp-mixin#10');
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
      ctx.data[options.updatedAt] = new Date();
    }
    next();
  });

};
