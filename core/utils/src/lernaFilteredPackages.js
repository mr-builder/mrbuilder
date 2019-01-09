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
                _   : [],
                json: true,
                ...opts,
                onRejected,
                onResolved() {
                    //different version of lerna3 are well different.
                    if (ls.filteredPackages) {
                        res(ls.filteredPackages);
                    } else if (ls.result) {
                        res(JSON.parse(ls.result.text));
                    } else {
                        //throw?
                        res([]);
                    }
                }
            })
        })
    } catch (e) {
        const LsCommand = require('lerna/lib/commands/LsCommand').default;
        const ls        = new LsCommand(null, opts, opts.cwd || process.cwd());
        ls.runPreparations();
        return Promise.resolve(ls.filteredPackages.map(({_location: location, ...rest}) => ({
            location,
            ...rest,
        })));
    }
};
