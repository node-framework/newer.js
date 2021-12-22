import { JsonDB, Reviver } from "../../lib/main.js";

const rev = new Reviver();
rev.register("accountCreated", val => new Date(val));

const db = new JsonDB("./example/JsonDB/db/db.json", rev);

const User = db.schema("User", {
    name: String,
    accountCreated: Date
}); // Schema

const test = new User({
    name: "Alex",
    accountCreated: new Date(Date.now()) // FIXME: Test is not working now
});

// Save to database
await test.save();

// Find all user
await User.read().then(console.log); // Then console.log
