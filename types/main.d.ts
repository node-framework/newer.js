export { default as SimpleServer } from "./Server/deno";
import JsonDB, { Schema, SchemaInstance } from "./Database/JsonDB";
import JsonReviver from "./Database/JsonReviver";
import Server, { Context, Handler, Middleware, Method } from "./Server/server";
declare const _default: {
    JsonDB: typeof JsonDB;
    JsonReviver: typeof JsonReviver;
    Server: typeof Server;
};
export default _default;
export type { Schema, SchemaInstance, Context, Handler, Method, Middleware };
