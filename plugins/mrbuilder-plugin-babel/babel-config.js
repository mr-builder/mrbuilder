const path         = require('path');
const fs           = require('fs');
const babelProcess = require('./babel-process');
const babelrc      = path.resolve(process.cwd(), '.babelrc');
const mrbuilder = require('mrbuilder-plugin-optionsmanager/lib/instance').default;
let conf;
if (fs.existsSync(babelrc)) {
    conf = JSON.parse(fs.readFileSync(babelrc, 'utf8'));
}
//defaults to ./babelrc.json
module.exports =
    babelProcess(conf, void(0), mrbuilder.config('mrbuilder-plugin-babel.coverage'));
