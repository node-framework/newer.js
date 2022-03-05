const JsonDB = require("./lib/Database/JsonDB.js").default;
const Server = require("./lib/Server/server.js").default;
const Router = require("./lib/Middleware/router.js").default;
const SubDomain = require("./lib/Middleware/subdomain.js").default;
const StaticDir = require("./lib/Middleware/staticdir.js").default;
const simple = require("./lib/Server/simple.js").default;
const Cookie = require("./lib/Middleware/cookie.js").default;

// Default export
module.exports = {
    JsonDB,
    Server,
    Router,
    SubDomain,
    StaticDir,
    simple,
    Cookie
};