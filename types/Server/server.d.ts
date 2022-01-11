/// <reference types="node" />
import http from "http";
import qs from "query-string";
/**
 * Context of a request
 */
export interface Context {
    /**
     * The request
     */
    readonly request: http.IncomingMessage;
    /**
     * The response
     */
    response: string;
    /**
     * Status code
     */
    statusCode: number;
    /**
     * Parsed query
     */
    readonly query: {
        [k: string]: string;
    };
    /**
     * Parsed body
     */
    readonly body: qs.ParsedQuery;
    /**
     * The page url
     */
    readonly url: string;
    /**
     * Content type
     */
    contentType: string;
    /**
     * URL to redirect
     */
    redirect: string;
    /**
     * Send a file
     */
    readonly writeFile: (path: string) => void;
}
/**
 * A route handler
 */
export interface Handler {
    GET?: (ctx: Context) => Promise<void>;
    POST?: (ctx: Context) => Promise<void>;
    PUT?: (ctx: Context) => Promise<void>;
    DELETE?: (ctx: Context) => Promise<void>;
}
export default class Server {
    private server;
    private staticDir;
    private routes;
    /**
     * The constructor
     */
    constructor();
    /**
     * @param routeName the route name
     * @param route the route handler
     * @returns this server for chaining
     */
    route(routeName: string, route: Handler): this;
    /**
     * @param path the static path
     * @returns this server for chaining
     */
    static(path: string): this;
    private readFile;
    /**
     * @returns a listener that can be use for http.createServer or https.createServer
     */
    callback(): (req: http.IncomingMessage, res: http.ServerResponse) => Promise<void>;
    /**
     * Start the server
     * @param port the port to listen to
     * @param host the hostname to listen to
     * @param backlog the backlog
     * @returns this server for chaining
     */
    listen(port?: number, host?: string, backlog?: number): Promise<Server>;
    /**
     * Close the server
     * @returns this server for chaining
     */
    close(): Promise<Server>;
}
