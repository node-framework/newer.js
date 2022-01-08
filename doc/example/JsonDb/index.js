import { JsonDB, JsonReviver } from "../../../lib/main.js";

// Reviver
const reviver = new JsonReviver;
// Set reviver of property accountCreated
reviver.setReviverOf("accountCreated", e => new Date(e));
// Database
const DB = new JsonDB("./doc/example/JsonDB/db/db.json", reviver.callback());
// Print saved item
DB.on("save-item", console.log);
// Schema
const User = DB.schema("User", {
    name: String,
    id: Number,
    accountCreated: Date
});
// Create an user and save the document (this action will trigger the save-item event)
await new User({
    name: "Reve",
    id: 503850,
    accountCreated: new Date(99869369536)
}).save();
// Find all user
await User.find({
    name: "Alex"
}, 1).then(console.log); // Print all documents in User schema

/**
 * @description Fork this repo and run the example 
 */