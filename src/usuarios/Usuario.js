import { getConnection } from "../database.js";
import bcrypt from "bcryptjs";

export class UsuarioYaExiste extends Error {
  constructor(mensaje) {
    super(mensaje);
    this.name = "UsuarioYaExiste";
  }
}

export const RolesEnum = {
  ADMIN: "admin",
  USER: "user",
};

export class Usuario {
  static initStatements(db) {
    this.db = db;
    this.selectPorUsername = db.prepare(
      "SELECT * FROM usuarios WHERE username = ?"
    );
    this.selectPorEmail = db.prepare("SELECT * FROM usuarios WHERE email = ?");
    this.insertUsuario = db.prepare(`
      INSERT INTO usuarios (nombre, apellido, edad, email, username, password, role)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);
  }

  static async login(username, password) {
    const row = this.selectPorUsername.get(username);
    if (!row) throw new Error("Usuario no encontrado");

    const match = await bcrypt.compare(password, row.password);
    if (!match) throw new Error("Contraseña incorrecta");

    return row;
  }

  static async registro({ nombre, apellido, edad, email, username, password }) {
    const existeUsername = this.selectPorUsername.get(username);
    if (existeUsername) throw new UsuarioYaExiste("El usuario ya existe");

    const existeEmail = this.selectPorEmail.get(email);
    if (existeEmail) throw new UsuarioYaExiste("El email ya está registrado");

    const hash = await bcrypt.hash(password, 10);
    const rolPorDefecto = RolesEnum.USER;
    this.insertUsuario.run(
      nombre,
      apellido,
      edad,
      email,
      username,
      hash,
      rolPorDefecto
    );
  }
  static getPorUsername(username) {
    return this.selectPorUsername.get(username);
  }
}
