import PACKAGE_JSON = require('./package.json');
export declare class PackageJsonLoader<T = IPackageJson> {
    readonly file: string;
    protected json: any;
    loaded: boolean;
    static create<T = IPackageJson>(file: string, ...argv: any[]): import("./index.js").PackageJsonLoader<T>;
    static findPackageJsonPath(name: string): string;
    static loadByModuleName<T = IPackageJson>(name: string): import("./index.js").PackageJsonLoader<T>;
    constructor(file: string, ...argv: any[]);
    readonly dir: string;
    data: IPackageJson;
    overwrite(json: any): this;
    autofix(): void;
    exists(): boolean;
    read(): this;
    stringify(): string;
    sort(): this;
    write(): this;
    writeWhenLoaded(): boolean;
}
export import IPackageJson = PackageJsonLoader.IPackageJson;
export declare module PackageJsonLoader {
    export type IPackageJson = typeof PACKAGE_JSON & {
        scripts: {
            [k: string]: string;
        };
        bin: string | {
            [k: string]: string;
        };
        directories: {
            [k: string]: string;
        };
        dependencies: {
            [k: string]: string;
        };
        resolutions: {
            [k: string]: string;
        };
        workspaces: any;
    };
    export { PackageJsonLoader };
    export { PackageJsonLoader as default };
}
export default PackageJsonLoader;
export = PackageJsonLoader;
