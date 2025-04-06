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
    let sql = `SELECT * FROM eventos WHERE 1=1`;
    const params = [];

    if (filtros.tematica) {
      sql += " AND nombre LIKE ?";
      params.push(`%${filtros.tematica}%`);
    }

    if (filtros.ubicacion) {
      sql += " AND lugar LIKE ?";
      params.push(`%${filtros.ubicacion}%`);
    }

    if (filtros.fecha) {
      sql += " AND fecha = ?";
      params.push(filtros.fecha);
    }

    if (filtros.precio !== undefined) {
      sql += " AND precio <= ?";
      params.push(filtros.precio);
    }

    sql += " ORDER BY fecha DESC";

    return this.db.prepare(sql).all(...params);
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
