import transpilerCore from "hedgehog-lab/core/transpiler/transpiler-core";
import { ICompilationResult } from "./compilationResult";
import { OperationCancelledError } from "../utility/errors";

/** a proxy-friendly asynchronous compiler instance. */
export class CompilerInstance {
    // eslint-disable-next-line class-methods-use-this
    public compile(code: string, signal?: AbortSignal): ICompilationResult {
        if (signal?.aborted) {
            throw new OperationCancelledError();
        }
        const compiledCode = transpilerCore(code);
        return { compiledCode };
    }
}
