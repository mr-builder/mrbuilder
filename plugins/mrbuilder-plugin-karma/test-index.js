describe(
    `started '${MRBUILDER_TEST_MODULE}'`,
    () => it('😀', () => {
    }));

(tc => tc.keys().forEach(key => {
    describe(key, function () {
        tc(key);
    });
}))(require.context("mrbuilder-karma-test-context", true));

describe(`finished '${MRBUILDER_TEST_MODULE}'`, function () {
    it('🙄', () => {
    });
});
