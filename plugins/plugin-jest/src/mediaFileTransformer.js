const path = require('path');

// Mocks every media file to return its filename. Makes it possible to test that
// the correct images are loaded for components.

const transform = {
    process(_, filename) {
        return `module.exports = ${JSON.stringify(path.basename(filename))};`
    }
};
module.exports = transform;