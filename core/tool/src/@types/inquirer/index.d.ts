declare module 'inquirer' {
    export type Message = {
        message: string,
        type: string,
        name: string,
    }
    export type Answer = {
        confirm: boolean,
        value: string,
    }

    type Inquirer = {
        prompt(mesg: Message[]): Promise<Answer>
    }
    let inquirer: Inquirer;
    export default inquirer;
}