declare module "json5" {
    type JSONReplacer = (key: string, value: any) => any | (number | string)[] | null;

    interface JSON5 {
        // Old JSON methods
        parse(text: string, reviver?: (key: any, value: any) => any): any;

        stringify(value: any, replacer?: (key: string, value: any) => any, space?: string | number): string;

        stringify(value: any, replacer?: (number | string)[] | null, space?: string | number): string;

        // New JSON5 stringify function
        stringify(value: any, options?: { space?: number | string, quote?: string, replacer?: JSONReplacer }): string;
    }

    var json5: JSON5;
    export = json5;
}