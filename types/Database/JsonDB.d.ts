/**
 * @typedef {({ new (obj: object): { save: () => Promise<object>; del: () => Promise<object>;}, read: () => Promise<any[]>, match: (obj: object) => boolean, schem: string, find: (obj?: object, except?: boolean) => Promise<any[]>, findOne: (obj?: object, except?: boolean) => Promise<any>, clear: () => Promise<void>, deleteMatch: (obj?: object, except?: boolean) => Promise<void> })} Schema
 */
export default class JsonDB {
    /**
     * @param {string[]} filePaths
     */
    constructor(...filePaths: string[]);
    /**
     * @type {string}
     */
    get filePath(): string;
    /**
     * @param {object} schem
     * @param {string} name
     */
    schema: (name: string, schem?: object) => Schema;
    /**
     * @returns {Promise<void>}
     */
    clear: () => Promise<void>;
    /**
     * @param {Schema} schema
     */
    drop: (schema: Schema) => Promise<void>;
    #private;
}
export type Schema = {
    new (obj: object): {
        save: () => Promise<object>;
        del: () => Promise<object>;
    };
    read: () => Promise<any[]>;
    match: (obj: object) => boolean;
    schem: string;
    find: (obj?: object, except?: boolean) => Promise<any[]>;
    findOne: (obj?: object, except?: boolean) => Promise<any>;
    clear: () => Promise<void>;
    deleteMatch: (obj?: object, except?: boolean) => Promise<void>;
};
//# sourceMappingURL=JsonDB.d.ts.map