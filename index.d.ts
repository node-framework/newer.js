import Application from "./src/Application/application";
import Server from "./src/Server/server";
import Router from "./src/Middleware/router";
import StaticDir from "./src/Middleware/staticdir";
import simple from "./src/Server/simple";
import SubDomain from "./src/Middleware/subdomain";
import Cookie from "./src/Middleware/cookie";
import JsonDB from "./src/Database/JsonDB";

declare const app: Application;

export {
    Application,
    Server,
    Router,
    StaticDir,
    simple,
    SubDomain,
    Cookie,
    JsonDB,
    app,
}

export * from "./src/declarations";

