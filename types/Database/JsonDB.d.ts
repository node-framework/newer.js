/**
 * Schema instance
 * Result after calling new Schema(obj: object)
 */
export declare type SchemaInstance = {
    save: () => Promise<object>;
    del: () => Promise<object>;
    update: (obj: object) => Promise<object>;
};
/**
 * Schema type
 */
export declare type Schema = {
    new (obj: object): SchemaInstance;
    read: () => Promise<any[]>;
    match: (obj: object) => boolean;
    schem: string;
    find: (obj?: object, except?: boolean) => Promise<any[]>;
    findOne: (obj?: object, except?: boolean) => Promise<any>;
    create: (...obj: object[]) => SchemaInstance[];
    update: (obj: object, updateObj: object) => Promise<object>;
    clear: () => Promise<void>;
    deleteMatch: (obj?: object, except?: boolean) => Promise<void>;
};
export default class JsonDB {
    #private;
    /**
     * @param filePath file path
     * @param reviver to restore objects from a string that is parsed using JSON.parse
     * @constructor
     */
    constructor(filePath: string);
    /**
     * Returns the current database paths
     */
    get filePath(): string;
    /**
     * @param name Schema name
     * @param schem Schema model
     * @returns the created schema
     */
    schema: (name: string, schem?: object) => Schema;
    /**
     * @returns a promise after clearing the database
     */
    clear: () => Promise<void>;
    /**
     * @param schema setting it to a falsy value (such as undefined) will delete the whole database (which makes this object unusable)
     */
    drop: (schema?: Schema | string) => Promise<void>;
}
