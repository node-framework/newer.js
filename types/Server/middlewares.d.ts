/// <reference types="node" />
import qs from "query-string";
import http from "http";
declare const _default: {
    queryParser: (req: http.IncomingMessage) => {
        [k: string]: string;
    };
    bodyParser: (req: http.IncomingMessage) => Promise<qs.ParsedQuery<string>>;
};
export default _default;
