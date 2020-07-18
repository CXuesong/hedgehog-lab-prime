/* eslint-disable @typescript-eslint/no-explicit-any */

declare module "hedgehog-lab/core/transpiler/transpiler-core" {
    function transpilerCore(yourCode: string): string;
    export default transpilerCore;
}

declare module "hedgehog-lab/core/runtime" {
    export interface IExecutionOutput {
        outputType: "print",
        text: {
            mode: string,
            digits: number,
            val: any,
            rows: number,
            cols: number
        }
    }
    export function executeOutput(yourCode: string): IExecutionOutput[];
}
