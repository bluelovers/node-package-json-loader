import { IPackageJson } from '@ts-type/package-dts';
import TsTypePackageDts = require('@ts-type/package-dts');
export { IPackageJson };
export declare class PackageJsonLoader<T = IPackageJson> {
    readonly file: string;
    protected json: any;
    loaded: boolean;
    static create<T = IPackageJson>(file: string, ...argv: any[]): import(".").PackageJsonLoader<T>;
    static findPackageJsonPath(name: string): string;
    static loadByModuleName<T = IPackageJson>(name: string): import(".").PackageJsonLoader<T>;
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
    export type IPackageJson = TsTypePackageDts.IPackageJson;
    export { PackageJsonLoader };
    export { PackageJsonLoader as default };
}
export default PackageJsonLoader;
export = PackageJsonLoader;
