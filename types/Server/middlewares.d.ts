/// <reference types="node" />
import qs from "query-string";
import http from "http";
import NodeServer from "./nodeserver.js";
declare const _default: {
    queryParser: (req: http.IncomingMessage) => {
        [k: string]: string;
    };
    bodyParser: (req: http.IncomingMessage) => Promise<qs.ParsedQuery<string>>;
    renderHTML: (_: any, res: http.ServerResponse, server: NodeServer) => void;
    serveStatic: (home?: string) => (req: http.IncomingMessage, res: http.ServerResponse) => Promise<any>;
};
export default _default;
