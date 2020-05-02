module.exports = function mochaBabel({useBabel, testDir, coverage}, babel, om) {
    testDir = testDir || om.cwd(om.config('@mrbuilder/cli.testDir'));

    if (om.enabled('@mrbuilder/plugin-typescript')) {
        if (useBabel || om.config('@mrbuilder/plugin-typescript.useBabel') !== false) {
            require('@mrbuilder/plugin-typescript/babel').call(this,
                {
                    ...(om.config('@mrbuilder/plugin-typescript', {})),
                    useBabel: true
                },
                babel,
                om
            )
        }
    }
    if (coverage) {
        //only needs to be set when using mocha,
        conf.plugins.push([
            "istanbul",
            {
                "exclude": [
                    `${testDir}/**`
                ]
            }
        ]);
    }
}