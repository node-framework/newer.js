import Router from "./Middleware/router.js";
import Server from "./Server/server.js";
import StaticDir from "./Middleware/staticdir.js";
import { readdirSync, existsSync } from "fs";
import { join, resolve } from "path";
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
// Start the app
async function start() {
    // Fix missing configs
    appConfig.projectPath = appConfig.projectPath ?? ".";
    appConfig.static = appConfig.static ?? "public";
    appConfig.httpOptions = appConfig.httpOptions ?? {};
    // Create a new server
    const app = new Server(appConfig.httpOptions.advanced, appConfig.httpOptions.httpsMode);
    // Router
    const router = new Router;
    // Default middleware
    if (existsSync(join(appConfig.projectPath, appConfig.static)))
        app.middleware(new StaticDir(join(appConfig.projectPath, appConfig.static)));
    // Check whether src exists
    if (existsSync(join(appConfig.projectPath, "src"))) {
        // Read the middleware directory
        if (existsSync(join(appConfig.projectPath, "src", "middlewares")))
            for (const filename of readdirSync(join(appConfig.projectPath, "src", "middlewares")) ?? []) {
                // Module path
                let modulePath = resolve(join(appConfig.projectPath, "src", "middlewares", filename));
                modulePath = modulePath
                    .slice(modulePath.indexOf(":") + 1)
                    .replaceAll("\\", "/");
                // Import the middleware
                let module = await import(modulePath);
                // Check whether module is an ES6 module
                module = module?.default ?? module;
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
        if (existsSync(join(appConfig.projectPath, "src", "controllers")))
            for (const filename of readdirSync(join(appConfig.projectPath, "src", "controllers")) ?? []) {
                // Module path
                let modulePath = resolve(join(appConfig.projectPath, "src", "controllers", filename));
                modulePath = modulePath
                    .slice(modulePath.indexOf(":") + 1)
                    .replaceAll("\\", "/");
                // Get the controller path
                let module = await import(modulePath);
                // Check whether module is an ES6 module
                module = module?.default ?? module;
                // Loop through the routes
                for (const routeName in module)
                    // Add to router
                    router.route(routeName, module[routeName]);
            }
    }
    // Add to app
    app.middleware(router);
    // Listen on port 80
    await app.listen(appConfig.httpOptions.port, appConfig.httpOptions.hostname, appConfig.httpOptions.backlog);
}
// Set configs
function config(configs) {
    Object.assign(appConfig, configs);
}
// App
const app = {
    start, config
};
// Export app
export default app;
