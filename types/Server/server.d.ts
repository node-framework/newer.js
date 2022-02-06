/// <reference types="node" />
import http from "http";
import https from "https";
import { Middleware } from "./declarations";
export default class Server {
    private mds;
    private options;
    private httpsMode;
    private rawServer;
    private iconPath;
    /**
     * The constructor
     */
    constructor(options?: http.ServerOptions | https.ServerOptions, httpsMode?: boolean);
    /**
     * Set the icon path
     * @param path the icon path
     * @returns this server for chaining
     */
    icon(path: string): this;
    /**
     * Add middleware
     * @param m middleware
     * @returns this server for chaining
     */
    middleware(m: Middleware): this;
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
