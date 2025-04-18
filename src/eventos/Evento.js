import { getConnection } from "../database.js";

export class Evento {
  static initStatements(db) {
    this.db = db;

    this.insertEvento = db.prepare(`
      INSERT INTO eventos (nombre, descripcion, fecha, hora, lugar, precio, estadoAnimo)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);

    this.selectPorId = db.prepare(`SELECT * FROM eventos WHERE id = ?`);

    this.updateEvento = db.prepare(`
      UPDATE eventos SET nombre = ?, descripcion = ?, fecha = ?, hora = ?, lugar = ?, precio = ?, estadoAnimo = ?
      WHERE id = ?
    `);

    this.deleteEvento = db.prepare(`DELETE FROM eventos WHERE id = ?`);
  }

  static crear({
    nombre,
    descripcion,
    fecha,
    hora,
    lugar,
    precio,
    estadoAnimo,
  }) {
    return this.insertEvento.run(
      nombre,
      descripcion,
      fecha,
      hora,
      lugar,
      precio,
      estadoAnimo
    ).lastInsertRowid;
  }

  static obtenerTodos(filtros = {}) {
    const condiciones = [];
    const valores = {};

    if (filtros.tematica) {
      condiciones.push("tematica = @tematica");
      valores.tematica = filtros.tematica;
    }

    if (filtros.ubicacion) {
      condiciones.push("lugar LIKE @ubicacion");
      valores.ubicacion = `%${filtros.ubicacion}%`;
    }

    if (filtros.fecha) {
      condiciones.push("fecha = @fecha");
      valores.fecha = filtros.fecha;
    }

    if (filtros.precio !== undefined) {
      condiciones.push("precio <= @precio");
      valores.precio = filtros.precio;
    }

    if (filtros.estadoAnimo) {
      condiciones.push("estadoAnimo LIKE @estadoAnimo");
      valores.estadoAnimo = filtros.estadoAnimo;
    }

    const where =
      condiciones.length > 0 ? `WHERE ${condiciones.join(" AND ")}` : "";
    const query = `SELECT * FROM eventos ${where} ORDER BY fecha DESC`;

    return this.db.prepare(query).all(valores);
  }

  static obtenerPorId(id) {
    return this.selectPorId.get(id);
  }

  static modificar(
    id,
    { nombre, descripcion, fecha, hora, lugar, precio, estadoAnimo }
  ) {
    return this.updateEvento.run(
      nombre,
      descripcion,
      fecha,
      hora,
      lugar,
      precio,
      estadoAnimo,
      id
    );
  }

  static eliminar(id) {
    return this.deleteEvento.run(id);
  }
}
