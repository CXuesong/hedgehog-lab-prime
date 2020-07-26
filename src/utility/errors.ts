export class OperationCancelledError extends Error {
    public name = "OperationCancelledError";

    public constructor(message?: string) {
        super(message ?? "Operation has been cancelled.");
    }
}
