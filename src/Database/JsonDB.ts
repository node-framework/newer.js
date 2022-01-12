import * as fs from "fs";
import EventEmitter from "events";

const pfs = fs.promises;

/**
 * @param obj 
 * @returns the wrapper of the input object type
 */
const getWrapper =
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
const match = (obj1: object, obj2: object) => {
    for (let i in obj1)
        if (obj1[i] !== obj2[i])
            return false;
    return true;
}
/**
 * @param {any | object} type 
 * @param {any | object} obj 
 */
const checkType = (type: any | object, obj: any | object) => {
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
const typeChecker = (schema: object) => class {
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

/**
 * @param obj input object to load schema from
 * @returns the loaded schema
 */
const getSchemFrom = (obj: object): object => {
    let schem = {};
    for (let i in obj)
        schem[i] = (  
            getWrapper(obj[i]) !== Object
                ? getWrapper
                : getSchemFrom
        )(obj[i]);
    return schem;
}

/**
 * Schema instance
 * Result after calling new Schema(obj: object)
 */
export type SchemaInstance = {
    save: () => Promise<object>;
    del: () => Promise<object>;
    update: (obj: object) => Promise<object>;
}

/**
 * Database events
 */
export type DBEvents = "save-item" | "update-item" | "delete-item" |
    "clear-schema" | "clear-database" |
    "drop-database" | "drop-schema"

/**
 * Schema type
 */
export type Schema = {
    new(obj: object): SchemaInstance,
    read: () => object[],
    match: (obj: object) => boolean,
    schem: string,
    find: (obj?: object, count?: number, except?: boolean) => Promise<object[] | object>,
    create: (...obj: object[]) => SchemaInstance[];
    update: (obj: object, updateObj: object) => Promise<object>,
    clear: () => Promise<void>,
    deleteMatch: (obj?: object, except?: boolean) => Promise<void>,
    drop: () => Promise<void>
}

export default class JsonDB {
    private events: EventEmitter;
    /**
     * Database data
     */
    private data: {
        [name: string]: object[]
    };
    /**
     * Database schemas
     */
    private schemas: {
        name: string; schem: Schema;
    }[];
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
    constructor(filePath: string, reviver?: (key: string, value: any) => any) {
        // create new event emitter
        this.events = new EventEmitter();
        // set file path
        this.filePath = filePath;
        // List of schemas
        this.schemas = [];
        // Reviver
        this.reviver = reviver;
        const readerData = fs.readFileSync(filePath).toString();
        // Check whether file path exists
        if (!fs.existsSync(filePath))
            fs.appendFileSync(filePath, "{}");
        // Check whether file path exists then if not return this object
        if (!fs.existsSync(filePath) || (readerData === "{}")) {
            this.data = {};
            return this;
        }
        // Set data
        this.data = JSON.parse(readerData, reviver);
        // Set data after load the schema
        this.data = this.loadSchemas(
            JSON.parse(readerData, reviver)
        );
        // Weird thing happens here so I need to fix by using the next line
        fs.writeFileSync(filePath, JSON.stringify(this.data, null, 4));
    }

    /**
     * @param event to handle
     * @param listener to handle event
     */
    on = (event: DBEvents, listener: (...args: any[]) => void) =>
        void this.events.on(event, listener);

    /**
     * @param data loaded data
     * @returns current data after loading all the schemas
     */
    private loadSchemas = (data: {
        [name: string]: object[];
    }): {
        [name: string]: object[]
    } => {
        for (let schemName in data)
            if (data[schemName][0]) {
                let schem = getSchemFrom(data[schemName][0]);
                if (schem !== {})
                    this.schema(schemName, schem);
            }
        return data;
    }
    /**
     * @param name Schema name
     * @param schem Schema model
     * @returns the created schema
     */
    schema = (name: string, schem?: object): Schema => {
        if (!schem)
            return this.schemas.filter(val => val?.name === name)[0]?.schem ?? undefined;
        // This database file path
        const pth = this.filePath;
        // Check whether schema exists
        if (this.schemas.map((val) => val.name).includes(name))
            return this.schemas.filter(val => val.name === name)[0].schem;
        // Reference to this object
        const pointer = this;
        // Initialize the schema docs array with an empty one
        this.data[name] = [];
        // Create a type checker
        const SchemaObject = typeChecker(schem);
        // Write the created array to database file
        fs.writeFileSync(pth, JSON.stringify(this.data, null, 4));
        // Create a class to use to manipulate the schema
        let sch = class Schema {
            /**
             * Current object
             */
            private obj: object;
            /**
             * @param obj to manipulate
             */
            constructor(obj: object) {
                this.obj = new SchemaObject(obj);
            }
            /**
             * @returns the object after saving it to the database
             */
            save = async (): Promise<object> => {
                pointer.data[Schema.schem].push(this.obj);
                await pfs.writeFile(pth, JSON.stringify(pointer.data, null, 4));
                pointer.events.emit("save-item", this.obj);
                return pointer.data;
            }
            /**
             * @returns the data after deleting
             */
            del = async (): Promise<object> => {
                let ref = pointer.data[Schema.schem];
                ref.splice(ref.indexOf(this.obj), 1);
                await pfs.writeFile(pth, JSON.stringify(pointer.data, null, 4));
                pointer.events.emit("delete-item");
                this.obj = undefined;
                return pointer.data;
            }
            /**
             * @param obj 
             * @returns the object after updating
             */
            update = async (obj: object): Promise<object> => {
                // Check whether obj matches given schema
                for (const e in schem) {
                    if (!checkType(schem[e], obj[e]))
                        throw new Error("Invalid object");
                }
                for (const e in obj) {
                    if (!checkType(schem[e], obj[e]))
                        throw new Error("Invalid object");
                }
                // Assign it to current object position
                pointer.data[Schema.schem][
                    pointer.data[Schema.schem]
                        .indexOf(this.obj)
                ] = obj;
                await pfs.writeFile(pth, JSON.stringify(pointer.data, null, 4));
                this.obj = obj;
                pointer.events.emit("update-item", this.obj);
                return obj;
            }
            /**
             * @returns all docs of the schema
             */
            static read = (): object[] =>
                pointer.data[Schema.schem];
            /**
             * @param obj to create
             * @returns created schema docs
             */
            static create = (...obj: object[]): Schema[] => obj.map(e => new Schema(e));
            /**
             * @param obj to update
             * @param updateObj after update
             */
            static update = async (obj: object, updateObj: object): Promise<object> => {
                const index = pointer.data[Schema.schem].indexOf(obj);
                if (!index)
                    throw new Error("Invalid object");
                pointer.data[Schema.schem][index] = updateObj;
                await pfs.writeFile(pth, JSON.stringify(pointer.data, null, 4));
                pointer.events.emit("update-item", updateObj);
                return updateObj;
            }
            /**
             * @param obj 
             * @returns true if object matches current schema
             */
            static match = (obj: object): boolean => {
                for (const e in schem) {
                    if (!checkType(schem[e], obj[e]))
                        return false;
                }
                return true;
            }
            /**
             * @returns {string} this schema name
             */
            static get schem(): string {
                return name;
            }
            /**
             * @param obj to find
             * @param except if true will find objects that don't match `obj`
             * @param count objects to be returned
             * @returns the result
             */
            static find = async (obj?: object, count?: number, except?: boolean): Promise<object[] | object> => {
                let listMatch = [];
                for (let doc of JSON.parse(
                    (await pfs.readFile(pth)).toString(),
                    pointer.reviver
                )[Schema.schem]) {
                    // Check if object matches
                    if (match(obj ?? {}, doc) === (!except)) {
                        // Check whether count != 0
                        if (count === 0)
                            break;
                        // Check whether count > 0 then minus count by 1
                        if (count && count > 0)
                            count--;
                        // Add element to list
                        listMatch.push(doc);
                    }
                }
                return listMatch.length === 1 ? listMatch[0] : listMatch;
            }
            /**
             * Clear the schema
             */
            static clear = async (): Promise<void> => {
                pointer.data[Schema.schem] = [];
                await pfs.writeFile(pth, JSON.stringify(pointer.data, null, 4));
                pointer.events.emit("clear-schema");
            }
            /**
             * @param obj to delete
             * @param except if true will delete objects that don't match `obj`
             */
            static deleteMatch = async (obj?: object, except: boolean = false): Promise<void> => {
                let schem = pointer.data[Schema.schem];
                if (obj)
                    for (let i in obj)
                        schem = schem.filter(
                            (val: { [x: string]: any; }) =>
                                (val[i] !== obj[i]) !== except
                        );
                else
                    schem = [];
                pointer.data[Schema.schem] = schem;
                pointer.events.emit("delete-item");
                await pfs.writeFile(pth, JSON.stringify(pointer.data, null, 4));
            }
            /**
             * Drop the schema and all schema docs
             */
            static drop = async () =>
                await pointer.drop(Schema);
        }
        pointer.schemas.push({
            name: name,
            schem: sch
        });
        return sch;
    }
    /**
     * @returns a promise after clearing the database
     */
    clear = async (): Promise<void> => (
        this.data = {},
        await pfs.writeFile(this.filePath, "{}"),
        void this.events.emit("clear-database")
    )
    /**
     * @param schema setting it to a falsy value (such as undefined) will delete the whole database (which makes this object unusable)
     */
    drop = async (schema?: Schema | string): Promise<void> => {
        if (!schema) {
            await pfs.unlink(this.filePath);
            this.data = undefined;
            // Emit event
            this.events.emit("drop-database");
        } else {
            let schemName = typeof schema === 'function'
                ? schema.schem
                : schema;
            const {
                [schemName]: _,
                ...rest
            } = this.data;
            this.data = rest;
            // Filter the schema out of the data
            this.schemas = this.schemas.filter(val => val.name !== schemName);
            // Override the current data
            await pfs.writeFile(this.filePath, JSON.stringify(this.data));
            // Emit event
            this.events.emit('drop-schema');
        }
    }
}