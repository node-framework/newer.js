import { JsonDB } from "../../main.js";

const db = new JsonDB("db.json", "./example/JsonDB/db");

const User = db.schema({
    name: String,
    id: Number
});

await User.findOne({
    name: "Reve"
}).then(console.log);