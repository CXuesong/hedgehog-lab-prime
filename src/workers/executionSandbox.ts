import type { OutputItem } from "hedgehog-lab/packages/hedgehog-core/src/output/output-item";
import { executeOutput } from "hedgehog-lab/packages/hedgehog-core/src/runtime";
import { OperationCancelledError } from "../utility/errors";
import { ICompilationResult } from "./compilationResult";

/** a proxy-friendly asynchronous compiler instance. */
export class ExecutionSandbox {
    // eslint-disable-next-line class-methods-use-this
    public execute(compiled: ICompilationResult, signal?: AbortSignal): OutputItem[] {
        if (signal?.aborted) {
            throw new OperationCancelledError();
        }
        const result = executeOutput(compiled.compiledCode);
        return result;
    }
}
