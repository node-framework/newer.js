/// <reference types="node" />
import http from "http";
import { SimpleOptions } from "./declarations";
/**
 * Create a simple server
 */
export default function simple(opts?: SimpleOptions): AsyncGenerator<http.ServerResponse, any, unknown>;
