const {resolvePkgDir} = require('@mrbuilder/utils');
const useBabel = require('@mrbuilder/plugin-babel/use-babel.js');
const {info} = require('@mrbuilder/cli');
let showedWarning = false;

module.exports = function crankPlugin({compatMode,}, webpack, om) {

    const pages = om.config('@mrbuilder/plugin-html.pages');
    const exported = om.config('@mrbuilder/plugin-html.exported', true);
    const elementId = om.config('@mrbuilder/plugin-html.elementId', 'content');
    const logger = om.logger('@mrbuilder/plugin-crank');
    if (!webpack.resolve) {
        webpack.resolve = {};
    }
    if (!webpack.resolve.alias) {
        webpack.resolve.alias = {};
    }
    if (!webpack.resolve.alias['@bikeshaving/crank']) {
        webpack.resolve.alias['@bikeshaving/crank'] = resolvePkgDir('@bikeshaving/crank');
    }

    if (om.enabled('@mrbuilder/plugin-html')) {
        const {findEntry} = require('@mrbuilder/plugin-html');
        const entry = webpack.entry = findEntry(om);
        const {generate} = require('./loader');
        const keys = pages ? Object.keys(pages) : Object.keys(entry);

        keys.forEach(name => {
            const page = pages && pages[name] || {};

            if (('exported' in page) ? page.exported : exported) {

                logger.info('expecting a crank component to be exported from ', name);
                const val = webpack.entry[name];
                const current = Array.isArray(val) ? val[val.length - 1] : val;
                const currentAlias = `@mrbuilder/plugin-crank-${name}`;

                webpack.resolve.alias[currentAlias] = current;


                webpack.entry = Object.assign({},
                    webpack.entry,
                    {
                        [name]: [
                            `babel-loader?${JSON.stringify(useBabel(om).options)}!@mrbuilder/plugin-crank/src/loader?${JSON.stringify(
                                {
                                    name: currentAlias,
                                    elementId: page.elementId || elementId,
                                    exported: page.exported || exported

                                })}!${current}?exported`
                        ]
                        //?exported allows for the
                        // file to be inspected.
                    }
                );

            } else {
                webpack.entry[name] = [webpack.entry[name]];
                //don't show warning if the setting is set.
                showedWarning = showedWarning || exported === false || page.exported === false;
                if (!showedWarning) {
                    showedWarning = true;
                    logger.info(
                        `not using exported components, you may need to setup dom mounting manually for ${name}
                     Something like  to your entry point:
                    \`\`\`
                     ${generate(name, 'content', true)}
                    \`\`\`

                    This may break between releases so exported entries are preferred.
                    `);
                }


            }
        });
    } else if (info.isLibrary) {
        if (om.config('@mrbuilder/plugin-webpack.useExternals') !== false) {
            if (!webpack.externals) {
                webpack.externals = [];
            }
            webpack.externals.push('@bikeshaving/crank');
        }
    }
    return webpack;
};
