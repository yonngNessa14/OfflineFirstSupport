import SQLite, {SQLiteDatabase} from 'react-native-sqlite-storage';

SQLite.DEBUG(__DEV__);
SQLite.enablePromise(true);

const DATABASE_NAME = 'OfflineSyncDB.db';

let database: SQLiteDatabase | null = null;

export const getDatabase = async (): Promise<SQLiteDatabase> => {
  if (database) {
    return database;
  }

  database = await SQLite.openDatabase({
    name: DATABASE_NAME,
    location: 'default',
  });

  await createTables(database);

  return database;
};

const createTables = async (db: SQLiteDatabase): Promise<void> => {
  const createActionsTable = `
    CREATE TABLE IF NOT EXISTS actions (
      id TEXT PRIMARY KEY,
      type TEXT NOT NULL,
      payload TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'pending',
      priority INTEGER NOT NULL,
      retry_count INTEGER NOT NULL DEFAULT 0,
      created_at INTEGER NOT NULL,
      synced_at INTEGER
    );
  `;

  await db.executeSql(createActionsTable);

  const createIndex = `
    CREATE INDEX IF NOT EXISTS idx_actions_pending 
    ON actions (status, priority, created_at);
  `;

  await db.executeSql(createIndex);
};

export const closeDatabase = async (): Promise<void> => {
  if (database) {
    await database.close();
    database = null;
  }
};
