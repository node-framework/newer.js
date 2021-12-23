import { JsonDB, JsonReviver } from "../../lib/main.js";

const reviver = new JsonReviver;
reviver.setReviverOf("accountCreated", e => new Date(e));
const DB = new JsonDB("./example/JsonDB/db/db.json", reviver.callback());

// Schema
const User = DB.schema("User");

// Find all user
await User.read().then(console.log); // Check type