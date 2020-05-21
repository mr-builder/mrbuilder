import {instance as optionsManager} from './instance';

const isReact = optionsManager.enabled('@mrbuilder/plugin-react');
const isTypescript = optionsManager.enabled('@mrbuilder/plugin-typescript');
const isCRA = optionsManager.enabled('@mrbuilder/plugin-cra');
const isBabel = optionsManager.enabled('@mrbuilder/plugin-babel');

const _extensions: string[] = optionsManager.config('@mrbuilder/cli.extensions',
    optionsManager.config('@mrbuilder/plugin-webpack.extensions')) || [
    'json',
    'mjs',
    'js',
];
if (isBabel) {
    _extensions.push(...optionsManager.config('@mrbuilder/plugin-babel.extensions', []));
}
if (isReact) {
    _extensions.push('jsx');
}
if (isTypescript) {
    _extensions.push(...optionsManager.config('@mrbuilder/plugin-typescript.extensions', ['ts', 'tsx']));
    if (isReact) {
        _extensions.push('tsx');
    }
}
if (isCRA) {
    _extensions.forEach((v) => _extensions.push('web.' + v));
}

export const extensions = Array.from(new Set(_extensions.map(v=>v.replace(/^[.]/,''))));
export const dotExtensions = extensions.map(v=>`.${v}`);