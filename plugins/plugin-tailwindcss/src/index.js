const fs = require('fs');
const useStyle = require('@mrbuilder/plugin-css/styleLoader');

module.exports = ({test, autoprefixer = true}, webpack, optionsManager) => {
    const tailwindConfig = require(fs.existsSync(optionsManager.cwd('tailwind.config.js')) ? optionsManager.cwd('tailwind.config.js') : `${__dirname}/tailwind.config.js`);
    const plugins = [
        require('tailwindcss')(tailwindConfig)
    ];
    if (autoprefixer) {
        if (autoprefixer === true) {
            plugins.push(require('autoprefixer'));
        } else {
            plugins.push(require('autoprefixer')(autoprefixer))
        }
    }
    if (/\.css/.test(test.source) && om.enabled('@mrbuilder/plugin-css')) {
        optionsManager.logger('@mrbuilder/plugin-tailwindcss').warn(`tailwindcss '${test.source}' test overlaps css
        disable '@mrbuilder/plugin-css' or use a different extension like '.twcss'
        `);
    }

    webpack.module.rules.push({
        test,
        use: useStyle(webpack,

            {
                loader: 'css-loader',
                options: {
                    importLoaders: 1,
                    sourceMap: true,
                }
            },
            {
                loader: 'postcss-loader',
                options: {
                    plugins
                },
            })
    });

    return webpack;
};