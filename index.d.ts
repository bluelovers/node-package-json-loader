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
export declare module PackageJsonLoader {
    export type IPackageJson = ITSOverwrite<typeof PACKAGE_JSON, {
        scripts?: {
            prepublishOnly?: string;
            test?: string;
            coverage?: string;
            serve?: string;
            build?: string;
            dev?: string;
            [k: string]: string;
        };
        bin?: string | {
            [k: string]: string;
        };
        directories?: {
            test?: string;
            bin?: string;
            [k: string]: string;
        };
        dependencies?: {
            [k: string]: string;
        };
        devDependencies?: {
            [k: string]: string;
        };
        resolutions?: {
            [k: string]: string;
        };
        workspaces?: any;
    }>;
    export { PackageJsonLoader };
    export { PackageJsonLoader as default };
}
export import IPackageJson = PackageJsonLoader.IPackageJson;
import { ITSOverwrite } from 'ts-type';
export default PackageJsonLoader;
export = PackageJsonLoader;
