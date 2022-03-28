// @ts-check

const Server = require("../lib/Server/server.js").default;
const StaticDir = require("../lib/Middleware/staticdir.js").default;
const { readdirSync, existsSync } = require("fs");
const { join, resolve } = require("path");

// Create an app
class Application {
    /**
     * @type {import("..").AppConfigs}
     * App configs
     * @private
     */
    static _appConfig = {
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
     * @returns {import("..").AppConfigs} the app config
     * @readonly
     */
    static get appConfig() {
        return this._appConfig;
    }

    /**
     * Start the app
     * @returns {Promise<import("http").Server | import("https").Server>} the http or https server
     */
    static async start() {
        // Fix missing configs
        this._appConfig = this._appConfig ?? {};
        this._appConfig.projectPath = this._appConfig.projectPath ?? ".";
        this._appConfig.static = this._appConfig.static ?? "public";
        this._appConfig.httpOptions = this._appConfig.httpOptions ?? {};

        // Create a new server
        const app = new Server(this.appConfig.httpOptions.advanced, this.appConfig.httpOptions.httpsMode);

        // Default middleware
        if (existsSync(join(this.appConfig.projectPath, this.appConfig.static)))
            app.middleware(new StaticDir(
                join(this.appConfig.projectPath, this.appConfig.static)
            ));

        // Check whether the src directory exists
        if (existsSync(join(this.appConfig.projectPath, "src"))) {
            // Read the directory
                for (const filename of readdirSync(
                    join(this.appConfig.projectPath, "src")
                ) ?? []) {
                    // Module path
                    let modulePath = resolve(join(this.appConfig.projectPath, "src", filename));
                    modulePath = modulePath
                        .slice(modulePath.indexOf(":") + 1)
                        // @ts-ignore
                        .replaceAll("\\", "/");

                    /**
                     * The target module
                     */
                    let module = await import(modulePath);

                    // Check whether module has a default export
                    module = module?.default ?? module;

                    try {
                        // Add the middleware to the router
                        if (Array.isArray(module))
                            app.middleware(...module);
                        else
                            app.middleware(module);
                    } catch (e) { }
                }
        }

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
      * @param {import("..").AppConfigs} configs the configs
      */
    static config(configs) {
        Object.assign(this._appConfig, configs);
    }
}

module.exports = Application;
