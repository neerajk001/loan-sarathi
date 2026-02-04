const { MongoClient } = require('mongodb');
require('dotenv').config();

const uri = process.env.MONGO_URI;
const client = new MongoClient(uri);

let dbConnection;

module.exports = {
    connectToDb: async (cb) => {
        try {
            await client.connect();
            dbConnection = client.db();
            console.log('Connected to MongoDB');
            return cb();
        } catch (err) {
            console.error(err);
            return cb(err);
        }
    },
    getDb: () => dbConnection,
};
