/// <reference types="node" />
import http from "http";
import https from "https";
import { Handler, Middleware } from "./declarations";
import Router from "./router";
export default class Server {
    private staticDir;
    private routes;
    private mds;
    private subhosts;
    private options;
    private httpsMode;
    private rawServer;
    /**
     * The constructor
     */
    constructor(options?: http.ServerOptions | https.ServerOptions, httpsMode?: boolean);
    /**
     * Register a route
     * @param routeName the route name
     * @param route the route handler
     * @returns this server for chaining
     */
    route(routeName: string, route: Handler): this;
    /**
     * Handle a subdomain
     * @param host the subhost
     * @param route the Router
     */
    sub(host: string, route: Router): void;
    /**
     * Add middleware
     * @param m middleware
     * @returns this server for chaining
     */
    middleware(m: Middleware): this;
    /**
     * @param path the static path
     * @returns this server for chaining
     */
    static(path: string): this;
    private readFile;
    private endResponse;
    /**
     * Start the server
     * @param port the port to listen to
     * @param hostname the hostname to listen to
     * @param backlog the backlog
     */
    listen(port?: number, hostname?: string, backlog?: number): Promise<void>;
    /**
     * Get the HTTP or HTTPS server
     */
    get http(): http.Server | https.Server;
}
