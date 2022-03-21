export default async (line: string, db: any) => 
    // Get the schema and clear
    db.schema(
        line.split(" ")[1]
    ).drop();