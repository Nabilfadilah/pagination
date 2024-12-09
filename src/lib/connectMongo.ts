import { MongoClient } from "mongodb";

const MONGODB_URI = process.env.MONGODB_URI;

let client: MongoClient | null = null;

export async function dbConnect() {
    if (client) {
        return client;
    }

    if (!MONGODB_URI) {
        throw new Error("MongoDb URI not found.");
    }

    try {
        client = await MongoClient.connect(MONGODB_URI);
        console.log("Connected to MongoDb successfully.");
        return client;
    } catch (error) {
        console.error("Error connecting to the database:", error);
        throw error; // Optional: re-throw the error if necessary
    }
}
