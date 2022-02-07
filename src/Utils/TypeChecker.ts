/**
 * @param obj 
 * @returns the wrapper of the input object type
 */
export const getWrapper =
    (obj: any): StringConstructor | NumberConstructor | BooleanConstructor | ObjectConstructor => {
        if (typeof obj === 'string')
            return String;
        if (typeof obj === 'number')
            return Number;
        if (typeof obj === 'boolean')
            return Boolean;
        if (typeof obj === 'object')
            return Object;
        throw new Error("Invalid type");
    }
/**
* @param {any | object} type 
* @param {any | object} obj 
*/
export const checkType = (type: any | object, obj: any | object) => {
    let Wrapper = getWrapper(obj);
    if (typeof type === 'function')
        return (Wrapper === type);
    for (let e in type) {
        if (!checkType(type[e], obj[e])) return false;
    }
    return true;
}

/**
* @param schema generate a class to check type from
* @returns a class to check type
*/
export const typeChecker = (schema: object) => class {
    constructor(obj: object) {
        for (const e in schema) {
            if (!checkType(schema[e], obj[e]))
                throw new Error("Invalid object");
        }
        for (const e in obj) {
            if (!checkType(schema[e], obj[e]))
                throw new Error("Invalid object");
        }
        return obj;
    }
}