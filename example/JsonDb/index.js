import { JsonDB, JsonReviver } from "../../lib/main.js";

// Reviver
const reviver = new JsonReviver;
// Set reviver of property accountCreated
reviver.setReviverOf("accountCreated", e => new Date(e));
// Database
const DB = new JsonDB("./example/JsonDB/db/db.json", reviver.callback());
// Print saved item
DB.on("save-item", console.log);
// Schema
const User = DB.schema("User");
// Create an user
let user = new User({
    name: "Reve",
    id: 503850,
    accountCreated: new Date(938693603683)
});
// Save the document an trigger "save-item"
await user.save();
// Find all user
await User.find({
    name: "Reve"
}, 1).then(console.log); // Print all documents in User schema

/**
 * @description Fork this repo and run the example 
 */