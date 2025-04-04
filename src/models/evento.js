import { getConnection } from "../database.js";
//Manejo de eventos utilizando la base de datos
//Se puede crear, visualizar, modificar y eliminar eventos
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

export function obtenerEventos(filtros = {}) {
  const db = getConnection();

  let filtevent = "SELECT * FROM eventos WHERE 1=1";
  const params = [];

  if (filtros.estadoAnimo && filtros.estadoAnimo.trim() !== " ") {
    filtevent += " AND LOWER(estadoAnimo) = LOWER(?)";
    params.push(filtros.estadoAnimo);
  }

  if (filtros.ubicacion) {
    filtevent += " AND lugar LIKE ?";
    params.push(`%${filtros.ubicacion}%`);
  }

  if (filtros.fecha) {
    filtevent += " AND fecha = ?";
    params.push(filtros.fecha);
  }

  if (filtros.precio !== undefined) {
    filtevent += " AND precio <= ?";
    params.push(filtros.precio);
  }

  filtevent += " ORDER BY fecha DESC";

  return db.prepare(filtevent).all(...params);
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


//Filtrar eventos 


