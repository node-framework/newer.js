/// <reference types="node" />
import http from "http";
/**
 * Server options
 */
export declare type ServerOptions = {
    port?: number;
    hostname?: string;
} & http.ServerOptions;
/**
 * Middlewares and route handlers type
 */
export declare type ServerHandlers = (req: http.IncomingMessage, res: http.ServerResponse, raise: (err: Error) => void) => Promise<void> | void;
export default class NodeServer {
    /**
     * All routes
     */
    private routes;
    /**
     * Error raised by middleware or routes during the process
     */
    private err;
    /**
     * The error handler if error raised
     */
    private errHandler;
    /**
     * All middlewares
     */
    private plugins;
    /**
     * The server
     */
    private server;
    /**
     * The port
     */
    readonly port: number;
    /**
     * The hostname
     */
    readonly hostname: string;
    /**
     * @param options server options
     */
    constructor(options?: ServerOptions);
    /**
     * @param fn an error handler
     */
    onError: (fn: (err: Error) => void) => this;
    /**
     * @returns The server after starting
     */
    start: () => Promise<NodeServer>;
    /**
     * @returns The server after being stopped
     */
    stop: () => Promise<NodeServer>;
    /**
     * @param route the route name
     * @param listener the route listener
     * @returns this server
     */
    register: (route: string, listener: (req: http.IncomingMessage, res: http.ServerResponse, raise: (err: Error) => void) => Promise<void> | void) => this;
    /**
     * @description Middlewares
     * @returns {NodeServer} this server
     */
    use: (...listener: ((req: http.IncomingMessage, res: http.ServerResponse, raise: (err: any) => void) => Promise<void> | void)[]) => NodeServer;
    /**
     * @returns the callback of this server
     */
    callback: () => (req: http.IncomingMessage, res: http.ServerResponse) => Promise<void>;
}
