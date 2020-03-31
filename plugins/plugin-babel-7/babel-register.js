const config = require('./babel-config');
require('@mrbuilder/cli').default.logger('@mrbuilder/plugin-babel').debug(JSON.stringify(config, null, 2));
require('@babel/register')(config);
