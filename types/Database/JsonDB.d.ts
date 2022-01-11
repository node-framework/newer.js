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
 * Database events 
 */
export declare type DBEvents = "save-item" | "update-item" | "delete-item" | "clear-schema" | "clear-database" | "drop-database" | "drop-schema";
/**
 * Schema type
 */
export declare type Schema = {
    new (obj: object): SchemaInstance;
    read: () => object[];
    match: (obj: object) => boolean;
    schem: string;
    find: (obj?: object, count?: number, except?: boolean) => Promise<object[] | object>;
    create: (...obj: object[]) => SchemaInstance[];
    update: (obj: object, updateObj: object) => Promise<object>;
    clear: () => Promise<void>;
    deleteMatch: (obj?: object, except?: boolean) => Promise<void>;
    drop: () => Promise<void>;
};
export default class JsonDB {
    private events;
    /**
     * Database data
     */
    private data;
    /**
     * Database schemas
     */
    private schemas;
    /**
     * Database path
     */
    readonly filePath: string;
    /**
     * Reviver
     */
    readonly reviver: (key: string, value: any) => any;
    /**
     * @param filePath file path
     * @param reviver to restore objects from a string that is parsed using JSON.parse
     * @constructor
     */
    constructor(filePath: string, reviver?: (key: string, value: any) => any);
    /**
     * @param event to handle
     * @param listener to handle event
     */
    on: (event: DBEvents, listener: (...args: any[]) => void) => any;
    /**
     * @param data loaded data
     * @returns current data after loading all the schemas
     */
    private loadSchemas;
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
