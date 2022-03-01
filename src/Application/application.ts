import Router from "../Middleware/router.js";
import Server from "../Server/server.js";
import StaticDir from "../Middleware/staticdir.js";
import { readdirSync, existsSync, mkdirSync } from "fs";
import { join, resolve } from "path";
import { AppConfigs, Application } from "../declarations.js";

// App configs
const appConfig: AppConfigs = {
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

    // Create the directories if not exists
    if (!existsSync(join(appConfig.projectPath, "src")))
        mkdirSync(join(appConfig.projectPath, "src"));

    if (!existsSync(join(appConfig.projectPath, "src", "middlewares")))
        mkdirSync(join(appConfig.projectPath, "src", "middlewares"));

    if (!existsSync(join(appConfig.projectPath, "src", "controllers")))
        mkdirSync(join(appConfig.projectPath, "src", "controllers"));

    if (!existsSync(join(appConfig.projectPath, appConfig.static)))
        mkdirSync(join(appConfig.projectPath, appConfig.static));

    // Create a new server
    const app = new Server(appConfig.httpOptions.advanced, appConfig.httpOptions.httpsMode);

    // Router
    const router = new Router;

    // Default middleware
    app.middleware(
        new StaticDir(
            join(appConfig.projectPath, appConfig.static)
        )
    );

    // Read the middleware directory
    for (const filename of readdirSync(
        join(appConfig.projectPath, "src", "middlewares")
    ) ?? []) {
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
        } catch (e) { }
    }

    // Read the controller directory
    for (const filename of readdirSync(
        join(appConfig.projectPath, "src", "controllers")
    ) ?? []) {
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

    // Add to app
    app.middleware(router);

    // Listen on port 80
    app.listen(appConfig.httpOptions.port, appConfig.httpOptions.hostname, appConfig.httpOptions.backlog);

    // Return the http server
    return app.http;
}

// Set configs
function config(configs: AppConfigs) {
    Object.assign(appConfig, configs);
}

// App
const app: Application = {
    start, config
}

// Export app
export default app;

