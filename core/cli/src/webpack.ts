import {Configuration} from 'webpack';

export type CliOptions = {
    "sourceDir": string,
    "outputDir": string,
    "testDir": string
}
export default function (opts: CliOptions, webpack: Configuration): Configuration {

    return webpack;
}