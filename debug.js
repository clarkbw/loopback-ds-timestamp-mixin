'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _debug = require('debug');

var _debug2 = _interopRequireDefault(_debug);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function () {
  var name = arguments.length <= 0 || arguments[0] === undefined ? 'time-stamp' : arguments[0];
  return (0, _debug2.default)('loopback:mixins:' + name);
};
//# sourceMappingURL=debug.js.map
