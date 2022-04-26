import { Context } from "../declarations";
import http from "http";
import cookie from "cookie";

export default function setCookie(c: Context, res: http.ServerResponse) {
    // Set cookie
    if (c.cookie) {
        const options = {};
        for (const option of ["maxAge", "expires", "path", "domain", "secure", "httpOnly", "sameSite", "encode", "decode"]) {
            const val = c.cookie[option];
            if (val)
                options[option] = val;
        }
        const newCookie = cookie.serialize("props", JSON.stringify(c.cookie), options);
        if (!res.headersSent)
            res.setHeader("Set-Cookie", newCookie);
    }
}