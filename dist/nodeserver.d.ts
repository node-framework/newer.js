export default class NodeServer {
    /**
     * @param {{ port?: number, hostname?: string }} param
     */
    constructor({ port, hostname }?: {
        port?: number;
        hostname?: string;
    });
    /**
     * @type {{ [route: string]: (req: import("http").IncomingMessage, res: import("http").ServerResponse) => Promise<void> | void}}
     */
    routes: {
        [route: string]: (req: import("http").IncomingMessage, res: import("http").ServerResponse) => Promise<void> | void;
    };
    /**
     * @type {((req: import("http").IncomingMessage, res: import("http").ServerResponse, server: NodeServer) => Promise<void> | void)[]}
     */
    plugins: ((req: import("http").IncomingMessage, res: import("http").ServerResponse, server: NodeServer) => Promise<void> | void)[];
    /**
     * @type {number}
     */
    port: number;
    /**
     * @type {string}
     */
    hostname: string;
    /**
     * @type {string}
     */
    staticPath: string;
    /**
     * @returns {Promise<NodeServer>}
     */
    start: () => Promise<NodeServer>;
    /**
     * @returns {Promise<NodeServer>}
     */
    stop: () => Promise<NodeServer>;
    /**
     * @param {string} route
     * @param {(req: import("http").IncomingMessage, res: import("http").ServerResponse) => Promise<void> | void} listener
     * @description listener should be asynchronous
     */
    register: (route: string, listener: (req: import("http").IncomingMessage, res: import("http").ServerResponse) => Promise<void> | void) => NodeServer;
    /**
     * @param {...(req: import("http").IncomingMessage, res: import("http").ServerResponse, server: NodeServer) => Promise<void> | void} listener
     * @description Middlewares
     * @returns {NodeServer} this server
     */
    use: (...listener: ((req: import("http").IncomingMessage, res: import("http").ServerResponse, server: NodeServer) => Promise<void> | void)[]) => NodeServer;
    /**
     * @param {string} pathname static path
     * @returns {NodeServer} this server
     */
    useStaticPath: (pathname: string) => NodeServer;
    /**
     * @returns {(req: import("http").IncomingMessage, res: import("http").ServerResponse) => Promise<void>}
     */
    callback: () => (req: import("http").IncomingMessage, res: import("http").ServerResponse) => Promise<void>;
    #private;
}
//# sourceMappingURL=nodeserver.d.mts.map