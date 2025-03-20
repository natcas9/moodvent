import { getConnection } from "../database.js";
import bcrypt from "bcryptjs";

export function registrarUsuario(
  nombre,
  apellido,
  edad,
  email,
  username,
  password,
  role
) {
  const db = getConnection();
  const usuarioRegistrado = db
    .prepare("SELECT * FROM usuarios where username=?")
    .get(username);
  if (usuarioRegistrado) {
    throw new Error("El usuario ya existe");
  }

  const passwordHash = bcrypt.hashSync(password, 10);

  db.prepare(
    "INSERT INTO usuarios (nombre, apellido, edad, email, username,password,role) VALUES (?,?,?,?,?,?,?)"
  ).run(nombre, apellido, edad, email, username, passwordHash, role);
}

export function obtenerUsuario(username) {
  const db = getConnection();
  return db.prepare("SELECT * FROM usuarios WHERE username=?").get(username);
}
