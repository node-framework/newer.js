import qs from "query-string";
import http from "http";
export declare const getBody: (req: http.IncomingMessage) => Promise<qs.ParsedQuery>;
export declare const getQuery: (url: string) => {};
