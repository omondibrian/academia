

import { connect,connection } from "mongoose";

const MONGODB_URL = process.env.MONGO_URL || 'mongodb://localhost/testDb';

export async function initMongo() {
  console.log('Initialising MongoDB...');
  let success = false;
  while (!success) {
    try {
      // express.response.setHeader('X-Powered-By', 'snapShare');
      //conect mongoDb
      connect(MONGODB_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });

      connection.once('open', async function() {
        await console.log('MongoDB initialised');
      });
      success = true;
    } catch {
      console.log('Error connecting to MongoDB, retrying in 1 second');
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }
}
