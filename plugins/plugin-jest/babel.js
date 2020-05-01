module.exports = function jestBabel({useBabel}, config, om) {
    if (om.enabled('@mrbuilder/plugin-typescript')) {
        if (useBabel || om.config('@mrbuilder/plugin-typescript.useBabel') !== false) {
            require('@mrbuilder/plugin-typescript/babel').call(this,
                {
                    ...(om.config('@mrbuilder/plugin-typescript', {})),
                    useBabel: true
                },
                config,
                om
            )
        }
    }
}