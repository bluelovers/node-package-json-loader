import fs = require('fs-extra');
import PACKAGE_JSON = require('./package.json');
import { sortPackageJson } from 'sort-package-json';
import pkgUp = require('pkg-up');
import bind from 'bind-decorator';
import { fixBinPath } from './util';
import path = require('path');

export class PackageJsonLoader<T = IPackageJson>
{
	readonly file: string;
	protected json;
	loaded: boolean;

	@bind
	static create<T = IPackageJson>(file: string, ...argv)
	{
		return new this<T>(file, ...argv)
	}

	static findPackageJsonPath(name: string): string
	{
		return pkgUp.sync({
			cwd: require.resolve(name),
		});
	}

	@bind
	static loadByModuleName<T = IPackageJson>(name: string)
	{
		let file = this.findPackageJsonPath(name)

		let pkg = this.create<T>(file);

		if (pkg.data.name !== name)
		{
			throw new TypeError(`package name not match, '${pkg.data.name}' != '${name}'`);
		}

		return pkg;
	}

	constructor(file: string, ...argv)
	{
		this.file = file;
	}

	get dir()
	{
		return path.dirname(this.file)
	}

	set data(json)
	{
		this.overwrite(json);
	}

	get data(): IPackageJson
	{
		if (!this.loaded && this.file)
		{
			this.read();
		}

		return this.json;
	}

	overwrite(json)
	{
		this.loaded = true;
		this.json = json;

		return this;
	}

	autofix()
	{
		let self = this;
		let dir: string;

		if (self.file && fs.existsSync(dir = self.dir))
		{
			if (self.data)
			{
				if (self.data.bin)
				{
					if (typeof self.data.bin === 'string')
					{
						let bin_new = fixBinPath(self.data.bin, dir);

						if (bin_new)
						{
							self.data.bin = bin_new;
						}
					}
					else if (typeof self.data.bin === 'object' && !Array.isArray(self.data.bin))
					{
						Object.keys(self.data.bin)
							.forEach(function (key)
							{
								if (typeof self.data.bin[key] === 'string')
								{
									let bin_new = fixBinPath(self.data.bin[key], dir);

									if (bin_new)
									{
										self.data.bin[key] = bin_new;
									}
								}
							})
						;
					}
				}

				if (!self.data.publishConfig
					&& self.data.name
					&& /\//.test(self.data.name)
					&& !self.data.private
				)
				{
					self.data.publishConfig = {
						access: "public",
					};
				}
			}
		}
	}

	exists()
	{
		return fs.existsSync(this.file)
	}

	read()
	{
		this.loaded = true;
		this.json = fs.readJSONSync(this.file);

		return this;
	}

	stringify()
	{
		return JSON.stringify(this.json, null, 2)
	}

	sort()
	{
		if (typeof this.data === 'undefined' || this.data === null)
		{
			throw new Error(`data is undefined`)
		}

		this.data = sortPackageJson(this.data);

		return this;
	}

	write()
	{
		if (!this.file)
		{
			throw new Error(`file is undefined`)
		}

		fs.writeJSONSync(this.file, this.json, {
			spaces: 2,
		});

		return this;
	}

	writeWhenLoaded()
	{
		if (this.loaded)
		{
			this.write();
		}

		return this.loaded;
	}
}

export declare module PackageJsonLoader
{


	export type IPackageJson = ITSOverwrite<typeof PACKAGE_JSON, {
		scripts?: {
			prepublishOnly?: string,
			test?: string,
			coverage?: string,
			serve?: string,
			build?: string,
			dev?: string,
			[k: string]: string,
		},
		bin?: string | {
			[k: string]: string,
		},
		directories?: {
			test?: string,
			bin?: string,
			[k: string]: string,
		},
		dependencies?: {
			[k: string]: string,
		},
		devDependencies?: {
			[k: string]: string,
		},
		resolutions?: {
			[k: string]: string,
		},
		workspaces?: any,
	}>;

	// @ts-ignore
	export { PackageJsonLoader }
	// @ts-ignore
	export { PackageJsonLoader as default }
}

// @ts-ignore
export import IPackageJson = PackageJsonLoader.IPackageJson;
import { ITSOverwrite } from 'ts-type';

// @ts-ignore
export default PackageJsonLoader

// @ts-ignore
Object.assign(PackageJsonLoader, exports, {
	default: PackageJsonLoader,
	PackageJsonLoader,
});

// @ts-ignore
Object.defineProperty(PackageJsonLoader, "__esModule", { value: true });

// @ts-ignore
export = PackageJsonLoader
