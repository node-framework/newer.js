import { Schema, DBEvents } from "../declarations.js";
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
