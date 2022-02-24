"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
const router_1 = __importDefault(require("./Middleware/router"));
const server_1 = __importDefault(require("./Server/server"));
const staticdir_1 = __importDefault(require("./Middleware/staticdir"));
const fs_1 = require("fs");
const path_1 = require("path");
// App configs
const appConfig = {
    projectPath: ".",
    static: "public",
    httpOptions: {
        port: 80,
        hostname: "localhost",
        httpsMode: false,
        backlog: 0,
        advanced: {}
    },
};
// App
const app = {
    // Start the main application
    start() {
        var _a, _b, _c, _d, _e, _f;
        return __awaiter(this, void 0, void 0, function* () {
            // Fix missing configs
            appConfig.projectPath = (_a = appConfig.projectPath) !== null && _a !== void 0 ? _a : ".";
            appConfig.static = (_b = appConfig.static) !== null && _b !== void 0 ? _b : "public";
            // Create a new server
            const app = new server_1.default(appConfig.httpOptions.advanced, appConfig.httpOptions.httpsMode);
            // Router
            const router = new router_1.default;
            // Default middleware
            app.middleware(new staticdir_1.default((0, path_1.join)(appConfig.projectPath, "public")));
            // Read the middleware directory
            for (const filename of (_c = (0, fs_1.readdirSync)((0, path_1.join)(appConfig.projectPath, "src", "middlewares"))) !== null && _c !== void 0 ? _c : []) {
                // Import the middleware
                let module = yield Promise.resolve().then(() => __importStar(require("file:///" + (0, path_1.resolve)((0, path_1.join)(appConfig.projectPath, "src", "middlewares", filename)))));
                // Check whether module is an ES6 module
                module = (_d = module === null || module === void 0 ? void 0 : module.default) !== null && _d !== void 0 ? _d : module;
                try {
                    // Add the middleware to the router
                    if (Array.isArray(module))
                        router.middleware(...module);
                    else
                        router.middleware(module);
                }
                catch (e) { }
            }
            // Read the controller directory
            for (const filename of (_e = (0, fs_1.readdirSync)((0, path_1.join)(appConfig.projectPath, "src", "controllers"))) !== null && _e !== void 0 ? _e : []) {
                // Get the controller path
                let module = yield Promise.resolve().then(() => __importStar(require("file:///" + (0, path_1.resolve)((0, path_1.join)(appConfig.projectPath, "src", "controllers", filename)))));
                // Check whether module is an ES6 module
                module = (_f = module === null || module === void 0 ? void 0 : module.default) !== null && _f !== void 0 ? _f : module;
                // Loop through the routes
                for (const routeName in module)
                    // Add to router
                    router.route(routeName, module[routeName]);
            }
            // Add to app
            app.middleware(router);
            // Listen on port 80
            yield app.listen(appConfig.httpOptions.port, appConfig.httpOptions.hostname, appConfig.httpOptions.backlog);
        });
    },
    // Set configs
    config(configs) {
        Object.assign(appConfig, configs);
    }
};
// Export app
exports.default = app;
