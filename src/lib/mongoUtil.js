// mongoUtil.js
import { MongoClient } from 'mongodb';

const MongoDBURI = process.env.MongoDBURI;
const client = new MongoClient(MongoDBURI);

let dbConnection;

async function connectToDatabase() {
    if (!dbConnection) {
        try {
            await client.connect();
            dbConnection = client.db('KirspyDB'); 
        } catch (error) {
            console.error("Database connection error:", error);
            throw error;
        }
    }
    return dbConnection;
}

export default connectToDatabase;
