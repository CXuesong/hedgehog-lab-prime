/* eslint-disable class-methods-use-this */
import type { OutputItem } from "hedgehog-lab/packages/hedgehog-core/src/output/output-item";
import { executeOutput } from "hedgehog-lab/packages/hedgehog-core/src/runtime";
import { IWorkerPing } from "./common";
import { ICompilationResult } from "./compilationResult";

/** a proxy-friendly asynchronous compiler instance. */
export class ExecutionSandbox implements IWorkerPing {
    public ping(data: number): number {
        return data;
    }

    public execute(compiled: ICompilationResult): OutputItem[] {
        const result = executeOutput(compiled.compiledCode);
        return result;
    }
}
