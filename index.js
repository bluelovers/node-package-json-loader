"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
const fs = require("fs-extra");
const sort_package_json_1 = require("sort-package-json");
const pkgUp = require("pkg-up");
const bind_decorator_1 = require("bind-decorator");
const util_1 = require("./util");
const path = require("path");
class PackageJsonLoader {
    constructor(file, ...argv) {
        this.file = file;
    }
    static create(file, ...argv) {
        return new this(file, ...argv);
    }
    static findPackageJsonPath(name) {
        return pkgUp.sync({
            cwd: require.resolve(name),
        });
    }
    static loadByModuleName(name) {
        let file = this.findPackageJsonPath(name);
        let pkg = this.create(file);
        if (pkg.data.name !== name) {
            throw new TypeError(`package name not match, '${pkg.data.name}' != '${name}'`);
        }
        return pkg;
    }
    get dir() {
        return path.dirname(this.file);
    }
    set data(json) {
        this.overwrite(json);
    }
    get data() {
        if (!this.loaded && this.file) {
            this.read();
        }
        return this.json;
    }
    overwrite(json) {
        this.loaded = true;
        this.json = json;
        return this;
    }
    autofix() {
        let self = this;
        let dir;
        if (self.file && fs.existsSync(dir = self.dir)) {
            if (self.data) {
                if (self.data.bin) {
                    if (typeof self.data.bin === 'string') {
                        let bin_new = util_1.fixBinPath(self.data.bin, dir);
                        if (bin_new) {
                            self.data.bin = bin_new;
                        }
                    }
                    else if (typeof self.data.bin === 'object' && !Array.isArray(self.data.bin)) {
                        Object.keys(self.data.bin)
                            .forEach(function (key) {
                            if (typeof self.data.bin[key] === 'string') {
                                let bin_new = util_1.fixBinPath(self.data.bin[key], dir);
                                if (bin_new) {
                                    self.data.bin[key] = bin_new;
                                }
                            }
                        });
                    }
                }
                if (!self.data.publishConfig
                    && self.data.name
                    && /\//.test(self.data.name)
                    && !self.data.private) {
                    self.data.publishConfig = {
                        access: "public",
                    };
                }
            }
        }
    }
    exists() {
        return fs.existsSync(this.file);
    }
    read() {
        this.loaded = true;
        this.json = fs.readJSONSync(this.file);
        return this;
    }
    stringify() {
        return JSON.stringify(this.json, null, 2);
    }
    sort() {
        if (typeof this.data === 'undefined' || this.data === null) {
            throw new Error(`data is undefined`);
        }
        this.data = sort_package_json_1.sortPackageJson(this.data);
        return this;
    }
    write() {
        if (!this.file) {
            throw new Error(`file is undefined`);
        }
        fs.writeJSONSync(this.file, this.json, {
            spaces: 2,
        });
        return this;
    }
    writeWhenLoaded() {
        if (this.loaded) {
            this.write();
        }
        return this.loaded;
    }
}
__decorate([
    bind_decorator_1.default,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], PackageJsonLoader, "create", null);
__decorate([
    bind_decorator_1.default,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], PackageJsonLoader, "loadByModuleName", null);
// @ts-ignore
exports.default = PackageJsonLoader;
// @ts-ignore
Object.assign(PackageJsonLoader, exports, {
    default: PackageJsonLoader,
    PackageJsonLoader,
});
// @ts-ignore
Object.defineProperty(PackageJsonLoader, "__esModule", { value: true });
module.exports = PackageJsonLoader;
//# sourceMappingURL=index.js.map