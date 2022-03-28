import Server from "./src/Server/server";
import Router from "./src/Middleware/router";
import StaticDir from "./src/Middleware/staticdir";
import simple from "./src/Server/simple";
import SubDomain from "./src/Middleware/subdomain";
import Cookie from "./src/Middleware/cookie";
import route from "./src/Middleware/route";

export {
    Server,
    Router,
    StaticDir,
    simple,
    SubDomain,
    Cookie,
    route
}

export * from "./src/declarations";

