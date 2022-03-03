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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const router_js_1 = __importDefault(require("../Middleware/router.js"));
const server_js_1 = __importDefault(require("../Server/server.js"));
const staticdir_js_1 = __importDefault(require("../Middleware/staticdir.js"));
const fs_1 = require("fs");
const path_1 = require("path");
// Create an app
class Application {
    constructor() {
        // App configs
        this.appConfig = {
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
    }
    /**
     * Start the app
     * @returns the http or https server
     */
    async start() {
        var _a, _b, _c, _d, _e, _f, _g;
        // Fix missing configs
        this.appConfig.projectPath = (_a = this.appConfig.projectPath) !== null && _a !== void 0 ? _a : ".";
        this.appConfig.static = (_b = this.appConfig.static) !== null && _b !== void 0 ? _b : "public";
        this.appConfig.httpOptions = (_c = this.appConfig.httpOptions) !== null && _c !== void 0 ? _c : {};
        // Create the directories if not exists
        if (!(0, fs_1.existsSync)((0, path_1.join)(this.appConfig.projectPath, "src")))
            (0, fs_1.mkdirSync)((0, path_1.join)(this.appConfig.projectPath, "src"));
        if (!(0, fs_1.existsSync)((0, path_1.join)(this.appConfig.projectPath, "src", "middlewares")))
            (0, fs_1.mkdirSync)((0, path_1.join)(this.appConfig.projectPath, "src", "middlewares"));
        if (!(0, fs_1.existsSync)((0, path_1.join)(this.appConfig.projectPath, "src", "controllers")))
            (0, fs_1.mkdirSync)((0, path_1.join)(this.appConfig.projectPath, "src", "controllers"));
        if (!(0, fs_1.existsSync)((0, path_1.join)(this.appConfig.projectPath, this.appConfig.static)))
            (0, fs_1.mkdirSync)((0, path_1.join)(this.appConfig.projectPath, this.appConfig.static));
        // Create a new server
        const app = new server_js_1.default(this.appConfig.httpOptions.advanced, this.appConfig.httpOptions.httpsMode);
        // Router
        const router = new router_js_1.default;
        // Default middleware
        app.middleware(new staticdir_js_1.default((0, path_1.join)(this.appConfig.projectPath, this.appConfig.static)));
        // Read the middleware directory
        for (const filename of (_d = (0, fs_1.readdirSync)((0, path_1.join)(this.appConfig.projectPath, "src", "middlewares"))) !== null && _d !== void 0 ? _d : []) {
            // Module path
            let modulePath = (0, path_1.resolve)((0, path_1.join)(this.appConfig.projectPath, "src", "middlewares", filename));
            modulePath = modulePath
                .slice(modulePath.indexOf(":") + 1)
                .replaceAll("\\", "/");
            // Import the middleware
            let module = await Promise.resolve().then(() => __importStar(require(modulePath)));
            // Check whether module is an ES6 module
            module = (_e = module === null || module === void 0 ? void 0 : module.default) !== null && _e !== void 0 ? _e : module;
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
        for (const filename of (_f = (0, fs_1.readdirSync)((0, path_1.join)(this.appConfig.projectPath, "src", "controllers"))) !== null && _f !== void 0 ? _f : []) {
            // Module path
            let modulePath = (0, path_1.resolve)((0, path_1.join)(this.appConfig.projectPath, "src", "controllers", filename));
            modulePath = modulePath
                .slice(modulePath.indexOf(":") + 1)
                .replaceAll("\\", "/");
            // Get the controller path
            let module = await Promise.resolve().then(() => __importStar(require(modulePath)));
            // Check whether module is an ES6 module
            module = (_g = module === null || module === void 0 ? void 0 : module.default) !== null && _g !== void 0 ? _g : module;
            // Loop through the routes
            for (const routeName in module)
                // Add to router
                router.route(routeName, module[routeName]);
        }
        // Add to app
        app.middleware(router);
        // Listen on port 80
        await app.listen(this.appConfig.httpOptions.port, this.appConfig.httpOptions.hostname, this.appConfig.httpOptions.backlog);
        // Return the http server
        return app.http;
    }
    /**
      * Set app configs
      * @param configs the configs
      */
    config(configs) {
        Object.assign(this.appConfig, configs);
    }
}
// App
const app = new Application();
// Export app
exports.default = app;
