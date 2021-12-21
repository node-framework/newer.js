export default class NodeServer {
    #private;
    routes: {
        [route: string]: (req: import("http").IncomingMessage, res: import("http").ServerResponse) => Promise<void> | void;
    };
    plugins: ((req: import("http").IncomingMessage, res: import("http").ServerResponse, server: NodeServer) => Promise<void> | void)[];
    port: number;
    hostname: string;
    staticPath: string;
    constructor({ port, hostname }?: {
        port?: number;
        hostname?: string;
    });
    start: () => Promise<NodeServer>;
    stop: () => Promise<NodeServer>;
    register: (route: string, listener: (req: import("http").IncomingMessage, res: import("http").ServerResponse) => Promise<void> | void) => this;
    /**
     * @description Middlewares
     * @returns {NodeServer} this server
     */
    use: (...listener: ((req: import("http").IncomingMessage, res: import("http").ServerResponse, server: NodeServer) => Promise<void> | void)[]) => NodeServer;
    /**
     * @returns {NodeServer} this server
     */
    useStaticPath: (pathname: string) => NodeServer;
    callback: () => (req: import("http").IncomingMessage, res: import("http").ServerResponse) => Promise<void>;
}
//# sourceMappingURL=nodeserver.d.ts.map