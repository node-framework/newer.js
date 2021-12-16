export default async (app, label) => {
    console.time(label);
    await app();
    console.timeEnd(label);
}