/// <reference types="node" />
export { default as SimpleServer } from "./Server/deno";
import JsonDB, { Schema, SchemaInstance } from "./Database/JsonDB";
import JsonReviver from "./Database/JsonReviver";
import Server, { Context, Handler, Middleware, Method } from "./Server/server";
import { Simple } from "./Server/deno";
declare const _default: {
    JsonDB: typeof JsonDB;
    JsonReviver: typeof JsonReviver;
    Server: typeof Server;
    simple: (init: {
        options?: import("http").ServerOptions | import("https").ServerOptions;
        port?: number;
        hostname?: string;
        backlog?: number;
        httpsMode?: boolean;
    }) => Simple;
};
export default _default;
export type { Schema, SchemaInstance, Context, Handler, Method, Middleware, Simple };
