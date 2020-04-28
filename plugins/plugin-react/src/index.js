const {resolvePkgDir} = require('@mrbuilder/utils');
const useBabel = require('@mrbuilder/plugin-babel/use-babel.js');
const {info} = require('@mrbuilder/cli');
let showedWarning = false;

module.exports = function reactPlugin({compatMode,}, webpack, om) {
    if (om.enabled('@mrbuilder/plugin-crank')) {
        return webpack;
    }
    const pages = om.config('@mrbuilder/plugin-html.pages');
    const exported = om.config('@mrbuilder/plugin-html.exported', true);
    const elementId = om.config('@mrbuilder/plugin-html.elementId', 'content');
    const isHot = om.enabled('@mrbuilder/plugin-hot');
    const logger = om.logger('@mrbuilder/plugin-react');
    if (!webpack.resolve) {
        webpack.resolve = {};
    }
    if (!webpack.resolve.alias) {
        webpack.resolve.alias = {};
    }
    const reactDir = resolvePkgDir('react');
    if (compatMode) {
        if (info.isLibrary) {
            logger.warn(
                'compatMode should not be used for libraries results will be unpredictable')
        }
        if (!webpack.resolve.alias['react-internal']) {
            webpack.resolve.alias['react-internal'] = reactDir;
        }
        if (!webpack.resolve.alias.react) {
            webpack.resolve.alias.react = require.resolve('./react.js');
        }
        if (!webpack.resolve.alias['react/']) {
            webpack.resolve.alias['react/'] = reactDir;
        }
    } else {
        if (!webpack.resolve.alias['react']) {
            webpack.resolve.alias['react'] = reactDir;
        }
    }


    if (!webpack.resolve.alias['react-dom/']) {
        webpack.resolve.alias['react-dom/'] = resolvePkgDir('react-dom');
    }

    if (!webpack.resolve.alias['react-dom']) {
        webpack.resolve.alias['react-dom'] = resolvePkgDir('react-dom');
    }
    //so styleguidist tries to do this, but it fails.  So we do it instead.
    // webpack resolve alias is super flackey.  It depends on entry order, rather
    // than depth specified.
    if (!webpack.resolve.alias['prop-types/checkPropTypes']) {
        webpack.resolve.alias['prop-types/checkPropTypes'] = require.resolve('prop-types/checkPropTypes');
    }

    if (!webpack.resolve.alias['prop-types/']) {
        webpack.resolve.alias['prop-types/'] = resolvePkgDir('prop-types');
    }

    if (!webpack.resolve.alias['prop-types']) {
        webpack.resolve.alias['prop-types'] = resolvePkgDir('prop-types');
    }

    if (isHot || (pages && Object.values(pages).find(v => v.hot))) {
        if (!webpack.resolve.alias['react-hot-loader']) {
            webpack.resolve.alias['react-hot-loader'] = resolvePkgDir('react-hot-loader');
        }
    }

    const preEntry = isHot ? om.config('@mrbuilder/plugin-hot.preEntry', []) : [];

    if (om.enabled('@mrbuilder/plugin-html')) {
        const {findEntry} = require('@mrbuilder/plugin-html');
        const entry = webpack.entry = findEntry(om);
        const {generateHot, generate} = require('./loader');
        const keys = pages ? Object.keys(pages) : Object.keys(entry);

        keys.forEach(name => {
            const page = pages && pages[name] || {};
            const hot = ('hot' in page) ? page.hot : isHot;


            if (('exported' in page) ? page.exported : exported) {

                logger.info('expecting a react component to be exported from ', name);
                const val = webpack.entry[name];
                const current = Array.isArray(val) ? val[val.length - 1] : val;
                const currentAlias = `@mrbuilder/plugin-react-${name}`;

                webpack.resolve.alias[currentAlias] = current;


                webpack.entry = Object.assign({},
                    webpack.entry,
                    {
                        [name]: [
                            ...preEntry,
                            `babel-loader?${JSON.stringify(useBabel(om).options)}!@mrbuilder/plugin-react/src/loader?${JSON.stringify(
                                {
                                    name: currentAlias,
                                    hot,
                                    elementId: page.elementId || elementId,
                                    exported: page.exported || exported

                                })}!${current}?exported`
                        ]
                        //?exported allows for the
                        // file to be inspected.
                    }
                );

            } else {
                webpack.entry[name] = preEntry.concat(webpack.entry[name]);
                //don't show warning if the setting is set.
                showedWarning = showedWarning || exported === false || page.exported === false;
                if (!showedWarning) {
                    showedWarning = true;
                    logger.info(
                        `not using exported components, you may need to setup hot and dom mounting manually for ${name}
                     Something like  to your entry point:
                    \`\`\` 
                     ${(hot ? generateHot : generate)(name, 'content', true)}
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
            webpack.externals.push('react', 'react-dom', 'prop-types');
        }
    } else if (isHot) {
        //its hot, but not serving html, so we just add the preEntry stuff.
        webpack.entry = Object.entries(webpack.entry).reduce((ret, [key, value]) => {
            ret[key] = preEntry.concat(value);
            return ret;
        }, {});
    }
    return webpack;
};
