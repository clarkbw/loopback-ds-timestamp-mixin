import { deprecate } from 'util';
import timestamp from './time-stamp';

export default deprecate((app) => {
  app.loopback.modelBuilder.mixins.define('TimeStamp', timestamp);
}, 'DEPRECATED: Use mixinSources, see https://github.com/clarkbw/loopback-ds-timestamp-mixin#mixinsources');
