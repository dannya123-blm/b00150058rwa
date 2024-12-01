import { MongoClient } from 'mongodb';

const MongoDBURI = process.env.MongoDBURI;
const client = new MongoClient(MongoDBURI);

let dbConnection;

async function connectToDatabase() {
    if (!dbConnection) {
        await client.connect();
        dbConnection = client.db('KirspyDB'); 
    }
    return dbConnection;
}

export default connectToDatabase;
