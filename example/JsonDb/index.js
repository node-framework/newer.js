import { JsonDB, JsonReviver } from "../../lib/main.js";

const reviver = new JsonReviver;

// Set reviver of property accountCreated
reviver.setReviverOf("accountCreated", e => new Date(e));

// Database
const DB = new JsonDB("./example/JsonDB/db/db.json", reviver.callback());

// Schema
const User = DB.schema("User");

// Find all user
await User.read().then(console.log); // Check type