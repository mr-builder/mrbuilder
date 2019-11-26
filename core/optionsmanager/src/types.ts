import OptionsManager from "./OptionsManager";

export type PluginConfig = {} | false;
export type PluginNameConfig = [string, PluginConfig?];
export type LoggerFn = (...args: any[]) => void;

export type Logger = {
    info: LoggerFn,
    debug: LoggerFn,
    warn: LoggerFn,
}
export type ForEachFn<T> = (opt: T, key: string) => void;
export type EnvFn = (plugin: string, def?: any) => any;
export type Package = {
    name: string,
    [key: string]: any
}
export type PluginAliasObj = {
    [key: string]: any
};
export type NameOrPluginNameConfig = string | PluginNameConfig;

export type PresetsPlugins = {
    presets: NameOrPluginNameConfig[],
    plugins: NameOrPluginNameConfig[],
}

export type OptionsConfig = Partial<PresetsPlugins> & Partial<{
    ignoreRc: boolean,
    env: EnvConfig,
    alias: AliasObj,
    plugin?: string,
}>

export type EnvConfig = {
    [key: string]: PresetsPlugins
}

export type OptionsManagerType = {

    enabled(plugin: string): boolean,
    config(plugin: string, def?: any): any,
    logger(plugin: string): Logger,
    forEach(fn: ForEachFn<OptionType>, scope?: {}): void,
    help(): void,
    env: EnvFn,
    topPackage: Package,
    cwd(...paths: string[]): string
};

type PluginFn = () => void;
export type PluginValue = string | PluginFn | { name: string };

export type AliasObj = {
    [key: string]: string
}

export interface OptionType extends Logger {

    name: string,
    plugin?: PluginValue,
    config?: {},
    parent?: Package,
    alias?: AliasObj,

    get(key: string, def?: any): any,
}

type AnyFn = (id: string) => any;

export type RequireFn = AnyFn & {
    resolve(id: string, options?: { paths?: string[]; }): string;
};

export type NotFoundFn = (e: Error, pkg: string, isDev?: boolean) => void;
export type CwdFn = (...args: string[]) => string;
export type OptionsManagerConfig = Partial<Logger> & Partial<{
    /**
     * The prefix to use in package.json and .<prefix>rc files to identify configuration
     */
    prefix: string,
    /**
     * Same as prefix except for the ENV defaults to uppercase prefix
     */
    envPrefix: string,
    /**
     * prefix in the package.json for configuration.
     */
    confPrefix: string,
    /**
     * Configuration file name
     */
    rcFile: string,
    /**
     * Usually process.env, but here for easy testing.
     */
    env: { [key: string]: any },
    /**
     * Usually process.argv, but here for easy testing.
     */
    argv: string[],
    /**
     * Usually process.cwd() but here for easier testing.
     */
    cwd: CwdFn,
    /**
     * Useually require
     */
    _require: RequireFn,
    /**
     * Alias object for aliasing commands to plugins, if so desired.
     */
    aliasObj: {},
    /**
     * The name of the topPackage, usually the caller.  Usually don't need to pass.
     */
    topPackage: string,
    /**
     * Function to call when plugin is defined but not found.
     */
    handleNotFound: NotFoundFn,
    plugins?: NameOrPluginNameConfig[],
    presets?: NameOrPluginNameConfig[],

}>