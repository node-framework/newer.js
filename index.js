import JsonDB from "./lib/Database/JsonDB.js";
import Server from "./lib/Server/Server.js";
import Router from "./lib/Middleware/Router.js";
import SubDomain from "./lib/Middleware/SubDomain.js";
import StaticDir from "./lib/Middleware/StaticDir.js";
import simple from "./lib/Server/simple.js";
import Cookie from "./lib/Middleware/Cookie.js";

// Default export
export {
    JsonDB,
    Server,
    Router,
    SubDomain,
    StaticDir,
    simple,
    Cookie
};