import { getConnection } from "../database.js";
import { escapeLikePattern } from "../utils/escape.js";

export class Evento {
  static initStatements(db) {
    this.db = db;

    this.insertEvento = db.prepare(`
      INSERT INTO eventos (nombre, descripcion, fecha, hora, lugar, precio, estadoAnimo, creador)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);

    this.selectPorId = db.prepare("SELECT * FROM eventos WHERE id = ?");

    this.updateEvento = db.prepare(`
      UPDATE eventos SET nombre = ?, descripcion = ?, fecha = ?, hora = ?, lugar = ?, precio = ?, estadoAnimo = ?, creador = ?
      WHERE id = ?
    `);

    this.deleteEvento = db.prepare("DELETE FROM eventos WHERE id = ?");

    this.insertAsistencia = db.prepare(
      "INSERT OR IGNORE INTO Asistencias (usuario, evento_id) VALUES (?, ?)"
    );

    this.deleteAsistencia = db.prepare(
      "DELETE FROM Asistencias WHERE usuario = ? AND evento_id = ?"
    );

    this.selectEventosCreadosPorUsuario = db.prepare(`
      SELECT * FROM eventos WHERE creador = ? ORDER BY fecha DESC
    `);

    this.selectAsistenciasPorUsuario = db.prepare(`
      SELECT e.* FROM eventos e
      INNER JOIN Asistencias a ON e.id = a.evento_id
      WHERE a.usuario = ?
      ORDER BY e.fecha DESC
    `);
  }

  static crear(datos) {
    return this.insertEvento.run(
      datos.nombre,
      datos.descripcion,
      datos.fecha,
      datos.hora,
      datos.lugar,
      datos.precio,
      datos.estadoAnimo,
      datos.creador
    ).lastInsertRowid;
  }

  static obtenerTodos(filtros = {}) {
    const condiciones = [];
    const valores = {};

    if (
      typeof filtros.ubicacion === "string" &&
      filtros.ubicacion.trim() !== ""
    ) {
      const ubicacionSanitizada = escapeLikePattern(filtros.ubicacion.trim());
      condiciones.push("lugar LIKE @ubicacion ESCAPE '\\'");
      valores.ubicacion = `%${ubicacionSanitizada}%`;
    }

    if (typeof filtros.fecha === "string" && filtros.fecha.trim() !== "") {
      const fechaObj = new Date(filtros.fecha);
      if (!isNaN(fechaObj)) {
        const fechaNormalizada = fechaObj.toISOString().split("T")[0];
        condiciones.push("fecha = @fecha");
        valores.fecha = fechaNormalizada;
      }
    }

    if (typeof filtros.precio === "number" && !isNaN(filtros.precio)) {
      condiciones.push("precio <= @precio");
      valores.precio = filtros.precio;
    }

    const ESTADOS_ANIMO_VALIDOS = [
      "feliz",
      "triste",
      "relajado",
      "ansioso",
      "enojado",
      "aburrido",
    ];
    if (
      typeof filtros.estadoAnimo === "string" &&
      ESTADOS_ANIMO_VALIDOS.includes(filtros.estadoAnimo.trim())
    ) {
      condiciones.push("estadoAnimo LIKE @estadoAnimo");
      valores.estadoAnimo = filtros.estadoAnimo;
    }

    const where =
      condiciones.length > 0 ? `WHERE ${condiciones.join(" AND ")}` : "";
    const query = `SELECT * FROM eventos ${where} ORDER BY fecha DESC`;

    return this.db.prepare(query).all(valores);
  }

  static obtenerPorId(id) {
    const idNum = Number(id);
    if (!Number.isInteger(idNum)) return null;
    return this.selectPorId.get(idNum);
  }

  static modificar(id, datos) {
    const idNum = Number(id);
    if (!Number.isInteger(idNum)) return;

    return this.updateEvento.run(
      datos.nombre,
      datos.descripcion,
      datos.fecha,
      datos.hora,
      datos.lugar,
      datos.precio,
      datos.estadoAnimo,
      datos.creador,
      idNum
    );
  }

  static eliminar(id) {
    const idNum = Number(id);
    if (!Number.isInteger(idNum)) return;
    return this.deleteEvento.run(idNum);
  }

  static asistirEvento(username, eventoId) {
    if (!username || !eventoId) return;
    return this.insertAsistencia.run(username, eventoId);
  }

  static cancelarAsistencia(username, eventoId) {
    if (!username || !eventoId) return;
    return this.deleteAsistencia.run(username, eventoId);
  }

  static obtenerPorUsuario(username) {
    return this.selectEventosCreadosPorUsuario.all(username);
  }

  static obtenerAsistenciasPorUsuario(username) {
    return this.selectAsistenciasPorUsuario.all(username);
  }

  static guardarResTest(username, mood) {
    const getUser = this.db.prepare(
      "SELECT id FROM usuarios WHERE username = ?"
    );
    const user = getUser.get(username);
    if (!user) {
      console.log("No se encontró el usuario:", username);
      return;
    }

    const hoy = new Date().toISOString.split("T")[0];
    const testHoy = this.db.prepare(`
      SELECT * FROM TestResults 
      WHERE username = ? AND DATE(fecha) = ?`)
    const stmt = this.db.prepare(`
      INSERT INTO TestResults (username, mood, fecha)
      VALUES(?,?,datetime('now'))
    `);
    return stmt.run(username, mood);
  }
}
