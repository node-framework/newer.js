"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.serialize = exports.parse = void 0;
/**
 * Module variables.
 * @private
 */
const decode = decodeURIComponent, encode = encodeURIComponent;
/**
 * RegExp to match field-content in RFC 7230 sec 3.2
 *
 * field-content = field-vchar [ 1*( SP / HTAB ) field-vchar ]
 * field-vchar   = VCHAR / obs-text
 * obs-text      = %x80-FF
 */
let fieldContentRegExp = /^[\u0009\u0020-\u007e\u0080-\u00ff]+$/;
/**
 * Parse a cookie header.
 *
 * Parse the given cookie header string into an object
 * The object has the various cookies as keys(names) => values
 *
 * @param {string} str
 * @param {object} [options]
 * @return {object}
 * @public
 */
function parse(str, options) {
    if (typeof str !== 'string')
        throw new TypeError('argument str must be a string');
    let obj = {};
    // @ts-ignore
    let opt = options || {};
    let pairs = str.split(';');
    // @ts-ignore
    let dec = opt.decode || decode;
    for (let i = 0; i < pairs.length; i++) {
        let pair = pairs[i];
        let index = pair.indexOf('=');
        // skip things that don't look like key=value
        if (index < 0)
            continue;
        let key = pair.substring(0, index).trim();
        // only assign once
        if (undefined == obj[key]) {
            let val = pair.substring(index + 1, pair.length).trim();
            // quoted values
            if (val[0] === '"')
                val = val.slice(1, -1);
            obj[key] = tryDecode(val, dec);
        }
    }
    return obj;
}
exports.parse = parse;
/**
 * Serialize data into a cookie header.
 *
 * Serialize the a name value pair into a cookie string suitable for
 * http headers. An optional options object specified cookie parameters.
 *
 * serialize('foo', 'bar', { httpOnly: true })
 *   => "foo=bar; httpOnly"
 *
 * @param {string} name
 * @param {string} val
 * @param {object} [options]
 * @return {string}
 * @public
 */
function serialize(name, val, options) {
    // @ts-ignore
    let opt = options || {};
    let enc = opt.encode || encode;
    if (typeof enc !== 'function')
        throw new TypeError('option encode is invalid');
    if (!fieldContentRegExp.test(name))
        throw new TypeError('argument name is invalid');
    let value = enc(val);
    if (value && !fieldContentRegExp.test(value))
        throw new TypeError('argument val is invalid');
    let str = name + '=' + value;
    if (null != opt.maxAge) {
        let maxAge = opt.maxAge - 0;
        if (isNaN(maxAge) || !isFinite(maxAge))
            throw new TypeError('option maxAge is invalid');
        str += '; Max-Age=' + Math.floor(maxAge);
    }
    if (opt.domain) {
        if (!fieldContentRegExp.test(opt.domain))
            throw new TypeError('option domain is invalid');
        str += '; Domain=' + opt.domain;
    }
    if (opt.path) {
        if (!fieldContentRegExp.test(opt.path))
            throw new TypeError('option path is invalid');
        str += '; Path=' + opt.path;
    }
    if (opt.expires) {
        if (typeof opt.expires.toUTCString !== 'function')
            throw new TypeError('option expires is invalid');
        str += '; Expires=' + opt.expires.toUTCString();
    }
    if (opt.httpOnly)
        str += '; HttpOnly';
    if (opt.secure)
        str += '; Secure';
    if (opt.sameSite) {
        const sameSite = typeof opt.sameSite === 'string'
            ? opt.sameSite.toLowerCase() : opt.sameSite;
        switch (sameSite) {
            case true:
                str += '; SameSite=Strict';
                break;
            case 'lax':
                str += '; SameSite=Lax';
                break;
            case 'strict':
                str += '; SameSite=Strict';
                break;
            case 'none':
                str += '; SameSite=None';
                break;
            default:
                throw new TypeError('option sameSite is invalid');
        }
    }
    return str;
}
exports.serialize = serialize;
/**
 * Try decoding a string using a decoding function.
 *
 * @param {string} str
 * @param {Function} decode
 * @private
 */
function tryDecode(str, decode) {
    try {
        return decode(str);
    }
    catch (e) {
        return str;
    }
}
