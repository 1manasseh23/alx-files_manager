import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config();

class DBClient {
    constructor() {
        const host = process.env.DB_HOST || 'localhost';
        const port = process.env.DB_PORT || 27017;
        const database = process.env.DB_DATABASE || 'files_manager';
        const url = `mongodb://${host}:${port}`;

        this.client = new MongoClient(url, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        this.client.connect()
            .then(() => {
                this.db = this.client.db(database);
                console.log('Connected to MongoDB');
            })
            .catch((err) => {
                console.error('Error connecting to MongoDB:', err);
                this.db = null;
            });
    }

    async isAlive() {
        try {
            // Check the connection to MongoDB
            await this.client.db().admin().ping();
            return true;
        } catch (err) {
            console.error('MongoDB connection error:', err);
            return false;
        }
    }

    async nbUsers() {
        try {
            return this.db ? await this.db.collection('users').countDocuments() : 0;
        } catch (err) {
            console.error('Error counting users:', err);
            return 0;
        }
    }

    async nbFiles() {
        try {
            return this.db ? await this.db.collection('files').countDocuments() : 0;
        } catch (err) {
            console.error('Error counting files:', err);
            return 0;
        }
    }
}

const dbClient = new DBClient();
export default dbClient;

