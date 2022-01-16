"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SimpleServer = exports.Server = exports.JsonReviver = exports.JsonDB = void 0;
var JsonDB_1 = require("./Database/JsonDB");
Object.defineProperty(exports, "JsonDB", { enumerable: true, get: function () { return __importDefault(JsonDB_1).default; } });
var JsonReviver_1 = require("./Database/JsonReviver");
Object.defineProperty(exports, "JsonReviver", { enumerable: true, get: function () { return __importDefault(JsonReviver_1).default; } });
var server_1 = require("./Server/server");
Object.defineProperty(exports, "Server", { enumerable: true, get: function () { return __importDefault(server_1).default; } });
var deno_1 = require("./Server/deno");
Object.defineProperty(exports, "SimpleServer", { enumerable: true, get: function () { return __importDefault(deno_1).default; } });
