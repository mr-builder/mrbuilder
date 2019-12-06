const {parseEntry} = require('@mrbuilder/utils');
const Glob = require('glob');
const fs = require('fs');

module.exports = (om) => {
    const logger = om.logger('@mrbuilder/plugin-html');
    const confEntry = om.config('@mrbuilder/plugin-html.entry', om.config('@mrbuilder/plugin-webpack.entry'));
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
                        logger.warn(`looking for index in ${v}`);
                        const globIndex = Glob.sync('index.*', {cwd: index, absolute: true})[0];
                        if (globIndex) {
                            entry = {index: globIndex};
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