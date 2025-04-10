BEGIN TRANSACTION;
DROP TABLE IF EXISTS "Eventos";
CREATE TABLE Eventos (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  nombre TEXT NOT NULL,
  descripcion TEXT NOT NULL,
  fecha TEXT NOT NULL,
  hora TEXT NOT NULL,
  lugar TEXT NOT NULL,
  precio REAL NOT NULL,
  estadoAnimo TEXT NOT NULL
, tematica TEXT);
DROP TABLE IF EXISTS "usuarios";
CREATE TABLE usuarios (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  nombre TEXT NOT NULL,
  apellido TEXT NOT NULL,
  edad INTEGER NOT NULL,
  email TEXT NOT NULL UNIQUE,
  username TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'user'
);
COMMIT;
