import {WebpackOptions} from "webpack/declarations/WebpackOptions";

import {
    resolveMap,
    enhancedResolve,
} from '@mrbuilder/utils';

type StringObj = { [key: string]: string }
export default function (webpack: WebpackOptions, alias: string | string[] | StringObj): StringObj | undefined {
    if (!alias) {
        return;
    }

    if (!webpack.resolve) {
        webpack.resolve = {};
    }
    if (!webpack.resolve.alias) {
        webpack.resolve.alias = {};
    }
    if (typeof alias === 'string') {
        alias = alias.split(/,\s*/);
    }
    if (Array.isArray(alias)) {
        return Object.assign(webpack.resolve.alias, resolveMap(...alias));

    }
    const r: StringObj = {};
    return Object.assign(webpack.resolve.alias, webpack.resolve.alias, Object.entries(alias).reduce((ret: StringObj, [key, value]) => {
        ret[key] = enhancedResolve(value);
        return ret;
    }, r));
};
