import JSON5 from 'json5';

export function parseRe(key, value) {
    if (typeof value !== 'string') {
        return value;
    }
    if (/^\/.*\/[gim]*$/.test(value)) {
        const parts = /^\/(.*)\/([gim]*)$/.exec(value);
        if (parts.length === 3) {
            return new RegExp(parts[1], parts[2]);
        }
        return new RegExp(parts[1]);
    }
    return value;
}

export function parseValue(value) {
    if (/^".*"$/.test(value)) {
        return JSON5.parse(value, parseRe)
    }
    if (/^(true|false)$/.test(value)) {
        return JSON5.parse(value);
    }
    if (/^\/.*\/[gim]*$/.test(value)) {
        const parts = value.split(/^\/(.*)\/([gim]*)$/);
        const re    = parts[1];
        const mod   = parts[2];
        if (mod) {
            return new RegExp(re, mod);
        }
        return new RegExp(re);
    }
    if (/^\d+?(?:\.\d*)?$/.test(value)) {
        return JSON5.parse(value);
    }
    if (/^\[([^{}\[\]]*)\]$/.test(value)) {
        return value.replace(/^\[(.*)\]$/, '$1')
                    .split(/,\s*/)
                    .filter(Boolean)
                    .map(parseValue);

    }
    if (/^\{(.*)\}$/.test(value)) {
        return JSON5.parse(value, parseRe);

    }
    return JSON5.parse(`"${value}"`, parseRe);
}

export function stringify(value, indent = 2) {
    return JSON.stringify(value, function (key, value) {
        if (value instanceof RegExp) {
            return value.toString();
        }
        return value;
    }, indent);
}
