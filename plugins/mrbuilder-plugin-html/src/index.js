const HtmlWebpackPlugin   = require('html-webpack-plugin');
const path                = require('path');
const babelConfig         = require('mrbuilder-plugin-babel/babel-config');
const { parseEntry, cwd, enhancedResolve } = require('mrbuilder-utils');
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
const ogenerateAssetTags  = HtmlWebpackPlugin.prototype.generateAssetTags;

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
                               pages,
                               title,

                               entry,
                               publicPath = path.join(process.cwd(), 'public'),
                               template,
                               filename = '[name].html',
                               elementId = 'content',
                               exported,
                               analytics,
                               hot
                           },
                           webpack, om) {
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
    hot   = this.isHot;
    entry = entry ? parseEntry(entry) : webpack.entry;

    if (!entry) {
        if (exported == null) {
            exported = true;
        }
        entry = webpack.entry = { index: path.join(publicPath, 'index') };
        try {
            require.resolve(entry.index);
        } catch (e) {

            const index = require.resolve(cwd(pkg.main || './src'));
            this.info(`no entry using "${index}"`);
            entry = webpack.entry = { index };
        }
    }

    const keys = pages ? Object.keys(pages) : Object.keys(entry);

    info('creating pages', keys);


    keys.forEach(name => {
        const chunks = [name];
        //html plugin is kinda borked, so this is a nasty workaround.
        if (om && om.enabled('mrbuilder-plugin-chunk')) {
            const { manifest = 'manifest', vendors = 'vendors' } = om.config(
                'mrbuilder-plugin-chunk');
            if (manifest) {
                chunks.unshift(manifest);
            }
            if (vendors) {
                chunks.unshift(vendors);
            }
            info('using chunks', chunks);
        }


        const page = pages && pages[name] || {};

        if (('exported' in page) ? page.exported : exported) {
            const val          = webpack.entry[name];
            const current      = Array.isArray(val) ? val[val.length - 1] : val;
            const currentAlias = `mrbuilder-plugin-html-${name}`;

            webpack.resolve.alias[currentAlias] = current;

            webpack.entry = Object.assign({},
                webpack.entry,
                {
                    [name]: [`babel-loader?${JSON.stringify(
                        babelConfig)}!mrbuilder-plugin-html/src/loader?${JSON.stringify(
                        {
                            name     : currentAlias,
                            hot      : ('hot' in page) ? page.hot : hot,
                            elementId: page.elementId || elementId,
                            exported : page.exported || exported

                        })}!${current}?exported`] //?exported allows for the
                                                  // file to be inspected.
                }
            );
        }

        webpack.plugins.push(new HtmlWebpackPlugin(Object.assign({}, {
            filename: filename.replace(/(\[name\])/g, name) || `${name}.html`,
            chunks,
            name,
            title,
            template:enhancedResolve(template),
            publicPath,
            pkg,
        }, page)));
    });
    return webpack;
};
