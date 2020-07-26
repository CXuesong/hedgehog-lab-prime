import { ICancellationToken } from "tasklike-promise-library";
import { OperationCancelledError } from "../utility/errors";

export interface IWorkerPing {
    ping(payload: number): number;
}

export interface IAsyncWorkerPing {
    ping(payload: number): PromiseLike<number>;
}

export async function pingWorker(worker: IAsyncWorkerPing, cancellationToken?: ICancellationToken): Promise<void> {
    const payload = Math.floor(Math.random() * 1000000);
    const pingPromise = worker.ping(payload);
    let response: number | void | undefined;
    if (cancellationToken) {
        response = await Promise.race([pingPromise, cancellationToken.promiseLike]);
        if (cancellationToken.isCancellationRequested) {
            throw new OperationCancelledError("Cancelled waiting for worker to respond.");
        }
    } else {
        response = await pingPromise;
    }
    if (response !== payload) {
        throw new Error("Worker state is corrupted.");
    }
}
