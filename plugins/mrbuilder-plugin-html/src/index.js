const HtmlWebpackPlugin                    = require('html-webpack-plugin');
const path                                 = require('path');
const babelConfig                          = require(
    'mrbuilder-plugin-babel/babel-config');
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
const ogenerateAssetTags                   = HtmlWebpackPlugin.prototype.generateAssetTags;

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
                               exported = true,
                               analytics,
                               inlineManifest = true,
                               hot,
                               indexSeach
                           },
                           webpack, om) {
    const info = this.info || console.log;
    const pkg  = require(path.join(process.cwd(), 'package.json'));

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
    entry = entry ? parseEntry(entry) : webpack.entry;

    if (!entry) {
        indexSeach = indexSeach || [publicPath, pkg.source || 'src', pkg.main || 'lib'];
        if (!indexSeach.find(v => {
            if (!v) {
                return false;
            }
            try {
                const index = require.resolve(cwd(v));
                entry       = webpack.entry = { index };
                this.info(`no entry using "${index}"`);
                return true;
            } catch (e) {
                (this.debug || console.warn)(`looking for ${v}`, e);
            }
        })) {
            throw new Error(
                `Sorry but we could not find an entry in '${indexSeach}'
                
                 Possible solutions:
                 1) create a file at 
                 '${path.join(publicPath || (pkg.source || 'src') || (pkg.main || 'main'), 'index.js')}'
                 
                 2) define an entry in package.json
                 "mrbuilder":{
                  "plugins":[ "mrbuilder-plugin-webpack", { "index":"./path/to/index"}]
                 }
                 3) pass an entry argument to mrbuilder
                    $ mrbuilder --entry index=./path/to/index.
                
                `)
        }
    }

    const keys = pages ? Object.keys(pages) : Object.keys(entry);

    info('creating pages', keys, pages);


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

        webpack.plugins.push(new HtmlWebpackPlugin(Object.assign({}, {
            filename: filename.replace(/(\[name\])/g, name) || `${name}.html`,
            chunks,
            name,
            title,
            template: enhancedResolve(template),
            publicPath,
            pkg,
        }, page)));
    });

    return webpack;
};
