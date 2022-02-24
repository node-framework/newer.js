import Router from "./Middleware/router";
import Server from "./Server/server";
import StaticDir from "./Middleware/staticdir";
import { readdirSync } from "fs";
import { join, resolve } from "path";
import { AppConfigs, Application } from "./declarations";

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
}

// App
const app: Application = {
    // Start the main application
    async start() {
        // Fix missing configs
        appConfig.projectPath = appConfig.projectPath ?? ".";
        appConfig.static = appConfig.static ?? "public";
    
        // Create a new server
        const app = new Server(appConfig.httpOptions.advanced, appConfig.httpOptions.httpsMode);
    
        // Router
        const router = new Router;
    
        // Default middleware
        app.middleware(
            new StaticDir(
                join(appConfig.projectPath, "public")
            )
        );
    
        // Read the middleware directory
        for (const filename of readdirSync(
            join(appConfig.projectPath, "src", "middlewares")
        ) ?? []) {
            // Import the middleware
            let module = await import("file:///" + resolve(
                join(appConfig.projectPath, "src", "middlewares", filename)
            ));
    
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
            // Get the controller path
            let module = await import("file:///" + resolve(
                join(appConfig.projectPath, "src", "controllers", filename)
            ));
    
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
        await app.listen(appConfig.httpOptions.port, appConfig.httpOptions.hostname, appConfig.httpOptions.backlog);
    },

    // Set configs
    config(configs: AppConfigs) {
        Object.assign(appConfig, configs);
    }
}

// Export app
export default app;

