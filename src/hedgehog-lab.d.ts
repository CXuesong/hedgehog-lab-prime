/* eslint-disable lines-between-class-members */
/* eslint-disable @typescript-eslint/no-explicit-any */

declare module "hedgehog-lab/core/transpiler/transpiler-core" {
    function transpilerCore(yourCode: string): string;
    export default transpilerCore;
}

declare module "hedgehog-lab/core/output/output-item" {
    class OutputItem {
        outputType: "print" | "draw" | "text" | "formulaTex" | "markdown";
        text?: string | {
            mode: string,
            digits: number,
            val: any,
            rows: number,
            cols: number
        };
        data?: any[];
        layout?: any;
        isPrint(): boolean;
        isDraw(): boolean;
        isTex(): boolean;
        isFormulaTex(): boolean;
        isMarkdown(): boolean;
    }

    export default OutputItem;
}

declare module "hedgehog-lab/core/runtime" {
    export function executeOutput(yourCode: string): import("hedgehog-lab/core/output/output-item").default[];
}
