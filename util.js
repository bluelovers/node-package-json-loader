"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs-extra");
const path = require("path");
function fixBinPath(bin, root) {
    if (!fs.existsSync(path.join(root, bin))
        && fs.existsSync(path.join(root, 'bin', bin))) {
        return path.posix.join('.', 'bin', bin);
    }
    return null;
}
exports.fixBinPath = fixBinPath;
