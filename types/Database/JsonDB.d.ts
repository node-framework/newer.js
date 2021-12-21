/**
 * Schema type
 */
export declare type Schema = {
    new (obj: object): {
        save: () => Promise<object>;
        del: () => Promise<object>;
        update: (obj: object) => Promise<object>;
    };
    read: () => Promise<any[]>;
    match: (obj: object) => boolean;
    schem: string;
    find: (obj?: object, except?: boolean) => Promise<any[]>;
    findOne: (obj?: object, except?: boolean) => Promise<any>;
    clear: () => Promise<void>;
    deleteMatch: (obj?: object, except?: boolean) => Promise<void>;
    docs: object[];
};
export default class JsonDB {
    #private;
    /**
     * @param filePaths file paths to join into 1 path
     * @constructor
     */
    constructor(...filePaths: string[]);
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
//# sourceMappingURL=JsonDB.d.ts.map