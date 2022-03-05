export = {
    JsonDB: await import("./lib/Database/JsonDB").then(v => v.default),
    Server: await import("./lib/Server/server.js").then(v => v.default),
    Router: await import("./lib/Middleware/router.js").then(v => v.default),
    SubDomain: await import("./lib/Middleware/subdomain.js").then(v => v.default),
    StaticDir: await import("./lib/Middleware/staticdir.js").then(v => v.default),
    simple: await import("./lib/Server/simple.js").then(v => v.default),
    app: new Application(),
    Cookie: await import("./lib/Middleware/cookie.js").then(v => v.default)
}