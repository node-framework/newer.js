import { JsonDB } from "../../main.js";

const db = new JsonDB("db.json", "./example/JsonDB/db");

const User = db.schema({
    name: String,
    id: Number
}, "User"); // Schema

let i = new User({
    name: "Reve",
    id: 898905
}); // Create new object

await i.save(); // Save to database

// Find one user with name = Reve
await User.findOne({
    name: "Reve" 
}).then(console.log); // Then console.log

// Drop user schema
await User.clear(); 