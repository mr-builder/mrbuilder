export default function (optionsManager) {
    return () => {
        let str        = '';
        const aliasMap = {};

        optionsManager.forEach((option, key) => {
            if (option.alias) {
                Object.keys(option.alias).reduce(function (ret, a) {
                    (aliasMap[a] || (aliasMap[a] = [])).push(option);
                }, aliasMap)
            }
        });

        optionsManager.forEach((option, key) => {
            str += `${key} - [${optionsManager.enabled(key)
                ? 'enabled' : 'disabled'}]\n`;
            if (option.alias) {
                const keys = Object.keys(option.alias);
                str        = keys.reduce(function (ret, key) {
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
