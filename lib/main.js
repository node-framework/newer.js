"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const JsonDB_1 = __importDefault(require("./Database/JsonDB"));
const JsonReviver_1 = __importDefault(require("./Database/JsonReviver"));
const server_1 = __importDefault(require("./Server/server"));
const deno_1 = __importDefault(require("./Server/deno"));
exports.default = {
    JsonDB: JsonDB_1.default,
    JsonReviver: JsonReviver_1.default,
    Server: server_1.default,
    Simple: deno_1.default
};
