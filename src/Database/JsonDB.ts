import * as fs from "fs";
import { Schema, SchemaType } from "../declarations";
import compare from "../Utils/ObjectCompare";
import match from "../Utils/ObjectMatch";
import rmDuplicates from "../Utils/RmDuplicates";
import asyncUtil from "async";

// Email regex
const emailRegex = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/;
const ipRegex = /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;

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
        validator: { [key: string | number | symbol]: SchemaType | SchemaType[] } | SchemaType | SchemaType[],
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
            throw new TypeError(`Invalid type of ${propName !== "" ? propName : obj}`);
    }

    /**
     * Create a collection
     * @param name 
     * @param validator 
     * @returns a collection
     */
    collection(name: string, validator?: { [prop: string | number | symbol]: SchemaType | SchemaType[] } | SchemaType | SchemaType[]): Schema {
        // Check if schema validator exists
        if (!validator)
            return this.schemas[name];

        // Create a new schema if it does not exist
        if (!this.cache[name])
            this.cache[name] = [];

        // Create a new schema
        const ptr = this, X = class {
            // Constructor
            constructor(public obj: any) {
                ptr.checkType(validator, obj);
            }

            // New object
            static new(obj: any) {
                return new X(obj);
            }

            // Read the collection from the database
            static read() {
                return ptr.cache[name];
            }

            // Create new collection instances
            static create(...obj: any[]) {
                return obj.map(this.new);
            }

            // Clear the schema
            static async clear() {
                // Remove the collection objects from the cache
                ptr.cache[name] = [];

                // Write the cache to the file
                return pfs.writeFile(ptr.path, JSON.stringify(ptr.cache));
            }

            // Async find
            static async find(obj?: any, count?: number, except?: boolean) {
                let resCount: number = 0;

                // Loop parallel
                return asyncUtil.filter(ptr.cache[name], (item, cb) => {
                    // Check whether the result is enough
                    if (count && resCount >= count) {
                        cb(null, false);
                        return;
                    }

                    // Add the object to the result if matches
                    const condition = match(obj, item) === !except;

                    // Check the condition
                    if (condition)
                        resCount++;

                    // End
                    cb(null, condition);
                });
            }

            // Find one
            static async findOne(obj?: any, except?: boolean) {
                return (await this.find(obj, 1, except))[0];
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

            // Drop the collection
            static async drop() {
                // Remove the collection from cache
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
        this.cache[name].forEach(X.new);

        // Save the schema
        this.schemas[name] = X;

        // Return the collection
        return X;
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
     * Create an enum type
     * @param values The values to check
     */
    static enum(...values: any[]): SchemaType {
        return (obj: any) => {
            // If no values provided
            if (values.length === 0)
                throw new Error("No values specified");

            // If one value specified
            if (values.length === 1)
                return compare(obj, values[0]);

            // Compare the object to the values
            return compare(values[0], obj) || this.enum(...values.slice(1))(obj)
        };
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
}