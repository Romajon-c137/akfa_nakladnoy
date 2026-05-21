import { Collection, Db, MongoClient } from 'mongodb';
import { Invoice } from './types';

const uri = process.env.MONGODB_URI;
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

export async function getDb(): Promise<Db> {
  const client = await clientPromise;
  return client.db(dbName);
}

/** Mongo doc shape — `_id` is the client-supplied invoice id (string). */
export type InvoiceDoc = Omit<Invoice, 'id'> & { _id: string };

/** Rate-limit record keyed by sha256(ip:sessionCookie). */
export type RateLimitDoc = {
  _id: string;
  fails: number;
  lockedUntil: number;
  updatedAt: number;
};

export async function invoices(): Promise<Collection<InvoiceDoc>> {
  return (await getDb()).collection<InvoiceDoc>('invoices');
}

export async function rateLimits(): Promise<Collection<RateLimitDoc>> {
  return (await getDb()).collection<RateLimitDoc>('rate_limits');
}

export default clientPromise;
