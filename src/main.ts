// JsonDB
import JsonDB from "./Database/JsonDB";

// All servers
import Server from "./Server/server";
import simple from "./Server/simple";

// Middlewares
import Router from "./Middleware/router";
import SubDomain from "./Middleware/subdomain";
import StaticDir from "./Middleware/staticdir";

// Application
import app from "./application";

// Default export
export { JsonDB, Server, Router, SubDomain, StaticDir, simple };

// Export all types
export * from "./declarations";

// Export the app
export default app;