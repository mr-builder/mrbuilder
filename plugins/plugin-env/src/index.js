const { env }               = process;
const { EnvironmentPlugin } = require('webpack');

module.exports = function ({ p = false, environment = ['NODE_ENV'] }, webpack) {
    if (p) {
        if (env.NODE_ENV && env.NODE_ENV !== 'production') {
            this.info(
                'env is set and its not to production even though we are in production mode',
                env.NODE_ENV)
        } else {
            this.nodeEnv = env.NODE_ENV = 'production';
        }
    } else if (!env.NODE_ENV) {
        env.NODE_ENV = this.isKarma ? 'test' : 'development';
    }

    this.nodeEnv = env.NODE_ENV;

    webpack.plugins.push(new EnvironmentPlugin(environment));
    return webpack;
};
