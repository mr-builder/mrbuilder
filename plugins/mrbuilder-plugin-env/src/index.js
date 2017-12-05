const { env }  = process;
module.exports = ({ p = false, environment = ['NODE_ENV'] }, webpack) => {
    if (p) {
        if (env.NODE_ENV && env.NODE_ENV !== 'production') {
            this.warn('env is set and its not to production even though we are in production mode', env.NODE_ENV)
        } else {
            this.nodeEnv = env.NODE_ENV = 'production';
        }
    } else if (!env.NODE_ENV) {
        env.NODE_ENV = 'development';
    }
    this.nodeEnv = env.NODE_ENV;
    webpack.plulgins.push(new webpack.EnvironmentPlugin(environment));
};
