"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.simple = exports.StaticDir = exports.SubDomain = exports.Router = exports.Server = exports.JsonReviver = exports.JsonDB = void 0;
// JsonDB
const JsonDB_1 = __importDefault(require("./Database/JsonDB"));
exports.JsonDB = JsonDB_1.default;
// JsonDB reviver
const JsonReviver_1 = __importDefault(require("./Database/JsonReviver"));
exports.JsonReviver = JsonReviver_1.default;
// All servers
const server_1 = __importDefault(require("./Server/server"));
exports.Server = server_1.default;
const simple_1 = __importDefault(require("./Server/simple"));
exports.simple = simple_1.default;
// Middlewares
const router_1 = __importDefault(require("./Middleware/router"));
exports.Router = router_1.default;
const subdomain_1 = __importDefault(require("./Middleware/subdomain"));
exports.SubDomain = subdomain_1.default;
const staticdir_1 = __importDefault(require("./Middleware/staticdir"));
exports.StaticDir = staticdir_1.default;
