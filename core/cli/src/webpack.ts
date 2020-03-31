
export type CliOptions = {
    "sourceDir": string,
    "outputDir": string,
    "testDir": string
}
export default function <T>(opts: CliOptions, webpack: T): T {

    return webpack;
}