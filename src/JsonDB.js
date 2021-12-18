// @ts-check
import fs, { existsSync } from "fs";
import path from "path";

const getWrapper = (/** @type {any} */ obj) => {
    if (typeof obj === 'string')
        return String;
    if (typeof obj === 'number')
        return Number;
    if (typeof obj === 'bigint')
        return BigInt;
    if (typeof obj === 'boolean')
        return Boolean;
    if (typeof obj === 'symbol')
        return Symbol;
    if (typeof obj === 'object')
        return Object;
    return null;
}

const checkType = (type, obj) => {
    if (typeof type === 'function')
        return getWrapper(obj) === type;

    let current = true;
    for (let e in type) {
        current = checkType(type[e], obj[e]);
        if (!current) return false;
    }
    return true;
}

export default class JsonDB {
    /**
     * @type {number[]}
     * @private
     */
    ids;
    /**
     * @type {string}
     */
    parentPath;
    /**
     * @type {string}
     */
    fileName;
    /**
     * @param {string} fileName 
     * @param {string} parentPath 
     */
    constructor(fileName, parentPath = ".") {
        if (!existsSync(path.join(parentPath, fileName)))
            fs.appendFileSync(path.join(parentPath, fileName), "[]");
        this.fileName = fileName;
        this.parentPath = parentPath;
        this.ids = [];
    }
    /**
     * @param {object} schem 
     */
    schema = schem => {
        const pth = path.join(this.parentPath, this.fileName);
        const pointer = this;
        let Schema = class Schema {
            /**
             * @type {number}
             */
            #id;
            /**
             * @type {object}
             */
            #obj;
            /**
             * @param {object} obj 
             */
            constructor(obj) {
                const id = Date.now();
                pointer.ids.push(id);
                for (const e in schem) {
                    if (!checkType(schem[e], obj[e]))
                        throw new Error("Invalid object");
                }
                this.#obj = obj;
                this.#id = id;
            }

            save = async () => {
                const current = JSON.parse(
                    await new Promise(
                        (res, rej) =>
                            fs.readFile(pth, (err, data) =>
                                err ? rej(err) : res(data.toString())
                            )
                    )
                );
                current.push(this.#obj);
                return new Promise((res, rej) =>
                    fs.writeFile(pth, JSON.stringify(current), err =>
                        err ? rej(err) : res(current)
                    )
                )
            }

            del = async () => {
                const current = JSON.parse(
                    await new Promise(
                        (res, rej) =>
                            fs.readFile(pth, (err, data) =>
                                err ? rej(err) : res(data.toString())
                            )
                    )
                );
                current.splice(current.indexOf(this.#obj), 1);
                return new Promise((res, rej) =>
                    fs.writeFile(pth, JSON.stringify(current), err =>
                        err ? rej(err) : res(current)
                    )
                )
            }
            /**
             * @param {object} obj 
             */
            static match = obj => {
                for (const e in schem) {
                    if (!checkType(schem[e], obj[e]))
                        return false;
                }
                return true;
            }
            /**
             * @returns this schema id
             */
            get id() {
                return this.#id;
            }
            /**
             * @param {object} obj 
             * @param {number} count 
             * @param {boolean} except
             */
            static find = async (obj, count = undefined, except = false) =>
                await pointer.#find(obj, Schema, count, except);
            /**
             * @param {object} obj 
             * @param {boolean} except
             */
            static findOne = async (obj, except = false) =>
                await pointer.#findOne(obj, Schema, except);
        }
        /**
         * @type {object[]}
         */
        Schema.registeredObjects = [];
        return Schema;
    }
    /**
     * @param {object} obj 
     * @param {Function} schem
     * @param {number} count
     * @param {boolean} except
     */
    #find = async (obj, schem, count = undefined, except = false) => {
        // @ts-ignore
        if (this.ids.includes(schem.id))
            throw new Error("Invalid schema");
        const current = JSON.parse(
            await new Promise(
                (res, rej) =>
                    fs.readFile(path.join(this.parentPath, this.fileName), (err, data) =>
                        err ? rej(err) : res(data.toString())
                    )
            )
        );
        const result = [];
        for (let e of current)
            for (let i in obj) {
                if (count && result.length === count)
                    return result;
                // @ts-ignore
                if (
                    (
                        (e[i] === obj[i]) !== except &&
                        // @ts-ignore
                        schem.match(e)
                    )
                ) result.push(e);
            }
        return result;
    }
    /**
     * @param {object} obj 
     * @param {Function} schem
     * @param {boolean} except
     */
    #findOne = async (obj, schem, except = false) => {
        // @ts-ignore
        if (this.ids.includes(schem.id))
            throw new Error("Invalid schema");
        const current = JSON.parse(
            await new Promise(
                (res, rej) =>
                    fs.readFile(path.join(this.parentPath, this.fileName), (err, data) =>
                        err ? rej(err) : res(data.toString())
                    )
            )
        );
        for (let e of current)
            for (let i in obj) {
                // @ts-ignore
                if (
                    (
                        (e[i] === obj[i]) !== except &&
                        // @ts-ignore
                        schem.match(e)
                    )
                ) return e;
            }
        return {};
    }
}
