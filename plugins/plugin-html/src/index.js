const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');
const {parseEntry, enhancedResolve} = require('@mrbuilder/utils');
const Glob = require('glob');
const fs = require('fs');
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

                               entry,
                               publicPath,
                               template,
                               filename,
                               elementId,
                               exported,
                               analytics,
                               inlineManifests,
                               hot,
                               indexSearch,
                           },
                           webpack, om) {
    const logger = om.logger('@mrbuilder/plugin-html');
    const pkg = require(om.cwd('package.json'));

    if (!title) {
        title = `${pkg.name}: ${pkg.description || ''}`
    }
    if (!template) {
        template = path.resolve(__dirname, '..', 'public',
            analytics ? 'index_analytics.ejs' : 'index.ejs');
    }

    if (!publicPath) {
        publicPath = 'public';
    }

    entry = entry ? parseEntry(entry) : webpack.entry;

    if (!entry) {
        indexSearch = indexSearch != null ? Array.isArray(indexSearch) ? indexSearch : [indexSearch] : [publicPath, pkg.source || 'src', pkg.main || 'lib'];
        if (!indexSearch.find(v => {
                if (!v) {
                    return false;
                }
                try {
                    const stat = fs.lstatSync(om.cwd(v));
                    if (stat.isDirectory()) {
                        const index = Glob.sync('index.*', {cwd: v})[0];
                        if (index) {
                            entry = webpack.entry = {index};
                            logger.info(`no entry using "${index}"`);
                            return true;
                        }
                        logger.warn(`looking for index in ${v}`);
                        return false;

                    }
                    entry = webpack.entry = {index: v};
                    return true;
                } catch (e) {
                    return false;
                }
            }
        )) {
            throw new Error(
                `Sorry but we could not find an entry in '${indexSearch}'
                
                 Possible solutions:
                 1) create a file at 
                 '${path.join(publicPath || (pkg.source || 'src') || (pkg.main || 'main'), 'index.js')}'
                 
                 2) define an entry in package.json
                 "mrbuilder":{
                  "plugins":[ "@mrbuilder/plugin-webpack", { "index":"./path/to/index"}]
                 }
                 3) pass an entry argument to mrbuilder
                    $ mrbuilder --entry index=./path/to/index.
                
                `)
        }
    }

    const keys = pages ? Object.keys(pages) : Object.keys(entry);

    logger.info('creating pages', keys, pages || '', 'entry', JSON.stringify(entry, null, 2));


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
