const Router = require("./lib/Middleware/router.js").default;
const Server = require("./lib/Server/server.js").default;
const StaticDir = require("./lib/Middleware/staticdir.js").default;
const { readdirSync, existsSync, mkdirSync } = require("fs");
const { join, resolve } = require("path");

// Create an app
class Application {
    /**
     * Create a new application
     * @param {import(".").AppConfigs} appConfig the app configuration
     */
    constructor(appConfig = {
        projectPath: ".",
        static: "public",
        httpOptions: {
            port: 80,
            hostname: "localhost",
            httpsMode: false,
            backlog: 0,
            advanced: {}
        },
    }) {
        this.#_appConfig = appConfig;
    }

    /**
     * @type {import(".").AppConfigs}
     * App configs
     */
    #_appConfig = {
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

    /**
     * Get the app config
     * @returns {import(".").AppConfigs} the app config
     */
    get appConfig() {
        return this.#_appConfig;
    }

    /**
     * Start the app
     * @returns {Promise<import("http").Server | import("https").Server>} the http or https server
     */
    async start() {
        // Fix missing configs
        this.#_appConfig = this.#_appConfig ?? {};
        this.#_appConfig.projectPath = this.#_appConfig.projectPath ?? ".";
        this.#_appConfig.static = this.#_appConfig.static ?? "public";
        this.#_appConfig.httpOptions = this.#_appConfig.httpOptions ?? {};

        // Create the directories if not exists
        if (!existsSync(join(this.appConfig.projectPath, "src")))
            mkdirSync(join(this.appConfig.projectPath, "src"));

        if (!existsSync(join(this.appConfig.projectPath, "src", "middlewares")))
            mkdirSync(join(this.appConfig.projectPath, "src", "middlewares"));

        if (!existsSync(join(this.appConfig.projectPath, "src", "controllers")))
            mkdirSync(join(this.appConfig.projectPath, "src", "controllers"));

        if (!existsSync(join(this.appConfig.projectPath, this.appConfig.static)))
            mkdirSync(join(this.appConfig.projectPath, this.appConfig.static));

        // Create a new server
        const app = new Server(this.appConfig.httpOptions.advanced, this.appConfig.httpOptions.httpsMode);

        // Router
        const router = new Router;

        // Default middleware
        app.middleware(
            new StaticDir(
                join(this.appConfig.projectPath, this.appConfig.static)
            )
        );

        // Read the middleware directory
        for (const filename of readdirSync(
            join(this.appConfig.projectPath, "src", "middlewares")
        ) ?? []) {
            // Module path
            let modulePath = resolve(join(this.appConfig.projectPath, "src", "middlewares", filename));
            modulePath = modulePath
                .slice(modulePath.indexOf(":") + 1)
                .replaceAll("\\", "/");

            // const the middleware
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
            join(this.appConfig.projectPath, "src", "controllers")
        ) ?? []) {
            // Module path
            let modulePath = resolve(join(this.appConfig.projectPath, "src", "controllers", filename));
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
        await app.listen(
            this.appConfig.httpOptions.port, 
            this.appConfig.httpOptions.hostname, 
            this.appConfig.httpOptions.backlog
        );

        // Return the http server
        return app.http;
    }

    /**
      * Set app configs
      * @param {import(".").AppConfigs} configs the configs
      */
    config(configs) {
        Object.assign(this.appConfig, configs);
    }
}

module.exports = Application;
