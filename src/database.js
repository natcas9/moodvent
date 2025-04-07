import { join, dirname } from "node:path";
import { fileURLToPath } from "url";
import Database from "better-sqlite3";
import { logger } from "./logger.js";

let db = null;

export function getConnection() {
  if (db !== null) return db;
  db = createConnection();
  return db;
}

function createConnection() {
  const options = {
    verbose: (sql) => logger.debug(sql),
  };

  const __filename = fileURLToPath(import.meta.url);
  const __dirname = dirname(__filename);

  const dbPath = join(__dirname, "..", "datamood", "moodvent.db");
  const db = new Database(dbPath, options);
  db.pragma("journal_mode = WAL");

  return db;
}

export function closeConnection(db = getConnection()) {
  if (db === null) return;
  db.close();
}

export function checkConnection(db = getConnection()) {
  const checkStmt = db.prepare("SELECT 1+1 as suma");
  const suma = checkStmt.get().suma;
  if (suma == null || suma !== 2)
    throw new Error(`La bbdd no funciona correctamente`);
}

export class ErrorDatos extends Error {
  constructor(message, options) {
    super(message, options);
    this.name = "ErrorDatos";
  }
}
