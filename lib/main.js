"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Cookie = exports.app = exports.simple = exports.StaticDir = exports.SubDomain = exports.Router = exports.Server = exports.JsonDB = void 0;
// JsonDB
const JsonDB_js_1 = __importDefault(require("./Database/JsonDB.js"));
exports.JsonDB = JsonDB_js_1.default;
// All servers
const server_js_1 = __importDefault(require("./Server/server.js"));
exports.Server = server_js_1.default;
const simple_js_1 = __importDefault(require("./Server/simple.js"));
exports.simple = simple_js_1.default;
// Middlewares
const router_js_1 = __importDefault(require("./Middleware/router.js"));
exports.Router = router_js_1.default;
const subdomain_js_1 = __importDefault(require("./Middleware/subdomain.js"));
exports.SubDomain = subdomain_js_1.default;
const staticdir_js_1 = __importDefault(require("./Middleware/staticdir.js"));
exports.StaticDir = staticdir_js_1.default;
const application_js_1 = __importDefault(require("./Application/application.js"));
exports.app = application_js_1.default;
const cookie_js_1 = __importDefault(require("./Middleware/cookie.js"));
exports.Cookie = cookie_js_1.default;
// Export all types
__exportStar(require("./declarations.js"), exports);
