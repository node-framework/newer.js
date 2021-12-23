import { JsonDB } from "../../lib/main.js";
const DB = new JsonDB("./example/JsonDB/db/db.json");

// Schema
const User = DB.schema("User");

// Find all user
await User.read().then(console.log); // Check type