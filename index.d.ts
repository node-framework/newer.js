import Server from "./src/Server/server";
import Router from "./src/Middleware/router";
import StaticDir from "./src/Middleware/staticdir";
import simple from "./src/Server/simple";
import SubDomain from "./src/Middleware/subdomain";
import Cookie from "./src/Middleware/cookie";

export {
    Server,
    Router,
    StaticDir,
    simple,
    SubDomain,
    Cookie,
}

export * from "./src/declarations";

