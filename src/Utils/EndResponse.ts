import { Context } from "../declarations";
import http from "http";

export default function endResponse(ctx: Context, res: http.ServerResponse) {
    // Check whether content and status code is set
    if (!ctx.response && !ctx.statusCode) {
        // Set status code to 404
        ctx.statusCode = 404;

        // Set the response
        ctx.response = "Cannot " + ctx.method + " " + ctx.url;
    }

    // Write status code 
    if (!res.headersSent)
        res.writeHead(ctx.statusCode ?? 200);

    // Response in string
    const response = typeof ctx.response === "object"
        ? JSON.stringify(ctx.response)
        : String(ctx.response);

    // End the response
    if (!res.writableEnded)
        res.end(response);
}