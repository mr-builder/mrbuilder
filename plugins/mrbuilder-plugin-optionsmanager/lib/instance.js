'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _OptionsManager = require('./OptionsManager');

var _OptionsManager2 = _interopRequireDefault(_OptionsManager);

var _path = require('path');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = new _OptionsManager2.default({
    prefix: (0, _path.basename)(process.argv[1]).split('-').shift().toUpperCase()
});
//# sourceMappingURL=instance.js.map
