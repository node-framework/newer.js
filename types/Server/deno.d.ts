/// <reference types="node" />
import https from "https";
import http from "http";
export interface Simple {
    requests: {
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
    close: () => void;
}
declare const _default: (init: {
    options?: http.ServerOptions | https.ServerOptions;
    port?: number;
    hostname?: string;
    backlog?: number;
    httpsMode?: boolean;
}) => Simple;
export default _default;
