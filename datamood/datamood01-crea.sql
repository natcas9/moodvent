BEGIN TRANSACTION;
DROP TABLE IF EXISTS "eventos";
CREATE TABLE eventos (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nombre TEXT NOT NULL,
            descripcion TEXT NOT NULL,
            fecha TEXT NOT NULL,
            hora TEXT NOT NULL,
            lugar TEXT NOT NULL,
            precio REAL NOT NULL,
            estadoAnimo TEXT NOT NULL
        );
DROP TABLE IF EXISTS "usuarios";
CREATE TABLE usuarios (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nombre TEXT NOT NULL
        apellido TEXT NOT NULL,
        edad INTEGER NOT NULL,
        email TEXT UNIQUE NOT NULL,
        username TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        role TEXT CHECK(role IN ('admin', 'user')) NOT NULL
      );
COMMIT;
