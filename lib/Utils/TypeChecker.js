"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.typeChecker = exports.checkType = exports.getWrapper = void 0;
/**
 * @param obj
 * @returns the wrapper of the input object type
 */
const getWrapper = (obj) => {
    if (typeof obj === 'string')
        return String;
    if (typeof obj === 'number')
        return Number;
    if (typeof obj === 'boolean')
        return Boolean;
    if (typeof obj === 'object')
        return Object;
    return obj;
};
exports.getWrapper = getWrapper;
/**
* @param {any | object} type
* @param {any | object} obj
*/
const checkType = (type, obj) => {
    const Wrapper = (0, exports.getWrapper)(obj);
    if (typeof type === 'function')
        return Wrapper === type;
    for (let e in type)
        if (!(0, exports.checkType)(type[e], obj[e]))
            return false;
    return true;
};
exports.checkType = checkType;
/**
* @param schema generate a class to check type from
* @returns a class to check type
*/
const typeChecker = (schema) => class {
    constructor(obj) {
        for (const e in schema)
            if (!(0, exports.checkType)(schema[e], obj[e]))
                throw new Error("Invalid object");
        for (const e in obj)
            if (!(0, exports.checkType)(schema[e], obj[e]))
                throw new Error("Invalid object");
        return obj;
    }
};
exports.typeChecker = typeChecker;
