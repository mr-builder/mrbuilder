#!/usr/bin/env node
const args = process.argv.slice(2);

const scriptIndex = args.findIndex(
    x => x === 'build' || x === 'start' || x === 'test'
);
const script = scriptIndex === -1 ? args[0] : args[scriptIndex];

if (['build', 'start', 'test'].includes(script)) {
    process.env.MRBUILDER_ENV = `cra-${script}`;
    require(`@mrbuilder/plugin-cra/bin/cra-${script}`);
}
