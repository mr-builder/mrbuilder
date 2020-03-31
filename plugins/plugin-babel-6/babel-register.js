const config = require('./babel-config');
const om = require('@mrbuilder/cli').default;
om.debug('babel', JSON.stringify(config, null, 2));
require('babel-register')(config);

