import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI!;
const dbName = process.env.MONGODB_DB ?? 'akfa_nakladnaya';

if (!uri) throw new Error('MONGODB_URI env variable is not set');

declare global {
  // eslint-disable-next-line no-var
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

let clientPromise: Promise<MongoClient>;

if (process.env.NODE_ENV === 'development') {
  if (!global._mongoClientPromise) {
    const p = new MongoClient(uri).connect();
    global._mongoClientPromise = p;
    p.catch(() => {
      global._mongoClientPromise = undefined;
    });
  }
  clientPromise = global._mongoClientPromise!;
} else {
  clientPromise = new MongoClient(uri).connect();
}

export async function getDb() {
  const client = await clientPromise;
  return client.db(dbName);
}

export default clientPromise;
