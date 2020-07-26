import * as Comlink from "comlink";
import { CompilerInstance } from "./compilerInstance";

// eslint-disable-next-line no-restricted-globals
// const workerContext = global.self as unknown as Worker;

const compiler = new CompilerInstance();
Comlink.expose(compiler);

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
const WebpackWorker: { new(): Worker } = undefined!;
type WebpackWorker = Worker;

export default WebpackWorker;
