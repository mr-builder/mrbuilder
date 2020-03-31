const config = require('./babel-config');
require('@mrbuilder/cli').default.debug('babel', JSON.stringify(config));
require('@babel/register')(config);
