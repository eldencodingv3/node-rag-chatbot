import * as lancedb from '@lancedb/lancedb';
import path from 'path';

const DB_PATH = path.join(process.cwd(), 'data', 'lancedb');
const TABLE_NAME = 'faqs';

let db = null;
let table = null;

export async function initVectorStore(documents) {
  db = await lancedb.connect(DB_PATH);

  // Check if table already exists
  const tableNames = await db.tableNames();
  if (tableNames.includes(TABLE_NAME)) {
    table = await db.openTable(TABLE_NAME);
    return;
  }

  // Create table with documents
  table = await db.createTable(TABLE_NAME, documents);
}

export async function searchSimilar(queryVector, limit = 3) {
  if (!table) throw new Error('Vector store not initialized');
  const results = await table.vectorSearch(queryVector).limit(limit).toArray();
  return results;
}
