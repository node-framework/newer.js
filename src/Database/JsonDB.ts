import add from "../Utils/Compiler/add";
import clear from "../Utils/Compiler/clear";
import remove from "../Utils/Compiler/remove";
import * as fs from "fs";
import { Schema, SchemaType } from "../declarations";
import compare from "../Utils/ObjectCompare";
import match from "../Utils/ObjectMatch";
import drop from "../Utils/Compiler/drop";

// Execute the .action file
async function exec(file: string, db: JsonDB) {
    const lines: string[] = fs.readFileSync(file)
        // Read the action file
        .toString()

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
        // Insert
        if (line.startsWith("add"))
            await add(line, db);

        // Delete
        else if (line.startsWith("remove"))
            await remove(line, db);

        // Clear
        else if (line.startsWith("clear"))
            await clear(line, db);

        // Drop
        else if (line.startsWith("drop"))
            await drop(line, db);
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

    constructor(public path: string) {
        // Check if file exists
        if (!fs.existsSync(path) || fs.readFileSync(path).toString() === "")
            fs.appendFileSync(path, "{}");

        // Save the object
        this.cache = JSON.parse(fs.readFileSync(path).toString());

        // Schemas
        this.schemas = {};
    }

    /**
     * Create a schema
     * @param name 
     * @param validator 
     * @returns a schema
     */
    schema(name: string, validator?: { [prop: string]: SchemaType }): Schema {
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
                // Validate the type of the object
                for (const prop in validator) {
                    if (!validator[prop] || !validator[prop](obj[prop]))
                        throw new Error(`Invalid value for ${prop}`);
                }
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

        // Check whether any document exists in the collection
        this.cache[name].forEach(obj => new CurrentSchema(obj));

        // Save the schema
        this.schemas[name] = CurrentSchema;

        // Return the schema
        return CurrentSchema;
    }

    // Basic types
    static Number(obj: any): boolean {
        return typeof obj === "number" || obj instanceof Number;
    }

    static String(obj: any): boolean {
        return typeof obj === "string" || obj instanceof String;
    }

    static Boolean(obj: any): boolean {
        return typeof obj === "boolean" || obj instanceof Boolean;
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
    async run(filename: string) {
        return exec(filename, this);
    }
}