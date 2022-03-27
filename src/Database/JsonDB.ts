import add from "../Utils/Compiler/add";
import clear from "../Utils/Compiler/clear";
import remove from "../Utils/Compiler/remove";
import * as fs from "fs";
import { Schema, SchemaType } from "../declarations";
import compare from "../Utils/ObjectCompare";
import match from "../Utils/ObjectMatch";
import drop from "../Utils/Compiler/drop";
import get from "../Utils/Compiler/get";
import rmDuplicates from "../Utils/RmDuplicates";

// Email regex
const emailRegex = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/;
const ipRegex = /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;


// Execute the .action file
async function* exec(query: string, db: JsonDB, reviver: (key: string, value: any) => any) {
    const lines: string[] = query
        // Remove comments
        .split("\n")
        .map(line => line.startsWith("#") ? "" : line)
        .reduce(
            (prevLine, currentLine) =>
                prevLine + "\n" + currentLine
        )

        // Replace all the new lines and tabs
        .replaceAll("\n", "")
        .replaceAll("\t", "")
        .replaceAll("\r", "")
        .replaceAll("    ", "")

        // End statement
        .split(";");

    // Actions
    for (const line of lines) {
        if (line.startsWith("get"))
            yield get(line, db, reviver);

        // Insert
        if (line.startsWith("add"))
            yield add(line, db, reviver);

        // Delete
        else if (line.startsWith("remove"))
            yield remove(line, db, reviver);

        // Clear
        else if (line.startsWith("clear"))
            yield clear(line, db);

        // Drop
        else if (line.startsWith("drop"))
            yield drop(line, db);
    }
}

/**
 * Promise version of FS
 */
const pfs = fs.promises;

export default class JsonDB {
    // Save the previous object
    private cache: {
        [schemaName: string]: any[];
    };

    // Schemas
    private schemas: {
        [name: string]: Schema
    }

    // Reviver
    private reviver: (key: string, value: any) => any;

    constructor(
        public path: string,
        revivers: {
            [prop: string]:
            (value: any) => any
        } = {}
    ) {
        // Check if file exists
        if (!fs.existsSync(path) || fs.readFileSync(path).toString() === "")
            fs.appendFileSync(path, "{}");

        // Reviver function
        const reviver = (key: string, value: any) => {
            // Check if the value is a reviver
            if (revivers[key])
                return revivers[key](value);

            // Return the value
            return value;
        }

        // Save the object
        this.cache = JSON.parse(fs.readFileSync(path).toString(), reviver);

        // Set the reviver property
        this.reviver = reviver;

        // Schemas
        this.schemas = {};
    }

    /**
     * @param validator 
     * @param obj 
     */
    private checkType(
        validator: { [key: string | number | symbol]: SchemaType } | SchemaType | SchemaType[],
        obj: any,
        propName: string = ""
    ) {
        // Check whether the validator is an array
        if (Array.isArray(validator)) {
            // Check whether the array size is enough
            if (obj.length % validator.length !== 0)
                throw new TypeError("The " + propName + " array size is not enough for validation");

            // Validate array elements
            for (const index in obj)
                this.checkType(
                    validator[Number(index) % validator.length],
                    obj[index],
                    propName + "[" + index + "]"
                );
        }

        // Check whether the validator is an object
        else if (typeof validator === 'object')
            // Check type of properties    
            for (const prop in validator)
                this.checkType(validator[prop], obj[prop], propName + "['" + prop + "']");

        // If validator is a function
        else if (!validator || !validator(obj))
            throw new TypeError(`Invalid type of ${propName ?? obj}`);
    }

