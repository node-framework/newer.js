import JsonDB, { Schema, SchemaInstance } from "./Database/JsonDB";
import JsonReviver from "./Database/JsonReviver";
import Server, { Context, Handler, Middleware, Method } from "./Server/server";
import Simple, { SimpleOptions } from "./Server/deno";
declare const _default: {
    JsonDB: typeof JsonDB;
    JsonReviver: typeof JsonReviver;
    Server: typeof Server;
    Simple: typeof Simple;
};
export default _default;
export type { Schema, SchemaInstance, Context, Handler, Method, Middleware, SimpleOptions };
