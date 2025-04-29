import { getConnection } from "../database.js";

export class SugerenciaFeedback {
  static initStatements(db) {
    this.db = db;
    this.insertStmt = db.prepare(`
      INSERT INTO SugerenciasFeedbacks (tipo, texto)
      VALUES (?, ?)
    `);
    this.selectAllStmt = db.prepare(`
      SELECT * FROM SugerenciasFeedbacks
    `);
  }

  static guardar(tipo, texto) {
    return this.insertStmt.run(tipo, texto);
  }

  static obtenerTodos() {
    return this.selectAllStmt.all();
  }

  static eliminar(id) {
    const stmt = this.db.prepare("DELETE FROM SugerenciasFeedbacks WHERE id = ?");
    return stmt.run(id);
  }
  
}
