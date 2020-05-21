const {cwd} = require('@mrbuilder/utils');
const useBabel = require('../use-babel');
const version = require('../version');
module.exports = ({
                      test,
                      extensions,
                      include = [
                          cwd('src'),
                          cwd('public'),
                          /\/src\//,
                          /\/public\//,
                          /@mrbuilder\/plugin-html\/.*/
                      ],
                  }, webpack, om) => {

    const use = useBabel(om);

    if (!test) {

        test = /\.(?:es[m\d]?|jsx?|mjs)$/;
        if (om.config('@mrbuilder/plugin-typescript.useBabel') || om.enabled('@mrbuilder/plugin-jest')) {

            if (version > 6) {
                test = /\.(?:es[m\d]?|[jt]sx?|mjs)$/
            } else {
                (this.warn || console.warn)('useBabel only works with babel 7 or higher')
            }
        }
    }

    webpack.module.rules.push({
        test,
        include,
        use,
    });
    return webpack;
};
