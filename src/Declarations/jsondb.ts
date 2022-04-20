// Declare a schema type
export type SchemaType = {
    (obj: any): boolean;
}

/**
 * Schema instance
 * Result after calling new Schema(obj: object)
 */
export type SchemaInstance = {
    /**
     * Save the created object to the database
     */
    save(): Promise<object>;
}

/**
 * Schema type
 */
export type Schema = {
    /**
     * Create a new schema instance
     * @param obj The initial object
     */
    new(obj: any): SchemaInstance,

    /**
     * Read the schema from the database
     */
    read(): any[],

    /**
     * Find objects that match the parameter object
     * @param obj The object to check
     * @param count The number of objects to return
     * @param except If set to true, find objects that do not match the parameter object
     */
    find(obj?: any, count?: number, except?: boolean): Promise<any[]>,

    /**
     * Find an object that match the parameter object
     * @param obj The object to check
     * @param except If set to true, find the object that do not match the parameter object
     */
    findOne(obj?: any, except?: boolean): Promise<any>,

    /**
     * Create new objects and check whether they match the schema
     * @param obj Objects to check
     */
    create(...obj: any[]): SchemaInstance[],

    /**
     * Find the parameter object in the database and update it with the updated object
     * @param obj the object to be updated
     * @param updateObj the updated object
     */
    update(obj: any, updateObj: any): Promise<void>,

    /**
     * Clear the objects that belongs to the schema
     */
    clear(): Promise<void>,

    /**
     * Delete all objects that matches the parameter object
     * @param obj The object to check
     * @param except If set to true, delete all objects that do not match the parameter object
     */
    deleteMatch(obj?: any, except?: boolean): Promise<void>;

    /**
     * Drop all the objects that belongs to the schema. The schema after this action will be unusable
     */
    drop(): Promise<void>;

    /**
     * Remove all duplicates
     */
    rmDups(): Promise<void>;
}
