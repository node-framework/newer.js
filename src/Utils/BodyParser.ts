import http from "http";
import qs from "query-string";

// Try parse to JSON
function tryParseJSON(body: string): object {
    try {
        return JSON.parse(body);
    } catch (e) {
        return;
    }
}

// Get the body of a request
export const getBody = async (req: http.IncomingMessage): Promise<object> =>
    new Promise((res, rej) => {
        let body = '';
        req.on('data', data => {
            body += data;
            if (body.length > 1e7) {
                req.socket.destroy();
                rej("Request data to long");
            }
        });
        req.on('end', () => res(
            tryParseJSON(body) ?? qs.parse(body)
        ));
    });

// Get query of an URL
export const getQuery = (url: string) => {
    // Result
    const res = {};

    // Get the query
    new URLSearchParams(url.split("?")[1])
        .forEach((value, key) => res[key] = value);

    // Return the query
    return res;
};