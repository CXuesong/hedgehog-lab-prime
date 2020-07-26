export class OperationCancelledError extends Error {
    public constructor(message?: string) {
        super(message ?? "Operation has been cancelled.");
    }
}
