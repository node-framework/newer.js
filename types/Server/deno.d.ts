/// <reference types="node" />
import https from "https";
import http from "http";
export default class Server {
    readonly server: http.Server | https.Server;
    private done;
    constructor(options?: http.ServerOptions | https.ServerOptions, httpsMode?: boolean);
    listen(port?: number, hostname?: string, backlog?: number): void;
    requests(): {
        [Symbol.asyncIterator](): {
            next(): Promise<{
                done: boolean;
                value: {
                    request: http.IncomingMessage;
                    response: http.ServerResponse;
                };
            }>;
        };
    };
    close(): void;
}
