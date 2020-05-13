const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');
const {enhancedResolve} = require('@mrbuilder/utils');
const findEntry = require('./findEntry');
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
                               pages,
                               title,

                               publicPath,
                               template,
                               filename,
                               elementId,
                               exported,
                               analytics,
                               inlineManifests,
                               hot,
                               indexSearch,
                               minify,
                           },
                           webpack, om) {
    let pkg;
    const logger = om.logger('@mrbuilder/plugin-html');
    let entry;

    if (om.enabled('@mrbuilder/plugin-cra')) {
        logger.info('using paths from CRA');
        const paths = require('@mrbuilder/plugin-cra/src/config/paths');
        template = paths.appHtml;
        pkg = paths.appPath;
        publicPath = paths.appPublic;
        entry = {index: paths.appIndexJs};
    } else {
        pkg = require(om.cwd('package.json'));
        if (!template) {
            template = path.resolve(__dirname, '..', 'public',
                analytics ? 'index_analytics.ejs' : 'index.ejs');
        }
        if (!publicPath) {
            publicPath = 'public';
        }
        entry = webpack.entry = webpack.entry || findEntry(om);
    }

    if (!title) {
        title = `${pkg.name}: ${pkg.description || ''}`
    }

    const keys = pages ? Object.keys(pages) : Object.keys(entry);

    logger.info('creating pages', keys, pages || '', 'entry');


    keys.forEach(name => {
        const chunks = [name];
        //html plugin is kinda borked, so this is a nasty workaround.
        if (om && om.enabled('@mrbuilder/plugin-chunk')) {
            const {manifest = 'manifest', vendors = 'vendors'} = om.config('@mrbuilder/plugin-chunk');
            if (vendors) {
                chunks.unshift(vendors);
            }
            if (manifest) {
                chunks.unshift(manifest);
            }
            logger.info('using chunks', chunks);
        }


        const page = pages && pages[name] || {};
        const htmlOptions = {
            filename: filename.replace(/(\[name\])/g, name) || `${name}.html`,
            chunks,
            name,
            title,
            elementId,
            template: enhancedResolve(template),
            publicPath,
            pkg,
            minify,
        };
        if (om.enabled('@mrbuilder/plugin-compress')) {
            htmlOptions.jsExtension = '.gz';
        }
        webpack.plugins.push(new HtmlWebpackPlugin(htmlOptions, page));
    });

    return webpack;
};
module.exports.HtmlWebpackPlugin = HtmlWebpackPlugin;
module.exports.findEntry = findEntry;