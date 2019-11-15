import {OptionsManagerType, OptionType} from "./types";

export default function help(optionsManager: OptionsManagerType): () => void {
    return () => {
        let str = '';
        const aliasMap: { [key: string]: OptionType[] } = {};

        optionsManager.forEach((option) => {
            if (option.alias) {
                Object.keys(option.alias).forEach(function (a) {
                    (aliasMap[a] || (aliasMap[a] = [])).push(option);
                });
            }
        });

        optionsManager.forEach((option, key) => {
            str += `${key} - [${optionsManager.enabled(key)
                ? 'enabled' : 'disabled'}]\n`;
            if (option.alias) {
                const keys = Object.keys(option.alias);
                str = keys.reduce(function (ret: string, key: string) {
                    const val = option.alias[key];
                    return str +=
                        key.length === 1 ? `\v\t-${key}\v\t${val}\n`
                            : `\v\t\--${key}\v\t${val}\n`;
                }, str)
            }
        });
        return str;
    }
}
