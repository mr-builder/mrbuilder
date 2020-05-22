const {parseEntry} = require('@mrbuilder/utils');
const fs = require('fs');
const {extensions} = require('@mrbuilder/cli');
const path = require('path');

module.exports = (om = require('@mrbuilder/cli').optionsManager) => {
    const logger = om.logger('@mrbuilder/plugin-html');
    const confEntry = om.enabled('@mrbuilder/plugin-cra') ? require('@mrbuilder/plugin-cra/config/paths').appIndexJs : om.config('@mrbuilder/plugin-html.entry', om.config('@mrbuilder/plugin-webpack.entry'));
    let entry = confEntry ? parseEntry(confEntry) : null;
    let indexSearch = om.config('@mrbuilder/plugin-html.indexSearch');
    const pkg = om.topPackage;
    const defaultSearch = [om.config('@mrbuilder/plugin-html.publicPath'), om.config('@mrbuilder/cli.publicDir'), om.config('@mrbuilder/cli.sourceDir', pkg.source || 'src'), pkg.main || 'lib'];
    if (indexSearch || !confEntry) {
        indexSearch = (indexSearch != null ? Array.isArray(indexSearch) ? indexSearch : [indexSearch] : defaultSearch).filter(Boolean);
        if (!indexSearch.find(v => {
                if (!v) {
                    return false;
                }
                let index = om.cwd(v);
                try {
                    const stat = fs.lstatSync(index);
                    if (stat.isDirectory()) {

                        logger.info(`looking for index in ${v}`);
                        const indexPath = path.join(index, 'index.');
                        const ext = extensions.find(v => fs.existsSync( indexPath+ v));
                        if (ext) {
                            entry = {index: `${indexPath}${ext}`};
                            logger.info(` using "${entry.index}"`);
                            return true;
                        }
                        return false;
                    } else {
                        entry = {index};
                        return true;
                    }
                } catch (e) {
                    if (e.code !== 'ENOENT') {
                        throw e;
                    }
                }
                return false;
            }
        )) {
            throw new Error(
                `Sorry but we could not find an entry in '${indexSearch}'
                
                 Possible solutions:
                 1) create a file at 
                 '${indexSearch}'
                 
                 2) define an entry in package.json
                 "mrbuilder":{
                  "plugins":[ "@mrbuilder/plugin-html", { "index":"./path/to/index"}]
                 }
                 3) pass an entry argument to mrbuilder
                    $ mrbuilder --entry index=./path/to/index.
                
                `)
        }
    }
    return entry;
};