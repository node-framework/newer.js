export declare type SchemaInstance = {
    save: () => Promise<object>;
    del: () => Promise<object>;
    update: (obj: object) => Promise<object>;
};
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
    docs: object[];
};
export default class JsonDB {
    #private;
    constructor(...filePaths: string[]);
    get filePath(): string;
    schema: (name: string, schem?: object) => Schema;
    clear: () => Promise<void>;
    drop: (schema?: Schema | string) => Promise<void>;
}
//# sourceMappingURL=JsonDB.d.ts.map