const HtmlWebpackPlugin  = require('html-webpack-plugin');
const path               = require('path');
const { existsSync }     = require('fs');
const babelConfig        = require('mrbuilder-plugin-babel/babel-config');
const { parseEntry }     = require('mrbuilder-utils');
/**
 *   title     : (deps.description ? deps.description : deps.name),
 hash      : opts.useNameHash,
 filename  : 'index.html',
 publicPath: opts.publicPath,
 analytics : opts.analytics
 * @param pages
 * @param config
 * @param webpack
 */
const ogenerateAssetTags = HtmlWebpackPlugin.prototype.generateAssetTags;

function charset(ele) {
    if (!ele.attributes) {
        ele.attributes = {};
    }
    if (!ele.attributes.charset) {
        ele.attributes.charset = 'UTF-8';
    }
}

HtmlWebpackPlugin.prototype.generateAssetTags = function (assets) {
    const ret = ogenerateAssetTags.call(this, assets);
    ret.body.forEach(charset);
    ret.head.forEach(charset);
    return ret;
};


module.exports = function ({
                               pages = {},
                               title,
                               entry,
                               publicPath = path.join(process.cwd(), 'public'),
                               template,
                               filename, analytics,
                           },
                           webpack) {
    const info = this.info || console.log;
    const pkg  = require(path.join(process.cwd(), 'package.json'));

    if (!this.useHtml) {
        info('not using html as not in app,demo or development mode');
        return webpack;
    }
    if (!title) {
        title = `${pkg.name}: ${pkg.description || ''}`
    }
    if (!template) {
        template = path.resolve(__dirname, '..', 'public',
            analytics ? 'index_analytics.ejs' : 'index.ejs');
    }

    if (!publicPath) {
        publicPath = path.resolve(__dirname, '..', 'public');
    }

    function charset(ele) {
        if (!ele.attributes) {
            ele.attributes = {};
        }
        if (!ele.attributes.charset) {
            ele.attributes.charset = 'UTF-8';
        }
    }

    entry = entry  ? parseEntry(entry) : webpack.entry;
    if (!entry) {
        webpack.entry = { index: path.join(publicPath, 'index') };
        if (!existsSync(entry.index)) {
            info('entry', entry, 'does not exist using default');
            webpack.entry = entry = { index: `${__dirname}/app.js` };
            webpack.module.rules.push({
                test: new RegExp(entry.index),
                use : [{
                    loader : 'val-loader',
                    options: pkg
                }, {
                    loader : 'babel-loader',
                    options: babelConfig
                }]
            });
        }
    }
    /**
     * Allows for a page per entry.
     */
    if (typeof entry === 'string') {
        webpack.entry = path.resolve(publicPath, entry);
        (this.info || console.log)('using entry', webpack.entry);
        webpack.plugins.push(new HtmlWebpackPlugin(Object.assign({}, {
            filename: filename || `index.html`,
            title,
            template,
            publicPath,
        }, pages['index'] || pages)));
    } else if (entry) {
        webpack.entry = entry;
        const keys    = Object.keys(entry);
        info('using entry', keys);
        webpack.plugins.push(...keys.map(key => {
            return new HtmlWebpackPlugin(Object.assign({}, {
                filename: filename || `${key}.html`,
                chunks  : [key],
                title,
                template,
                publicPath,
            }, pages[key]));
        }));
    } else {
        (this.warn || console.warn)('no entry found');
    }
    return webpack;
};
