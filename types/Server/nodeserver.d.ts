/// <reference types="node" />
import http from "http";
export default class NodeServer {
    #private;
    routes: {
        [route: string]: (req: http.IncomingMessage, res: http.ServerResponse) => Promise<void> | void;
    };
    plugins: ((req: http.IncomingMessage, res: http.ServerResponse, server: NodeServer) => Promise<void> | void)[];
    port: number;
    hostname: string;
    staticPath: string;
    constructor({ port, hostname }?: {
        port?: number;
        hostname?: string;
    });
    start: () => Promise<NodeServer>;
    stop: () => Promise<NodeServer>;
    register: (route: string, listener: (req: http.IncomingMessage, res: http.ServerResponse) => Promise<void> | void) => this;
    use: (...listener: ((req: http.IncomingMessage, res: http.ServerResponse, server: NodeServer) => Promise<void> | void)[]) => NodeServer;
    useStaticPath: (pathname: string) => NodeServer;
    callback: () => (req: http.IncomingMessage, res: http.ServerResponse) => Promise<void>;
}
//# sourceMappingURL=nodeserver.d.ts.map