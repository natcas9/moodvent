import { getConnection } from "../database.js";

export class Evento {
  static initStatements(db) {
    this.db = db;

    this.insertEvento = db.prepare(`
      INSERT INTO Eventos (nombre, descripcion, fecha, hora, lugar, precio, estadoAnimo, creador)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);

    this.selectPorId = db.prepare(`SELECT * FROM eventos WHERE id = ?`);

    this.updateEvento = db.prepare(`
      UPDATE Eventos
      SET nombre = ?, descripcion = ?, fecha = ?, hora = ?, lugar = ?, precio = ?, estadoAnimo = ?, creador = ?
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
    creador,
  }) {
    return this.insertEvento.run(
      nombre,
      descripcion,
      fecha,
      hora,
      lugar,
      precio,
      estadoAnimo,
      creador
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
    { nombre, descripcion, fecha, hora, lugar, precio, estadoAnimo, creador }
  ) {
    return this.updateEvento.run(
      nombre,
      descripcion,
      fecha,
      hora,
      lugar,
      precio,
      estadoAnimo,
      creador,
      id
    );
  }

  static eliminar(id) {
    return this.deleteEvento.run(id);
  }
  static obtenerPorUsuario(username) {
    const stmt = this.db.prepare("SELECT * FROM Eventos WHERE creador = ?");
    return stmt.all(username);
  }

  static registrarAsistencia(username, eventoId) {
    const stmt = this.db.prepare(
      "INSERT OR IGNORE INTO Asistencias (usuario, evento_id) VALUES (?, ?)"
    );
    return stmt.run(username, eventoId);
  }

  static obtenerAsistenciasPorUsuario(username) {
    const stmt = this.db.prepare(`
    SELECT e.* FROM Eventos e
    JOIN Asistencias a ON e.id = a.evento_id
    WHERE a.usuario = ?
  `);
    return stmt.all(username);
  }

  static cancelarAsistencia(username, eventoId) {
    const stmt = this.db.prepare(`
    DELETE FROM Asistencias WHERE usuario = ? AND evento_id = ?
  `);
    stmt.run(username, eventoId);
  }

  static asistirEvento(usuario,eventoId) {
    const stmt = this.db.prepare(
      "INSERT OR IGNORE Asistencias (usuario, evento_id) VALUES (?,?)"
    );
    return stmt.run(usuario, eventoId);
  }

  static guardarResTest(username, mood,) {
    const getUser = this.db.prepare("SELECT id FROM usuarios WHERE username = ?");
    const user = getUser.get(username);
    if (!user) {
      console.log("No se encontró el usuario:", username);
      return;
    }

    const stmt = this.db.prepare(`
      INSERT INTO TestResults (username, mood, fecha)
      VALUES(?,?,datetime('now'))
    `);
    return stmt.run(username,mood);
  }

  static obtenerResPorUsuario(username) {
    const stmt = this.db.prepare(`
      SELECT * FROM TestResults WHERE username = ?
      ORDER By fecha DESC
    `);
    return stmt.all(username);
  }
}
