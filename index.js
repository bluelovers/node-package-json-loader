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
//import PACKAGE_JSON = require('./package.json');
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQUEsK0JBQWdDO0FBQ2hDLGtEQUFrRDtBQUNsRCx5REFBb0Q7QUFDcEQsZ0NBQWlDO0FBQ2pDLG1EQUFrQztBQUNsQyxpQ0FBb0M7QUFDcEMsNkJBQThCO0FBTTlCLE1BQWEsaUJBQWlCO0lBa0M3QixZQUFZLElBQVksRUFBRSxHQUFHLElBQUk7UUFFaEMsSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUM7SUFDbEIsQ0FBQztJQTlCRCxNQUFNLENBQUMsTUFBTSxDQUFtQixJQUFZLEVBQUUsR0FBRyxJQUFJO1FBRXBELE9BQU8sSUFBSSxJQUFJLENBQUksSUFBSSxFQUFFLEdBQUcsSUFBSSxDQUFDLENBQUE7SUFDbEMsQ0FBQztJQUVELE1BQU0sQ0FBQyxtQkFBbUIsQ0FBQyxJQUFZO1FBRXRDLE9BQU8sS0FBSyxDQUFDLElBQUksQ0FBQztZQUNqQixHQUFHLEVBQUUsT0FBTyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUM7U0FDMUIsQ0FBQyxDQUFDO0lBQ0osQ0FBQztJQUdELE1BQU0sQ0FBQyxnQkFBZ0IsQ0FBbUIsSUFBWTtRQUVyRCxJQUFJLElBQUksR0FBRyxJQUFJLENBQUMsbUJBQW1CLENBQUMsSUFBSSxDQUFDLENBQUE7UUFFekMsSUFBSSxHQUFHLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBSSxJQUFJLENBQUMsQ0FBQztRQUUvQixJQUFJLEdBQUcsQ0FBQyxJQUFJLENBQUMsSUFBSSxLQUFLLElBQUksRUFDMUI7WUFDQyxNQUFNLElBQUksU0FBUyxDQUFDLDRCQUE0QixHQUFHLENBQUMsSUFBSSxDQUFDLElBQUksU0FBUyxJQUFJLEdBQUcsQ0FBQyxDQUFDO1NBQy9FO1FBRUQsT0FBTyxHQUFHLENBQUM7SUFDWixDQUFDO0lBT0QsSUFBSSxHQUFHO1FBRU4sT0FBTyxJQUFJLENBQUMsT0FBTyxDQUFD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QkFBaUIsRUFBRSxZQUFZLEVBQUUsRUFBRSxLQUFLLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQztBQUd4RSxpQkFBUyxpQkFBaUIsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBmcyA9IHJlcXVpcmUoJ2ZzLWV4dHJhJyk7XG4vL2ltcG9ydCBQQUNLQUdFX0pTT04gPSByZXF1aXJlKCcuL3BhY2thZ2UuanNvbicpO1xuaW1wb3J0IHsgc29ydFBhY2thZ2VKc29uIH0gZnJvbSAnc29ydC1wYWNrYWdlLWpzb24nO1xuaW1wb3J0IHBrZ1VwID0gcmVxdWlyZSgncGtnLXVwJyk7XG5pbXBvcnQgYmluZCBmcm9tICdiaW5kLWRlY29yYXRvcic7XG5pbXBvcnQgeyBmaXhCaW5QYXRoIH0gZnJvbSAnLi91dGlsJztcbmltcG9ydCBwYXRoID0gcmVxdWlyZSgncGF0aCcpO1xuaW1wb3J0IHsgSVBhY2thZ2VKc29uIH0gZnJvbSAnQHRzLXR5cGUvcGFja2FnZS1kdHMnO1xuaW1wb3J0IFRzVHlwZVBhY2thZ2VEdHMgPSByZXF1aXJlKCdAdHMtdHlwZS9wYWNrYWdlLWR0cycpO1xuXG5leHBvcnQgeyBJUGFja2FnZUpzb24gfVxuXG5leHBvcnQgY2xhc3MgUGFja2FnZUpzb25Mb2FkZXI8VCA9IElQYWNrYWdlSnNvbj5cbntcblx0cmVhZG9ubHkgZmlsZTogc3RyaW5nO1xuXHRwcm90ZWN0ZWQganNvbjtcblx0bG9hZGVkOiBib29sZWFuO1xuXG5cdEBiaW5kXG5cdHN0YXRpYyBjcmVhdGU8VCA9IElQYWNrYWdlSnNvbj4oZmlsZTogc3RyaW5nLCAuLi5hcmd2KVxuXHR7XG5cdFx0cmV0dXJuIG5ldyB0aGlzPFQ+KGZpbGUsIC4uLmFyZ3YpXG5cdH1cblxuXHRzdGF0aWMgZmluZFBhY2thZ2VKc29uUGF0aChuYW1lOiBzdHJpbmcpOiBzdHJpbmdcblx0e1xuXHRcdHJldHVybiBwa2dVcC5zeW5jKHtcblx0XHRcdGN3ZDogcmVxdWlyZS5yZXNvbHZlKG5hbWUpLFxuXHRcdH0pO1xuXHR9XG5cblx0QGJpbmRcblx0c3RhdGljIGxvYWRCeU1vZHVsZU5hbWU8VCA9IElQYWNrYWdlSnNvbj4obmFtZTogc3RyaW5nKVxuXHR7XG5cdFx0bGV0IGZpbGUgPSB0aGlzLmZpbmRQYWNrYWdlSnNvblBhdGgobmFtZSlcblxuXHRcdGxldCBwa2cgPSB0aGlzLmNyZWF0ZTxUPihmaWxlKTtcblxuXHRcdGlmIChwa2cuZGF0YS5uYW1lICE9PSBuYW1lKVxuXHRcdHtcblx0XHRcdHRocm93IG5ldyBUeXBlRXJyb3IoYHBhY2thZ2UgbmFtZSBub3QgbWF0Y2gsICcke3BrZy5kYXRhLm5hbWV9JyAhPSAnJHtuYW1lfSdgKTtcblx0XHR9XG5cblx0XHRyZXR1cm4gcGtnO1xuXHR9XG5cblx0Y29uc3RydWN0b3IoZmlsZTogc3RyaW5nLCAuLi5hcmd2KVxuXHR7XG5cdFx0dGhpcy5maWxlID0gZmlsZTtcblx0fVxuXG5cdGdldCBkaXIoKVxuXHR7XG5cdFx0cmV0dXJuIHBhdGguZGlybmFtZSh0aGlzLmZpbGUpXG5cdH1cblxuXHRzZXQgZGF0YShqc29uKVxuXHR7XG5cdFx0dGhpcy5vdmVyd3JpdGUoanNvbik7XG5cdH1cblxuXHRnZXQgZGF0YSgpOiBJUGFja2FnZUpzb25cblx0e1xuXHRcdGlmICghdGhpcy5sb2FkZWQgJiYgdGhpcy5maWxlKVxuXHRcdHtcblx0XHRcdHRoaXMucmVhZCgpO1xuXHRcdH1cblxuXHRcdHJldHVybiB0aGlzLmpzb247XG5cdH1cblxuXHRvdmVyd3JpdGUoanNvbilcblx0e1xuXHRcdHRoaXMubG9hZGVkID0gdHJ1ZTtcblx0XHR0aGlzLmpzb24gPSBqc29uO1xuXG5cdFx0cmV0dXJuIHRoaXM7XG5cdH1cblxuXHRhdXRvZml4KClcblx0e1xuXHRcdGxldCBzZWxmID0gdGhpcztcblx0XHRsZXQgZGlyOiBzdHJpbmc7XG5cblx0XHRpZiAoc2VsZi5maWxlICYmIGZzLmV4aXN0c1N5bmMoZGlyID0gc2VsZi5kaXIpKVxuXHRcdHtcblx0XHRcdGlmIChzZWxmLmRhdGEpXG5cdFx0XHR7XG5cdFx0XHRcdGlmIChzZWxmLmRhdGEuYmluKVxuXHRcdFx0XHR7XG5cdFx0XHRcdFx0aWYgKHR5cGVvZiBzZWxmLmRhdGEuYmluID09PSAnc3RyaW5nJylcblx0XHRcdFx0XHR7XG5cdFx0XHRcdFx0XHRsZXQgYmluX25ldyA9IGZpeEJpblBhdGgoc2VsZi5kYXRhLmJpbiwgZGlyKTtcblxuXHRcdFx0XHRcdFx0aWYgKGJpbl9uZXcpXG5cdFx0XHRcdFx0XHR7XG5cdFx0XHRcdFx0XHRcdHNlbGYuZGF0YS5iaW4gPSBiaW5fbmV3O1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRlbHNlIGlmICh0eXBlb2Ygc2VsZi5kYXRhLmJpbiA9PT0gJ29iamVjdCcgJiYgIUFycmF5LmlzQXJyYXkoc2VsZi5kYXRhLmJpbikpXG5cdFx0XHRcdFx0e1xuXHRcdFx0XHRcdFx0T2JqZWN0LmtleXMoc2VsZi5kYXRhLmJpbilcblx0XHRcdFx0XHRcdFx0LmZvckVhY2goZnVuY3Rpb24gKGtleSlcblx0XHRcdFx0XHRcdFx0e1xuXHRcdFx0XHRcdFx0XHRcdGlmICh0eXBlb2Ygc2VsZi5kYXRhLmJpbltrZXldID09PSAnc3RyaW5nJylcblx0XHRcdFx0XHRcdFx0XHR7XG5cdFx0XHRcdFx0XHRcdFx0XHRsZXQgYmluX25ldyA9IGZpeEJpblBhdGgoc2VsZi5kYXRhLmJpbltrZXldLCBkaXIpO1xuXG5cdFx0XHRcdFx0XHRcdFx0XHRpZiAoYmluX25ldylcblx0XHRcdFx0XHRcdFx0XHRcdHtcblx0XHRcdFx0XHRcdFx0XHRcdFx0c2VsZi5kYXRhLmJpbltrZXldID0gYmluX25ldztcblx0XHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdH0pXG5cdFx0XHRcdFx0XHQ7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cblx0XHRcdFx0aWYgKCFzZWxmLmRhdGEucHVibGlzaENvbmZpZ1xuXHRcdFx0XHRcdCYmIHNlbGYuZGF0YS5uYW1lXG5cdFx0XHRcdFx0JiYgL1xcLy8udGVzdChzZWxmLmRhdGEubmFtZSlcblx0XHRcdFx0XHQmJiAhc2VsZi5kYXRhLnByaXZhdGVcblx0XHRcdFx0KVxuXHRcdFx0XHR7XG5cdFx0XHRcdFx0c2VsZi5kYXRhLnB1Ymxpc2hDb25maWcgPSB7XG5cdFx0XHRcdFx0XHRhY2Nlc3M6IFwicHVibGljXCIsXG5cdFx0XHRcdFx0fTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH1cblx0fVxuXG5cdGV4aXN0cygpXG5cdHtcblx0XHRyZXR1cm4gZnMuZXhpc3RzU3luYyh0aGlzLmZpbGUpXG5cdH1cblxuXHRyZWFkKClcblx0e1xuXHRcdHRoaXMubG9hZGVkID0gdHJ1ZTtcblx0XHR0aGlzLmpzb24gPSBmcy5yZWFkSlNPTlN5bmModGhpcy5maWxlKTtcblxuXHRcdHJldHVybiB0aGlzO1xuXHR9XG5cblx0c3RyaW5naWZ5KClcblx0e1xuXHRcdHJldHVybiBKU09OLnN0cmluZ2lmeSh0aGlzLmpzb24sIG51bGwsIDIpXG5cdH1cblxuXHRzb3J0KClcblx0e1xuXHRcdGlmICh0eXBlb2YgdGhpcy5kYXRhID09PSAndW5kZWZpbmVkJyB8fCB0aGlzLmRhdGEgPT09IG51bGwpXG5cdFx0e1xuXHRcdFx0dGhyb3cgbmV3IEVycm9yKGBkYXRhIGlzIHVuZGVmaW5lZGApXG5cdFx0fVxuXG5cdFx0dGhpcy5kYXRhID0gc29ydFBhY2thZ2VKc29uKHRoaXMuZGF0YSk7XG5cblx0XHRyZXR1cm4gdGhpcztcblx0fVxuXG5cdHdyaXRlKClcblx0e1xuXHRcdGlmICghdGhpcy5maWxlKVxuXHRcdHtcblx0XHRcdHRocm93IG5ldyBFcnJvcihgZmlsZSBpcyB1bmRlZmluZWRgKVxuXHRcdH1cblxuXHRcdGZzLndyaXRlSlNPTlN5bmModGhpcy5maWxlLCB0aGlzLmpzb24sIHtcblx0XHRcdHNwYWNlczogMixcblx0XHR9KTtcblxuXHRcdHJldHVybiB0aGlzO1xuXHR9XG5cblx0d3JpdGVXaGVuTG9hZGVkKClcblx0e1xuXHRcdGlmICh0aGlzLmxvYWRlZClcblx0XHR7XG5cdFx0XHR0aGlzLndyaXRlKCk7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIHRoaXMubG9hZGVkO1xuXHR9XG59XG5cbmV4cG9ydCBkZWNsYXJlIG1vZHVsZSBQYWNrYWdlSnNvbkxvYWRlclxue1xuXG5cdGV4cG9ydCB0eXBlIElQYWNrYWdlSnNvbiA9IFRzVHlwZVBhY2thZ2VEdHMuSVBhY2thZ2VKc29uO1xuXG5cdC8vIEB0cy1pZ25vcmVcblx0ZXhwb3J0IHsgUGFja2FnZUpzb25Mb2FkZXIgfVxuXHQvLyBAdHMtaWdub3JlXG5cdGV4cG9ydCB7IFBhY2thZ2VKc29uTG9hZGVyIGFzIGRlZmF1bHQgfVxufVxuXG4vLyBAdHMtaWdub3JlXG5leHBvcnQgZGVmYXVsdCBQYWNrYWdlSnNvbkxvYWRlclxuXG4vLyBAdHMtaWdub3JlXG5PYmplY3QuYXNzaWduKFBhY2thZ2VKc29uTG9hZGVyLCBleHBvcnRzLCB7XG5cdGRlZmF1bHQ6IFBhY2thZ2VKc29uTG9hZGVyLFxuXHRQYWNrYWdlSnNvbkxvYWRlcixcbn0pO1xuXG4vLyBAdHMtaWdub3JlXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoUGFja2FnZUpzb25Mb2FkZXIsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuXG4vLyBAdHMtaWdub3JlXG5leHBvcnQgPSBQYWNrYWdlSnNvbkxvYWRlclxuIl19