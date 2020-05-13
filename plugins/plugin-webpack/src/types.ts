import {Configuration} from 'webpack';
import {ExternalItem, WebpackOptions} from "webpack/declarations/WebpackOptions";

export type StringObject = {
    [key: string]: string
}
export type Entry = string | string[] | {
    [key: string]: string | string[]
}

export type MrBuilderWebpackPluginOptions = WebpackOptions & {
    library?: boolean,
    extensions?: string[],
    mainFields: string | string[] | boolean,
    entry: Entry,
    demo?: string | boolean,
    filename: string,
    globalObject?: string,
    alias: string[],
    node: string,
    noParse?: string | string[] | RegExp | RegExp[],
    useExternals?: boolean | string | string[],
    outputPath: string,
    app: string,
    externals: ExternalItem | string | boolean,
    externalizePeers?: boolean,
    public?: string,
    resolve?: Configuration['resolve'],
    runtimeChunk?: string,
    chunkFilename?:string,
    libraryTarget?: "var"
        | "assign"
        | "this"
        | "window"
        | "self"
        | "global"
        | "commonjs"
        | "commonjs2"
        | "commonjs-module"
        | "amd"
        | "amd-require"
        | "umd"
        | "umd2"
        | "jsonp"
        | "system"
};
//For some reason webpack declartions are missing for these....
// declare global {
//     interface RuleSetConditionsRecursive {
//
//     }
//
//     interface RuleSetConditionsAbsoluteRecursive {
//
//     }
//
// }