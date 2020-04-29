import chalk from 'chalk';

export function logObject(label: string, write: boolean, obj: any): void {
    if (write) {
        console.log(chalk.cyan(`/*** ${label} ***/`));
        console.dir(obj, {showHidden: false, depth: 8, colors: true /* enable colors */});
        console.log(chalk.cyan(`/*** ${label} end ***/`));
    }
}