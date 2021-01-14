describe(
    `started '${MRBUILDER_TEST_MODULE}'`,
    () => it('😀', () => {
    }));
console.log(MRBUILDER_TEST_MODULE);
(tc => tc.keys().forEach(key => {
    describe(key, function () {
        tc(key);
    });
}))(require.context("@mrbuilder/karma-test-context"));

describe(`finished '${MRBUILDER_TEST_MODULE}'`, function () {
    it('🙄', () => {
    });
});
