const Server = require("../lib/Server/server.js").default;
const Router = require("../lib/Middleware/router.js").default;
const SubDomain = require("../lib/Middleware/subdomain.js").default;
const StaticDir = require("../lib/Middleware/staticdir.js").default;
const simple = require("../lib/Server/simple.js").default;
const Cookie = require("../lib/Middleware/cookie.js").default;

// Default export
module.exports = {
    Server,
    Router,
    SubDomain,
    StaticDir,
    simple,
    Cookie
};