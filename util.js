"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fixBinPath = void 0;
const fs_extra_1 = require("fs-extra");
const path_1 = require("path");
function fixBinPath(bin, root) {
    if (!fs_extra_1.existsSync(path_1.join(root, bin))
        && fs_extra_1.existsSync(path_1.join(root, 'bin', bin))) {
        return path_1.posix.join('.', 'bin', bin);
    }
    return null;
}
exports.fixBinPath = fixBinPath;
//# sourceMappingURL=util.js.map