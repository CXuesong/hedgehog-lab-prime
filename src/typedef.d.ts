/**
 * Make scss files consumable for TypeScript.
 */
declare module "*.scss" {
    const classNames: Record<string, string>;
    export default classNames;
}
