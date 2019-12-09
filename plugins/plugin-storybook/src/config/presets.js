module.exports = [
    '../manager-plugin',
    ...require('@mrbuilder/cli').default.config('@mrbuilder/plugin-storybook.presets', []),
].filter(Boolean).map(v => require.resolve(v));