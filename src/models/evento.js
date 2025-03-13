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

export function obtenerEvento(id) {
  const db = getConnection();
  return db.prepare("SELECT * FROM eventos WHERE id = ?").get(id);
}

export function obtenerEventoPorId(id) {
  const db = getConnection();
  return db.prepare("SELECT * FROM eventos WHERE id = ?").get(id);
}

export function modificarEvento(
  id,
  { nombre, descripcion, fecha, hora, lugar, precio, estadoAnimo }
) {
  const db = getConnection();
  db.prepare(
    "UPDATE eventos SET nombre = ?, descripcion = ?, fecha = ?, hora = ?, lugar = ?, precio = ?, estadoAnimo = ? WHERE id = ?"
  ).run(nombre, descripcion, fecha, hora, lugar, precio, estadoAnimo, id);
}

export function eliminarEvento(id) {
  const db = getConnection();
  db.prepare("DELETE FROM eventos WHERE id = ?").run(id);
}
