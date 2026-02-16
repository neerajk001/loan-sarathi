const { MongoClient } = require('mongodb');
require('dotenv').config();

const uri = process.env.MONGO_URI;

if (!uri) {
    console.error('FATAL ERROR: MONGO_URI is not defined in environment variables');
    process.exit(1);
}

const client = new MongoClient(uri, {
    maxPoolSize: 10,
    minPoolSize: 2,
    maxIdleTimeMS: 30000,
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
});

let dbConnection;

// Graceful shutdown handler
process.on('SIGINT', async () => {
    console.log('\nReceived SIGINT, closing MongoDB connection...');
    try {
        await client.close();
        console.log('MongoDB connection closed');
        process.exit(0);
    } catch (err) {
        console.error('Error closing MongoDB connection:', err);
        process.exit(1);
    }
});

process.on('SIGTERM', async () => {
    console.log('\nReceived SIGTERM, closing MongoDB connection...');
    try {
        await client.close();
        console.log('MongoDB connection closed');
        process.exit(0);
    } catch (err) {
        console.error('Error closing MongoDB connection:', err);
        process.exit(1);
    }
});

module.exports = {
    connectToDb: async (cb) => {
        try {
            await client.connect();
            dbConnection = client.db();
            console.log('Connected to MongoDB');
            return cb();
        } catch (err) {
            console.error('FATAL ERROR: Failed to connect to MongoDB:', err);
            return cb(err);
        }
    },
    getDb: () => dbConnection,
    closeConnection: async () => {
        if (client) {
            await client.close();
        }
    },
};
