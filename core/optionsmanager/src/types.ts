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
export type OptionType = {
    name: string,
    plugin?: PluginValue,
    config?: {},
    parent?: Package,
    alias?: AliasObj,
    get(key: string, def?: any): any,
} & Logger;

type AnyFn = (id: string) => any;

export type RequireFn = AnyFn & {
    resolve(id: string, options?: { paths?: string[]; }): string;
};

export type NotFoundFn = (e: Error, pkg: string, isDev?: boolean) => void;
export type CwdFn = (...args: string[]) => string;
export type OptionsManagerConfig = Partial<Logger> & {
    prefix?: string,
    envPrefix?: string,
    confPrefix?: string,
    rcFile?: string,
    env?: { [key: string]: any },
    argv?: string[],
    cwd?: CwdFn,
    _require?: RequireFn,
    aliasObj: {},
    topPackage?: string,
    handleNotFound?: NotFoundFn,
}