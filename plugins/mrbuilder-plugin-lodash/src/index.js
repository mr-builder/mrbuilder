const { readdirSync }   = require('fs');
const { resolve, join } = require('path');

function isMod(v) {
    return !/^_/.test(v) && /\.js$/.test(v);
}

module.exports =
    ({
         aliasDotImports = true,
         lodash = 'lodash-es',
         lodashDir
     }, webpack, optionsManager) => {

        if (!webpack.resolve.alias) {
            webpack.resolve.alias = {};
        }
        lodashDir = lodashDir || resolve(
            optionsManager.require.resolve(join(lodash, 'package.json')), '..');

        if (aliasDotImports) {
            readdirSync(lodashDir).filter(isMod).reduce((ret, key) => {
                ret[
                    `lodash.${key.toLowerCase().replace(/\.js$/, '')}`
                    ] = join(lodashDir, key);
                return ret;
            }, webpack.resolve.alias);

        }
        webpack.resolve.alias.lodash = lodashDir;
        return webpack
    };
