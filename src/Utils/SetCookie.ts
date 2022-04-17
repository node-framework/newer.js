import { Context } from "../declarations";
import http from "http";
import { serialize } from "../Utils/Cookie";

export default function setCookie(c: Context, res: http.ServerResponse) {
    // Set cookie
    if (c.cookie) {
        const options = {};
        for (const option of ["maxAge", "expires", "path", "domain", "secure", "httpOnly", "sameSite", "encode", "decode"]) {
            const val = c.cookie[option];
            if (val)
                options[option] = val;
        }
        const newCookie = serialize("props", JSON.stringify(c.cookie), options);
        res.setHeader("Set-Cookie", newCookie);
    }
}