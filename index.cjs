require = require("require-util").dynamic(module);

// Application
const Application = require("./lib/Application/application.js").default;

// App
const app = new Application;

// Default export
module.exports = { 
    JsonDB: require("./lib/Database/JsonDB").default, 
    Server: require("./lib/Server/server.js").default, 
    Router: require("./lib/Middleware/router.js").default, 
    SubDomain: require("./lib/Middleware/subdomain.js").default, 
    StaticDir: require("./lib/Middleware/staticdir.js").default, 
    simple: require("./lib/Server/simple.js").default,
    app,
    Cookie: require("./lib/Middleware/cookie.js").default
};
