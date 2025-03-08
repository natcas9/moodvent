import { getConnection } from "../database.js";

export function crearEvento({
  nombre,
  descripcion,
  fecha,
  hora,
  lugar,
  precio,
  estadoAnimo,
}) {
  const db = getConnection();
  const stmt = db.prepare(`
        INSERT INTO eventos (nombre, descripcion, fecha, hora, lugar, precio, estadoAnimo)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    `);
  const result = stmt.run(
    nombre,
    descripcion,
    fecha,
    hora,
    lugar,
    precio,
    estadoAnimo
  );
  return result.lastInsertRowid;
}

export function obtenerEventos() {
  const db = getConnection();
  return db.prepare("SELECT * FROM eventos ORDER BY fecha DESC").all();
}
