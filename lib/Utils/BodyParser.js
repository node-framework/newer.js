"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getQuery = exports.getBody = void 0;
const query_string_1 = __importDefault(require("query-string"));
// Get the body of a request
const getBody = async (req) => new Promise((res, rej) => {
    let body = '';
    req.on('data', data => {
        body += data;
        if (body.length > 1e7) {
            req.socket.destroy();
            rej("Request data to long");
        }
    });
    req.on('end', () => res(query_string_1.default.parse(body)));
});
exports.getBody = getBody;
// Get query of an URL
const getQuery = (url) => {
    // Result
    const res = {};
    // Get the query
    new URLSearchParams(url.split("?")[1])
        .forEach((value, key) => res[key] = value);
    // Return the query
    return res;
};
exports.getQuery = getQuery;
