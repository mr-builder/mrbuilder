const HtmlWebpackPlugin = require('html-webpack-plugin');
const path              = require('path');

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
                               pages = {}, title,
                               entry = 'index',
                               publicPath = path.join(process.cwd(), 'public'),
                               template,
                               filename, analytics,
                           },
                           webpack) {
    if (!title) {
        const pkg = require(path.join(process.cwd(), 'package.json'));
        title     = `${pkg.name}: ${pkg.description || ''}`
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

    entry = entry || webpack.entry || path.join(publicPath, entry);
    /**
     * Allows for a page per entry.
     */
    if (typeof entry === 'string') {
        webpack.entry = entry;
        (this.info || console.log)('using entry', webpack.entry);
        webpack.plugins.push(new HtmlWebpackPlugin(Object.assign({}, {
            filename: filename || `index.html`,
            title,
            template,
            publicPath,
        }, pages['index'])));
    } else if (entry) {
        webpack.entry = entry;
        const keys    = Object.keys(entry);
        (this.info || console.log)('using entry', keys);
        webpack.plugins.push(...keys.map(key => {
            return new HtmlWebpackPlugin(Object.assign({}, {
                filename: filename || `${key}.html`,
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
