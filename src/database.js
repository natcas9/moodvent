// Se creó la base de datos con ayuda del ejercicio 2, chatgpt y el siguiente video https://www.youtube.com/watch?v=ehppT_7lYH0&ab_channel=LeonardoJose
import { fileURLToPath } from "url";
import { mkdirSync, existsSync } from "fs";
import { join, dirname } from "node:path";
import Database from "better-sqlite3";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const dataDir = join(__dirname, "datamood");
const dbPath = join(dataDir, "moodvent.db");

if (!existsSync(dataDir)) {
  //console.log("Creando carpeta 'datamood/'...");
  mkdirSync(dataDir, { recursive: true });
}

//console.log(` Base de datos en: ${dbPath}`);

const db = new Database(dbPath, { verbose: console.log });

export function getConnection() {
  return db;
}

export function initDB() {
  db.exec(`
        CREATE TABLE IF NOT EXISTS eventos (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nombre TEXT NOT NULL,
            descripcion TEXT NOT NULL,
            fecha TEXT NOT NULL,
            hora TEXT NOT NULL,
            lugar TEXT NOT NULL,
            precio REAL NOT NULL,
            estadoAnimo TEXT NOT NULL
        )
    `);

  db.exec(`
      CREATE TABLE IF NOT EXISTS usuarios (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nombre TEXT NOT NULL,
        apellido TEXT NOT NULL,
        edad INTEGER NOT NULL,
        email TEXT UNIQUE NOT NULL,
        username TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        role TEXT CHECK(role IN ('admin', 'user')) NOT NULL
      )
    `);
  //console.log("Base de datos inicializada correctamente");
}
