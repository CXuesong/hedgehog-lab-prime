/* eslint-disable class-methods-use-this */
import transpilerCore from "hedgehog-lab/core/transpiler/transpiler-core";
import { IWorkerPing } from "./common";
import { ICompilationResult } from "./compilationResult";

/** a proxy-friendly asynchronous compiler instance. */
export class CompilerInstance implements IWorkerPing {
    public ping(data: number): number {
        return data;
    }

    public compile(code: string): ICompilationResult {
        const compiledCode = transpilerCore(code);
        return { compiledCode };
    }
}
