"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
class StaticDir {
    /**
     * @param dir The target directory
     */
    constructor(dir) {
        this.dir = dir;
    }
    invoke(ctx, next) {
        return __awaiter(this, void 0, void 0, function* () {
            // If response hasn't been written
            if (!ctx.response)
                // Write the response with the file
                ctx.response = yield fs_1.default.promises
                    .readFile(path_1.default.join(this.dir, ctx.url))
                    .then(v => { var _a; return (_a = v === null || v === void 0 ? void 0 : v.toString()) !== null && _a !== void 0 ? _a : ""; })
                    .catch(() => "");
            // Next middleware
            yield next();
        });
    }
}
exports.default = StaticDir;
