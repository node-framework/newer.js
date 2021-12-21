import { JsonDB } from "../../lib/main.js";

/**
 * Given
 * {
 *     "name": "Reve",
 *     "id": 503806
 * } as the first document of schema "User"
 */
const db = new JsonDB("./example/JsonDB/db/db.json");

const User = db.schema("User"); // Schema

const test = new User({
    name: "Alex",
    id: 358300
});

// Save to database
await test.save();

// Update the document
await test.update({
    name: "Alex",
    id: 959305
});

// Find all user
await User.read().then(console.log); // Then console.log
