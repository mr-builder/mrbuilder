
const path         = require('path');
const fs           = require('fs');
const babelProcess = require('./babel-process');
const babelrc      = path.resolve(process.cwd(), '.babelrc');
let conf;
if (fs.existsSync(babelrc)) {
    conf = JSON.parse(fs.readFileSync(babelrc, 'utf8'));
}
//defaults to ./babelrc.json
module.exports =
    babelProcess(conf, void(0), false);
