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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_extra_1 = __importDefault(require("fs-extra"));
//import PACKAGE_JSON = require('./package.json');
const sort_package_json_1 = require("sort-package-json");
const pkg_up_1 = __importDefault(require("pkg-up"));
const bind_decorator_1 = __importDefault(require("bind-decorator"));
const util_1 = require("./util");
const path_1 = __importDefault(require("path"));
class PackageJsonLoader {
    constructor(fileOrJson, ...argv) {
        this._use = [];
        if (typeof fileOrJson === 'string') {
            this.setFilename(fileOrJson);
        }
        else if (Buffer.isBuffer(fileOrJson)) {
            this.setJson(JSON.parse(fileOrJson.toString()));
        }
        else if (typeof fileOrJson === 'object') {
            this.setJson(JSON.parse(fileOrJson.toString()));
        }
        else if (fileOrJson != null) {
            throw new TypeError(`fileOrJson is not valid`);
        }
    }
    static create(file, ...argv) {
        return new this(file, ...argv);
    }
    static createByJson(json, ...argv) {
        return new this(json, ...argv);
    }
    static findPackageJsonPath(name) {
        return pkg_up_1.default.sync({
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
    use(ls) {
        if (Array.isArray(ls)) {
            this._use.push(...ls);
        }
        else {
            this._use.push(ls);
        }
    }
    setFilename(file) {
        // @ts-ignore
        this.file = file;
        return this;
    }
    setJson(json) {
        this.loaded = true;
        this.json = json;
        return this;
    }
    read(reload) {
        if (!this.loaded || reload) {
            this.json = fs_extra_1.default.readJSONSync(this.file);
        }
        this.loaded = true;
        return this;
    }
    get dir() {
        return path_1.default.dirname(this.file);
    }
    /**
     * skip typescript type check
     */
    get unsafeTypeData() {
        return this.data;
    }
    /**
     * skip typescript type check
     */
    set unsafeTypeData(json) {
        this.data = json;
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
        if (self.file && fs_extra_1.default.existsSync(dir = self.dir)) {
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
    run(options = {}) {
        if (options.autofix == null || options.autofix) {
            this.autofix();
        }
        this._use.forEach(fn => fn.call(this, this.data));
        return this;
    }
    exists() {
        return fs_extra_1.default.existsSync(this.file);
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
        fs_extra_1.default.writeFileSync(this.file, this.stringify());
        return this;
    }
    writeOnlyWhenLoaded() {
        if (this.loaded) {
            this.write();
        }
        return this.loaded;
    }
}
__decorate([
    bind_decorator_1.default,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], PackageJsonLoader, "create", null);
__decorate([
    bind_decorator_1.default,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], PackageJsonLoader, "loadByModuleName", null);
exports.PackageJsonLoader = PackageJsonLoader;
exports.default = PackageJsonLoader;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7OztBQUFBLHdEQUEwQjtBQUMxQixrREFBa0Q7QUFDbEQseURBQW9EO0FBQ3BELG9EQUEyQjtBQUMzQixvRUFBa0M7QUFDbEMsaUNBQW9DO0FBQ3BDLGdEQUF3QjtBQWF4QixNQUFhLGlCQUFpQjtJQXlDN0IsWUFBWSxVQUF1QixFQUFFLEdBQUcsSUFBSTtRQW5DbEMsU0FBSSxHQUE0QyxFQUFFLENBQUM7UUFxQzVELElBQUksT0FBTyxVQUFVLEtBQUssUUFBUSxFQUNsQztZQUNDLElBQUksQ0FBQyxXQUFXLENBQUMsVUFBVSxDQUFDLENBQUE7U0FDNUI7YUFDSSxJQUFJLE1BQU0sQ0FBQyxRQUFRLENBQUMsVUFBVSxDQUFDLEVBQ3BDO1lBQ0MsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLFVBQVUsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxDQUFDLENBQUE7U0FDL0M7YUFDSSxJQUFJLE9BQU8sVUFBVSxLQUFLLFFBQVEsRUFDdkM7WUFDQyxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsVUFBVSxDQUFDLFFBQVEsRUFBRSxDQUFDLENBQUMsQ0FBQTtTQUMvQzthQUNJLElBQUksVUFBVSxJQUFJLElBQUksRUFDM0I7WUFDQyxNQUFNLElBQUksU0FBUyxDQUFDLHlCQUF5QixDQUFDLENBQUE7U0FDOUM7SUFDRixDQUFDO0lBbERELE1BQU0sQ0FBQyxNQUFNLENBQW1CLElBQWlCLEVBQUUsR0FBRyxJQUFJO1FBRXpELE9BQU8sSUFBSSxJQUFJLENBQUksSUFBSSxFQUFFLEdBQUcsSUFBSSxDQUFDLENBQUE7SUFDbEMsQ0FBQztJQUVELE1BQU0sQ0FBQyxZQUFZLENBQW1CLElBQU8sRUFBRSxHQUFHLElBQUk7UUFFckQsT0FBTyxJQUFJLElBQUksQ0FBSSxJQUFJLEVBQUUs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RUFDZDtZQUNDLE1BQU0sSUFBSSxLQUFLLENBQUMsbUJBQW1CLENBQUMsQ0FBQTtTQUNwQztRQUVELGtCQUFFLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLFNBQVMsRUFBRSxDQUFDLENBQUM7UUFFOUMsT0FBTyxJQUFJLENBQUM7SUFDYixDQUFDO0lBRUQsbUJBQW1CO1FBRWxCLElBQUksSUFBSSxDQUFDLE1BQU0sRUFDZjtZQUNDLElBQUksQ0FBQyxLQUFLLEVBQUUsQ0FBQztTQUNiO1FBRUQsT0FBTyxJQUFJLENBQUMsTUFBTSxDQUFDO0lBQ3BCLENBQUM7Q0FDRDtBQXRQQTtJQURDLHdCQUFJOzs7O3FDQUlKO0FBZUQ7SUFEQyx3QkFBSTs7OzsrQ0FhSjtBQXZDRiw4Q0ErUEM7QUFPRCxrQkFBZSxpQkFBaUIsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBmcyBmcm9tICdmcy1leHRyYSc7XG4vL2ltcG9ydCBQQUNLQUdFX0pTT04gPSByZXF1aXJlKCcuL3BhY2thZ2UuanNvbicpO1xuaW1wb3J0IHsgc29ydFBhY2thZ2VKc29uIH0gZnJvbSAnc29ydC1wYWNrYWdlLWpzb24nO1xuaW1wb3J0IHBrZ1VwIGZyb20gJ3BrZy11cCc7XG5pbXBvcnQgYmluZCBmcm9tICdiaW5kLWRlY29yYXRvcic7XG5pbXBvcnQgeyBmaXhCaW5QYXRoIH0gZnJvbSAnLi91dGlsJztcbmltcG9ydCBwYXRoIGZyb20gJ3BhdGgnO1xuaW1wb3J0IHsgSVBhY2thZ2VKc29uIH0gZnJvbSAnQHRzLXR5cGUvcGFja2FnZS1kdHMnO1xuaW1wb3J0ICogYXMgVHNUeXBlUGFja2FnZUR0cyBmcm9tICdAdHMtdHlwZS9wYWNrYWdlLWR0cyc7XG5pbXBvcnQgeyBPbmNlIH0gZnJvbSAnbG9kYXNoLWRlY29yYXRvcnMvb25jZSc7XG5cbmV4cG9ydCB7IElQYWNrYWdlSnNvbiB9XG5cbnR5cGUgSUZpbGVPckpzb24gPSBCdWZmZXIgfCBzdHJpbmcgfCBvYmplY3QgfCBJUGFja2FnZUpzb25cblxudHlwZSBJUGFja2FnZUpzb25MaWtlPFQ+ID0gUGFydGlhbDxUPiB8IFJlY29yZDxzdHJpbmcsIGFueT47XG5cbnR5cGUgSUl0ZW1Pckl0ZW1BcnJheTxUPiA9IFQgfCBUW107XG5cbmV4cG9ydCBjbGFzcyBQYWNrYWdlSnNvbkxvYWRlcjxUIGV4dGVuZHMgSVBhY2thZ2VKc29uTGlrZTxJUGFja2FnZUpzb24+ID0gSVBhY2thZ2VKc29uPlxue1xuXHRyZWFkb25seSBmaWxlOiBzdHJpbmc7XG5cdHByb3RlY3RlZCBqc29uOiBUO1xuXHRsb2FkZWQ6IGJvb2xlYW47XG5cblx0cHJvdGVjdGVkIF91c2U6ICgoanNvbjogSVBhY2thZ2VKc29uTGlrZTxUPikgPT4gdm9pZClbXSA9IFtdO1xuXG5cdEBiaW5kXG5cdHN0YXRpYyBjcmVhdGU8VCA9IElQYWNrYWdlSnNvbj4oZmlsZTogSUZpbGVPckpzb24sIC4uLmFyZ3YpXG5cdHtcblx0XHRyZXR1cm4gbmV3IHRoaXM8VD4oZmlsZSwgLi4uYXJndilcblx0fVxuXG5cdHN0YXRpYyBjcmVhdGVCeUpzb248VCA9IElQYWNrYWdlSnNvbj4oanNvbjogVCwgLi4uYXJndilcblx0e1xuXHRcdHJldHVybiBuZXcgdGhpczxUPihqc29uLCAuLi5hcmd2KVxuXHR9XG5cblx0c3RhdGljIGZpbmRQYWNrYWdlSnNvblBhdGgobmFtZTogc3RyaW5nKTogc3RyaW5nXG5cdHtcblx0XHRyZXR1cm4gcGtnVXAuc3luYyh7XG5cdFx0XHRjd2Q6IHJlcXVpcmUucmVzb2x2ZShuYW1lKSxcblx0XHR9KTtcblx0fVxuXG5cdEBiaW5kXG5cdHN0YXRpYyBsb2FkQnlNb2R1bGVOYW1lPFQgPSBJUGFja2FnZUpzb24+KG5hbWU6IHN0cmluZylcblx0e1xuXHRcdGxldCBmaWxlID0gdGhpcy5maW5kUGFja2FnZUpzb25QYXRoKG5hbWUpO1xuXG5cdFx0bGV0IHBrZyA9IHRoaXMuY3JlYXRlPFQ+KGZpbGUpO1xuXG5cdFx0aWYgKChwa2cuZGF0YSBhcyBhbnkpLm5hbWUgIT09IG5hbWUpXG5cdFx0e1xuXHRcdFx0dGhyb3cgbmV3IFR5cGVFcnJvcihgcGFja2FnZSBuYW1lIG5vdCBtYXRjaCwgJyR7KHBrZy5kYXRhIGFzIGFueSkubmFtZX0nICE9ICcke25hbWV9J2ApO1xuXHRcdH1cblxuXHRcdHJldHVybiBwa2c7XG5cdH1cblxuXHRjb25zdHJ1Y3RvcihmaWxlT3JKc29uOiBJRmlsZU9ySnNvbiwgLi4uYXJndilcblx0e1xuXHRcdGlmICh0eXBlb2YgZmlsZU9ySnNvbiA9PT0gJ3N0cmluZycpXG5cdFx0e1xuXHRcdFx0dGhpcy5zZXRGaWxlbmFtZShmaWxlT3JKc29uKVxuXHRcdH1cblx0XHRlbHNlIGlmIChCdWZmZXIuaXNCdWZmZXIoZmlsZU9ySnNvbikpXG5cdFx0e1xuXHRcdFx0dGhpcy5zZXRKc29uKEpTT04ucGFyc2UoZmlsZU9ySnNvbi50b1N0cmluZygpKSlcblx0XHR9XG5cdFx0ZWxzZSBpZiAodHlwZW9mIGZpbGVPckpzb24gPT09ICdvYmplY3QnKVxuXHRcdHtcblx0XHRcdHRoaXMuc2V0SnNvbihKU09OLnBhcnNlKGZpbGVPckpzb24udG9TdHJpbmcoKSkpXG5cdFx0fVxuXHRcdGVsc2UgaWYgKGZpbGVPckpzb24gIT0gbnVsbClcblx0XHR7XG5cdFx0XHR0aHJvdyBuZXcgVHlwZUVycm9yKGBmaWxlT3JKc29uIGlzIG5vdCB2YWxpZGApXG5cdFx0fVxuXHR9XG5cblx0dXNlKGxzOiBJSXRlbU9ySXRlbUFycmF5PChqc29uOiBJUGFja2FnZUpzb25MaWtlPFQ+KSA9PiB2b2lkPilcblx0e1xuXHRcdGlmIChBcnJheS5pc0FycmF5KGxzKSlcblx0XHR7XG5cdFx0XHR0aGlzLl91c2UucHVzaCguLi5scyk7XG5cdFx0fVxuXHRcdGVsc2Vcblx0XHR7XG5cdFx0XHR0aGlzLl91c2UucHVzaChscyk7XG5cdFx0fVxuXHR9XG5cblx0c2V0RmlsZW5hbWUoZmlsZTogc3RyaW5nKVxuXHR7XG5cdFx0Ly8gQHRzLWlnbm9yZVxuXHRcdHRoaXMuZmlsZSA9IGZpbGU7XG5cblx0XHRyZXR1cm4gdGhpcztcblx0fVxuXG5cdHNldEpzb24oanNvbjogb2JqZWN0IHwgVClcblx0e1xuXHRcdHRoaXMubG9hZGVkID0gdHJ1ZTtcblx0XHR0aGlzLmpzb24gPSBqc29uIGFzIFQ7XG5cblx0XHRyZXR1cm4gdGhpcztcblx0fVxuXG5cdHJlYWQocmVsb2FkPzogYm9vbGVhbilcblx0e1xuXHRcdGlmICghdGhpcy5sb2FkZWQgfHwgcmVsb2FkKVxuXHRcdHtcblx0XHRcdHRoaXMuanNvbiA9IGZzLnJlYWRKU09OU3luYyh0aGlzLmZpbGUpO1xuXHRcdH1cblxuXHRcdHRoaXMubG9hZGVkID0gdHJ1ZTtcblxuXHRcdHJldHVybiB0aGlzO1xuXHR9XG5cblx0Z2V0IGRpcigpXG5cdHtcblx0XHRyZXR1cm4gcGF0aC5kaXJuYW1lKHRoaXMuZmlsZSlcblx0fVxuXG5cdC8qKlxuXHQgKiBza2lwIHR5cGVzY3JpcHQgdHlwZSBjaGVja1xuXHQgKi9cblx0Z2V0IHVuc2FmZVR5cGVEYXRhKCk6IElQYWNrYWdlSnNvbkxpa2U8VD5cblx0e1xuXHRcdHJldHVybiB0aGlzLmRhdGEgYXMgYW55O1xuXHR9XG5cblx0LyoqXG5cdCAqIHNraXAgdHlwZXNjcmlwdCB0eXBlIGNoZWNrXG5cdCAqL1xuXHRzZXQgdW5zYWZlVHlwZURhdGEoanNvbilcblx0e1xuXHRcdHRoaXMuZGF0YSA9IGpzb24gYXMgYW55O1xuXHR9XG5cblx0c2V0IGRhdGEoanNvbjogVClcblx0e1xuXHRcdHRoaXMub3ZlcndyaXRlKGpzb24pO1xuXHR9XG5cblx0Z2V0IGRhdGEoKTogVFxuXHR7XG5cdFx0aWYgKCF0aGlzLmxvYWRlZCAmJiB0aGlzLmZpbGUpXG5cdFx0e1xuXHRcdFx0dGhpcy5yZWFkKCk7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIHRoaXMuanNvbjtcblx0fVxuXG5cdG92ZXJ3cml0ZShqc29uOiBvYmplY3QgfCBUKVxuXHR7XG5cdFx0dGhpcy5sb2FkZWQgPSB0cnVlO1xuXHRcdHRoaXMuanNvbiA9IGpzb24gYXMgVDtcblxuXHRcdHJldHVybiB0aGlzO1xuXHR9XG5cblx0YXV0b2ZpeCgpXG5cdHtcblx0XHRsZXQgc2VsZiA9IHRoaXM7XG5cdFx0bGV0IGRpcjogc3RyaW5nO1xuXG5cdFx0aWYgKHNlbGYuZmlsZSAmJiBmcy5leGlzdHNTeW5jKGRpciA9IHNlbGYuZGlyKSlcblx0XHR7XG5cdFx0XHRpZiAoc2VsZi5kYXRhKVxuXHRcdFx0e1xuXHRcdFx0XHRpZiAoc2VsZi5kYXRhLmJpbilcblx0XHRcdFx0e1xuXHRcdFx0XHRcdGlmICh0eXBlb2Ygc2VsZi5kYXRhLmJpbiA9PT0gJ3N0cmluZycpXG5cdFx0XHRcdFx0e1xuXHRcdFx0XHRcdFx0bGV0IGJpbl9uZXcgPSBmaXhCaW5QYXRoKHNlbGYuZGF0YS5iaW4sIGRpcik7XG5cblx0XHRcdFx0XHRcdGlmIChiaW5fbmV3KVxuXHRcdFx0XHRcdFx0e1xuXHRcdFx0XHRcdFx0XHRzZWxmLmRhdGEuYmluID0gYmluX25ldztcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0ZWxzZSBpZiAodHlwZW9mIHNlbGYuZGF0YS5iaW4gPT09ICdvYmplY3QnICYmICFBcnJheS5pc0FycmF5KHNlbGYuZGF0YS5iaW4pKVxuXHRcdFx0XHRcdHtcblx0XHRcdFx0XHRcdE9iamVjdC5rZXlzKHNlbGYuZGF0YS5iaW4pXG5cdFx0XHRcdFx0XHRcdC5mb3JFYWNoKGZ1bmN0aW9uIChrZXkpXG5cdFx0XHRcdFx0XHRcdHtcblx0XHRcdFx0XHRcdFx0XHRpZiAodHlwZW9mIHNlbGYuZGF0YS5iaW5ba2V5XSA9PT0gJ3N0cmluZycpXG5cdFx0XHRcdFx0XHRcdFx0e1xuXHRcdFx0XHRcdFx0XHRcdFx0bGV0IGJpbl9uZXcgPSBmaXhCaW5QYXRoKHNlbGYuZGF0YS5iaW5ba2V5XSwgZGlyKTtcblxuXHRcdFx0XHRcdFx0XHRcdFx0aWYgKGJpbl9uZXcpXG5cdFx0XHRcdFx0XHRcdFx0XHR7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdHNlbGYuZGF0YS5iaW5ba2V5XSA9IGJpbl9uZXc7XG5cdFx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHR9KVxuXHRcdFx0XHRcdFx0O1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXG5cdFx0XHRcdGlmICghc2VsZi5kYXRhLnB1Ymxpc2hDb25maWdcblx0XHRcdFx0XHQmJiBzZWxmLmRhdGEubmFtZVxuXHRcdFx0XHRcdCYmIC9cXC8vLnRlc3Qoc2VsZi5kYXRhLm5hbWUpXG5cdFx0XHRcdFx0JiYgIXNlbGYuZGF0YS5wcml2YXRlXG5cdFx0XHRcdClcblx0XHRcdFx0e1xuXHRcdFx0XHRcdHNlbGYuZGF0YS5wdWJsaXNoQ29uZmlnID0ge1xuXHRcdFx0XHRcdFx0YWNjZXNzOiBcInB1YmxpY1wiLFxuXHRcdFx0XHRcdH07XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9XG5cdH1cblxuXHRydW4ob3B0aW9uczoge1xuXHRcdGF1dG9maXg/OiBib29sZWFuXG5cdH0gPSB7fSlcblx0e1xuXHRcdGlmIChvcHRpb25zLmF1dG9maXggPT0gbnVsbCB8fCBvcHRpb25zLmF1dG9maXgpXG5cdFx0e1xuXHRcdFx0dGhpcy5hdXRvZml4KCk7XG5cdFx0fVxuXG5cdFx0dGhpcy5fdXNlLmZvckVhY2goZm4gPT4gZm4uY2FsbCh0aGlzLCB0aGlzLmRhdGEpKTtcblxuXHRcdHJldHVybiB0aGlzO1xuXHR9XG5cblx0ZXhpc3RzKClcblx0e1xuXHRcdHJldHVybiBmcy5leGlzdHNTeW5jKHRoaXMuZmlsZSlcblx0fVxuXG5cdHN0cmluZ2lmeSgpXG5cdHtcblx0XHRyZXR1cm4gSlNPTi5zdHJpbmdpZnkodGhpcy5qc29uLCBudWxsLCAyKVxuXHR9XG5cblx0c29ydCgpXG5cdHtcblx0XHRpZiAodHlwZW9mIHRoaXMuZGF0YSA9PT0gJ3VuZGVmaW5lZCcgfHwgdGhpcy5kYXRhID09PSBudWxsKVxuXHRcdHtcblx0XHRcdHRocm93IG5ldyBFcnJvcihgZGF0YSBpcyB1bmRlZmluZWRgKVxuXHRcdH1cblxuXHRcdHRoaXMuZGF0YSA9IHNvcnRQYWNrYWdlSnNvbih0aGlzLmRhdGEpO1xuXG5cdFx0cmV0dXJuIHRoaXM7XG5cdH1cblxuXHR3cml0ZSgpXG5cdHtcblx0XHRpZiAoIXRoaXMuZmlsZSlcblx0XHR7XG5cdFx0XHR0aHJvdyBuZXcgRXJyb3IoYGZpbGUgaXMgdW5kZWZpbmVkYClcblx0XHR9XG5cblx0XHRmcy53cml0ZUZpbGVTeW5jKHRoaXMuZmlsZSwgdGhpcy5zdHJpbmdpZnkoKSk7XG5cblx0XHRyZXR1cm4gdGhpcztcblx0fVxuXG5cdHdyaXRlT25seVdoZW5Mb2FkZWQoKVxuXHR7XG5cdFx0aWYgKHRoaXMubG9hZGVkKVxuXHRcdHtcblx0XHRcdHRoaXMud3JpdGUoKTtcblx0XHR9XG5cblx0XHRyZXR1cm4gdGhpcy5sb2FkZWQ7XG5cdH1cbn1cblxuZXhwb3J0IGRlY2xhcmUgbW9kdWxlIFBhY2thZ2VKc29uTG9hZGVyXG57XG5cdGV4cG9ydCB0eXBlIElQYWNrYWdlSnNvbiA9IFRzVHlwZVBhY2thZ2VEdHMuSVBhY2thZ2VKc29uO1xufVxuXG5leHBvcnQgZGVmYXVsdCBQYWNrYWdlSnNvbkxvYWRlclxuIl19