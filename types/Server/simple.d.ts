/// <reference types="node" />
import https from "https";
import http from "http";
import { SimpleOptions } from "./declarations";
/**
 * Create a simple server
 */
export default function simple(opts?: SimpleOptions): {
    /**
     * The simple HTTP or HTTPS server
     */
    readonly server: http.Server | https.Server;
    /**
     * The generator
     */
    [Symbol.asyncIterator](): AsyncGenerator<http.ServerResponse, any, unknown>;
};
