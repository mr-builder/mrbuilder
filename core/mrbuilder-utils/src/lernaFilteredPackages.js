/**
 * Hard enough for me to think its not a good idea.
 *
 * @param opts
 * @returns {Promise<*>}
 */
module.exports = (opts) => {
    try {
        const LsCommand = require('@lerna/list');
        return new Promise((res, onRejected) => {
            const ls = new LsCommand({
                ...opts,
                onRejected,
                onResolved() {
                    res(ls.filteredPackages);
                }
            })
        })
    } catch (e) {
        const LsCommand = require('lerna/lib/commands/LsCommand');
        const ls        = new LsCommand(null, opts, opts.cwd || process.cwd());
        ls.runPreparations();
        return ls.filteredPackages.map(({_location: location, ...rest}) => ({
            location,
            ...rest,
        }));
    }
};