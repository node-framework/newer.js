const Server = require("../lib/Server/server.js").default;
const Router = require("../lib/Middleware/router.js").default;
const StaticDir = require("../lib/Middleware/staticdir.js").default;
const route = require("../lib/Middleware/route.js").default;
const Cookie = require("../lib/Middleware/cookie.js").default;
const CORS = require("../lib/Middleware/cors.js").default;

// Default export
module.exports = {
    Server,
    Router,
    StaticDir,
    Cookie,
    route,
    CORS
};