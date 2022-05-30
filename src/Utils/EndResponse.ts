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
    res.statusCode = ctx.statusCode ?? 200;
    if (ctx.statusMessage)
        res.statusMessage = ctx.statusMessage;

    // Response in string
    let response: string;

    // Set response
    if (typeof ctx.response === "object") {
        if (
            typeof ctx.response.toString === "function" 
            && !Array.isArray(ctx.response)
            && ctx.response.toString() !== "[object Object]"
        ) 
            response = ctx.response.toString();
        else 
            response = JSON.stringify(ctx.response);
    } else
        response = String(ctx.response);

    // End the response
    if (!res.writableEnded)
        res.end(response);
}