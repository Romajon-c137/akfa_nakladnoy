import { MongoClient } from 'mongodb';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const envPath = join(__dirname, '..', '.env.local');
const env = Object.fromEntries(
  readFileSync(envPath, 'utf8')
    .split('\n')
    .filter(l => l && !l.startsWith('#') && l.includes('='))
    .map(l => {
      const i = l.indexOf('=');
      return [l.slice(0, i).trim(), l.slice(i + 1).trim().replace(/^["']|["']$/g, '')];
    })
);

const uri = env.MONGODB_URI;
const dbName = env.MONGODB_DB ?? 'akfa_nakladnaya';

const client = new MongoClient(uri);
await client.connect();
const db = client.db(dbName);
const result = await db.collection('invoices').deleteMany({});
console.log(`Deleted ${result.deletedCount} invoice(s) from "${dbName}".`);
await client.close();
