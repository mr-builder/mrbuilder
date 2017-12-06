module.exports = ({ test = /\.yaml/, use = ['json-loader', 'yaml-loader'] },
                  webpack) => {
    webpack.module.rules.push({
        test,
        use
    });
    return webpack;
};
