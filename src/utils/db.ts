const DB_NAME = 'two_months_db';
const DB_VERSION = 1;
const STORE_NAME = 'kv';

let db: IDBDatabase | null = null;
let dbPromise: Promise<IDBDatabase> | null = null;
let writeChain = Promise.resolve();

function getDB(): Promise<IDBDatabase> {
  if (db) return Promise.resolve(db);
  if (dbPromise) return dbPromise;

  dbPromise = new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'key' });
      }
    };

    request.onsuccess = (event) => {
      db = (event.target as IDBOpenDBRequest).result;
      resolve(db);
    };

    request.onerror = (event) => reject((event.target as IDBOpenDBRequest).error);
  });

  return dbPromise;
}

export async function dbGet(key: string): Promise<string | null> {
  const database = await getDB();
  return new Promise((resolve, reject) => {
    const transaction = database.transaction(STORE_NAME, 'readonly');
    const request = transaction.objectStore(STORE_NAME).get(key);
    request.onsuccess = () => resolve(request.result?.value || null);
    request.onerror = () => reject(request.error);
  });
}

export async function dbSet(key: string, value: string): Promise<void> {
  const op = () => new Promise<void>((resolve, reject) => {
    getDB().then((database) => {
        const transaction = database.transaction(STORE_NAME, 'readwrite');
        const request = transaction.objectStore(STORE_NAME).put({ key, value });
        transaction.oncomplete = () => resolve();
        transaction.onerror = () => reject(transaction.error);
    });
  });

  writeChain = writeChain.then(op as any).catch(console.warn);
  return writeChain;
}

export async function dbDelete(key: string): Promise<void> {
  const database = await getDB();
  return new Promise((resolve, reject) => {
    const transaction = database.transaction(STORE_NAME, 'readwrite');
    const request = transaction.objectStore(STORE_NAME).delete(key);
    transaction.oncomplete = () => resolve();
    transaction.onerror = () => reject(transaction.error);
  });
}

export async function dbGetAll(): Promise<Record<string, string>> {
  const database = await getDB();
  return new Promise((resolve, reject) => {
    const transaction = database.transaction(STORE_NAME, 'readonly');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.getAll();
    request.onsuccess = () => {
      const all: Record<string, string> = {};
      (request.result as { key: string, value: string }[]).forEach(item => {
        all[item.key] = item.value;
      });
      resolve(all);
    };
    request.onerror = () => reject(request.error);
  });
}

export function isIDBAvailable(): boolean {
  try {
    return typeof indexedDB !== 'undefined';
  } catch {
    return false;
  }
}
