import * as Comlink from "comlink";
import { ExecutionSandbox } from "./executionSandbox";

// eslint-disable-next-line no-restricted-globals
// const workerContext = global.self as unknown as Worker;

const executor = new ExecutionSandbox();
Comlink.expose(executor);

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
const WebpackWorker: { new(): Worker } = undefined!;
type WebpackWorker = Worker;

export default WebpackWorker;