    /**
     * Create a schema
     * @param name 
     * @param validator 
     * @returns a schema
     */
    schema(name: string, validator?: { [prop: string]: SchemaType } | SchemaType): Schema {
        // Check if schema validator exists
        if (!validator)
            return this.schemas[name];

        // Create a new schema if it does not exist
        if (!this.cache[name])
            this.cache[name] = [];

        // Create a new schema
        const ptr = this, CurrentSchema = class {
            // Constructor
            constructor(public obj: any) {
                ptr.checkType(validator, obj);
            }

            // New object
            static new(obj: any) {
                return new CurrentSchema(obj);
            }

            // Read the schema from the database
            static read() {
                return ptr.cache[name];
            }

            // Create new schema instances
            static create(...obj: any[]) {
                return obj.map(CurrentSchema.new);
            }

            // Clear the schema
            static async clear() {
                // Remove the schema objects from the cache
                ptr.cache[name] = [];

                // Write the cache to the file
                return pfs.writeFile(ptr.path, JSON.stringify(ptr.cache));
            }

            // Match
            static find(obj?: any, count?: number, except?: boolean) {
                // Result
                const result = [];

                // Search the cache
                for (const schemObj of ptr.cache[name]) {
                    // Check whether the result is enough
                    if (count && result.length >= count)
                        break;

                    // Add the object to the result if matches
                    if (match(obj, schemObj) !== !!except)
                        result.push(schemObj);
                }

                // Return the result
                return result;
            }

            // Find one
            static findOne(obj?: any, except?: boolean) {
                return CurrentSchema.find(obj, 1, except)[0];
            }

            // Update the object
            static async update(obj: any, updateObj: any) {
                // Remove the object from cache
                ptr.cache[name] = ptr.cache[name].filter(o => !compare(o, obj));

                // Add the updated object to cache
                ptr.cache[name].push(updateObj);

                // Write the cache to the file
                return pfs.writeFile(ptr.path, JSON.stringify(ptr.cache));
            }

            // Find the object in the database and delete it
            static async deleteMatch(obj?: any, except?: boolean) {
                // Remove the object from cache
                ptr.cache[name] = ptr.cache[name].filter(o => match(obj, o) === !!except);

                // Write the cache to the file
                return pfs.writeFile(ptr.path, JSON.stringify(ptr.cache));
            }

            // Drop the schema
            static async drop() {
                // Remove the schema from cache
                delete ptr.schemas[name];
                delete ptr.cache[name];

                // Write the cache to the file
                return pfs.writeFile(ptr.path, JSON.stringify(ptr.cache));
            }

            // Remove duplicates
            static async rmDups() {
                // Remove duplicates
                rmDuplicates(ptr.cache[name]);

                // Save
                return pfs.writeFile(ptr.path, JSON.stringify(ptr.cache));
            }

            // Save the created object to the database
            async save() {
                // Save the object to cache
                ptr.cache[name].push(this.obj);

                // Write the cache to the file
                await pfs.writeFile(ptr.path, JSON.stringify(ptr.cache));

                // Return the object
                return this.obj;
            }
        }

        // Check whether the object in the collection matches the schema
        this.cache[name].forEach(obj => new CurrentSchema(obj));

        // Save the schema
        this.schemas[name] = CurrentSchema;

        // Return the schema
        return CurrentSchema;
    }

    /**
     * Check whether the object is a number
     * @param obj 
     */
    static Number(obj: any): boolean {
        return typeof obj === "number" || obj instanceof Number;
    }

    /**
     * Check whether the object is a string
     * @param obj 
     */
    static String(obj: any): boolean {
        return typeof obj === "string" || obj instanceof String;
    }

    /**
     * Type any
     */
    static Any(_: any): boolean {
        return true;
    }

    /**
     * Check whether the object is a boolean
     * @param obj 
     */
    static Boolean(obj: any): boolean {
        return typeof obj === "boolean" || obj instanceof Boolean;
    }

    /**
     * Check whether the object is an instance of Date
     * @param obj 
     * @returns 
     */
    static Date(obj: any): boolean {
        return obj instanceof Date;
    }

    /**
     * Check whether the object matches the email regex
     * @param obj 
     */
    static Email(obj: any): boolean {
        // When the constructor is called as a type checker
        return (typeof obj === 'string' || obj instanceof String)
            && emailRegex.test(obj.toString());
    }

    /**
     * Check whether the object is an instance of URL
     * @param obj 
     */
    static URL(obj: any): boolean {
        return obj instanceof URL;
    }

    /**
     * Check whether the object is a string and matches the IP regex
     * @param obj 
     */
    static IP(obj: any): boolean {
        return typeof obj === "string" && ipRegex.test(obj);
    }

    /**
     * Create a type based on the constructor
     * @param C The constructor or a type name
     */
    static typeof(C: new (...args: any[]) => any | "number" | "string" | "object" | "function" | "symbol" | "bigint" | "boolean" | "undefined"): SchemaType {
        return (obj: any) =>
            typeof C === "string"
                ? typeof obj === C
                : obj instanceof C;
    }

    /**
     * Change validator to optional
     * @param type The type validator
     */
    static optional(type: SchemaType): SchemaType {
        return (obj: any) =>
            type(obj) || obj === undefined || obj === null;
    }

    /**
     * Create a type that matches any of the types
     * @param types The types to check
     */
    static or(...types: SchemaType[]): SchemaType {
        return (obj: any) => {
            // No type provided
            if (types.length === 0)
                throw new Error("No types specified");

            // If one type specified
            if (types.length === 1)
                return types[0](obj);

            // Or 
            return types[0](obj) || this.or(...types.slice(1))(obj);
        }
    }

    /**
     * Create a type that matches all of the types
     * @param types The types to check
     */
    static and(...types: SchemaType[]): SchemaType {
        return (obj: any) => {
            // No type provided
            if (types.length === 0)
                throw new Error("No types specified");

            // If one type specified
            if (types.length === 1)
                return types[0](obj);

            // And
            return types[0](obj) && this.and(...types.slice(1))(obj);
        }
    }

    /**
     * Delete the database
     */
    async drop() {
        // Delete the file
        await pfs.unlink(this.path);

        // Delete all the properties
        for (const prop in this)
            delete this[prop];
    }

    /**
     * Clear the database
     */
    async clear() {
        // Clear the file
        await pfs.writeFile(this.path, "{}");

        // Cache
        this.cache = {};
    }

    /**
     * Run a JSON Query language file
     */
    run(filename: string) {
        // Run the query
        return exec(
            fs.readFileSync(filename).toString(),
            this,
            this.reviver
        );
    }

    /**
     * Execute a query
     * @param query The query
     * @returns undefined after execution
     */
    query(query: string) {
        return exec(query, this, this.reviver);
    }
}