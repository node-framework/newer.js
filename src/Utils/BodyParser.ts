import http from "http";

// Try parse to JSON
function tryParseJSON(body: string): object {
    try {
        return JSON.parse(body);
    } catch (e) {
        return;
    }
}

// Try parse to URLSearchParams
function tryParseQuery(body: string): { [key: string]: string } {
    const result: { [key: string]: string } = {};
    for (const key of body.split("&")) {
        if (!key)
            continue;
        const [k = key, v = ""] = key.split("=");
        result[k] = v;
    }
    return result;
}

// Get the body of a request
export const getBody = async (req: http.IncomingMessage): Promise<any> =>
    new Promise((res, rej) => {
        let body = '';
        req.on('data', data => {
            body += data;
            if (body.length > 1e7) {
                req.socket.destroy();
                rej("Request data to long");
            }
        });
        req.on('end', () => {
            const parsed =
                tryParseJSON(body)
                ?? tryParseQuery(body)
                ?? body;
            res(parsed);
        });
    });

// Get query of an URL
export const getQuery = (url: string): { [key: string]: string } => {
    return tryParseQuery(url.split("?")[1]);
};