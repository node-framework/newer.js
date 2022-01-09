/// <reference types="node" />
import http from "http";
import qs from "query-string";
export interface Context {
    readonly request: http.IncomingMessage;
    response: string;
    readonly query: {
        [k: string]: string;
    };
    readonly body: qs.ParsedQuery;
    readonly url: string;
}
export interface Handler {
    readonly invoke: (ctx: Context) => Promise<void>;
}
export default class Server {
    private server;
    private routes;
    constructor();
    route(routeName: string, route: Handler): this;
    callback(): (req: http.IncomingMessage, res: http.ServerResponse) => Promise<void>;
    listen(port?: number, host?: string, backlog?: number): Promise<void>;
    close(): Promise<void>;
}
