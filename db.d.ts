import JsonDB from "./src/Database/JsonDB";

declare module "newer.js/db" {
    export = JsonDB;
}