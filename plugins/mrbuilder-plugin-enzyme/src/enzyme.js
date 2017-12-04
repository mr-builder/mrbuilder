const Enzyme  = require('enzyme-internal');
module.exports.EnzymeAdapter = Enzyme.EnzymeAdapter;
const Adapter = require('enzyme-adapter-react-16');

Enzyme.configure({ adapter: new Adapter });

module.exports = Enzyme;
