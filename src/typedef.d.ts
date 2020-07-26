/**
 * Make scss files consumable for TypeScript.
 */
declare module "*.scss" {
    const classNames: Record<string, string>;
    export default classNames;
}

// declare module "worker-loader!*" {
//     class WebpackWorker extends Worker {
//         public constructor();
//     }

//     export default WebpackWorker;
// }
