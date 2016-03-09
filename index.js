'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _util = require('util');

var _timeStamp = require('./time-stamp');

var _timeStamp2 = _interopRequireDefault(_timeStamp);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = (0, _util.deprecate)(function (app) {
  app.loopback.modelBuilder.mixins.define('TimeStamp', _timeStamp2.default);
}, 'DEPRECATED: Use mixinSources, see https://github.com/clarkbw/loopback-ds-timestamp-mixin#mixinsources');


module.exports = exports.default;
//# sourceMappingURL=index.js.map
