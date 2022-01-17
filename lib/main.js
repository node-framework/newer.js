"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.simple = exports.Server = exports.JsonReviver = exports.JsonDB = void 0;
const JsonDB_1 = __importDefault(require("./Database/JsonDB"));
exports.JsonDB = JsonDB_1.default;
const JsonReviver_1 = __importDefault(require("./Database/JsonReviver"));
exports.JsonReviver = JsonReviver_1.default;
const server_1 = __importDefault(require("./Server/server"));
exports.Server = server_1.default;
const deno_1 = __importDefault(require("./Server/deno"));
exports.simple = deno_1.default;
