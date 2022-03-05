import JsonDB from "./lib/Database/JsonDB.js";
import Server from "./lib/Server/Server.js";
import Router from "./lib/Middleware/Router.js";
import SubDomain from "./lib/Middleware/SubDomain.js";
import StaticDir from "./lib/Middleware/StaticDir.js";
import simple from "./lib/Server/simple.js";
import Application from "./lib/Application/Application.js";
import Cookie from "./lib/Middleware/Cookie.js";

// Create a new application
const app = new Application();

// Default export
export {
    JsonDB,
    Server,
    Router,
    SubDomain,
    StaticDir,
    simple,
    app,
    Cookie
};