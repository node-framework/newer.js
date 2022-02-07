/**
 * @param obj
 * @returns the wrapper of the input object type
 */
export declare const getWrapper: (obj: any) => StringConstructor | NumberConstructor | BooleanConstructor | ObjectConstructor;
/**
* @param {any | object} type
* @param {any | object} obj
*/
export declare const checkType: (type: any | object, obj: any | object) => boolean;
/**
* @param schema generate a class to check type from
* @returns a class to check type
*/
export declare const typeChecker: (schema: object) => {
    new (obj: object): {};
};
