//const {cssLoader} = require("@mrbuilder/plugin-css");
const fs = require('fs');

module.exports = ({test}, webpack, optionsManager) => {
    webpack.module.rules.push({
        test,
        use: [
            {
                loader: 'style-loader'
            },
            {
                loader: 'css-loader',
                options: {
                    importLoaders: 1,
                    'sourceMap': true,
                }
            },
            {
                loader: 'postcss-loader',
                options: {
                    plugins: [
                        require('tailwindcss')(require(fs.existsSync(optionsManager.cwd('tailwind.config.js')) ? optionsManager.cwd('tailwind.config.js') : `${__dirname}/tailwind.config.js`)),
                        require('autoprefixer'),
                    ]
                },
            }]
    });

    return webpack;
};