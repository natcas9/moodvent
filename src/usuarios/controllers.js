import session from "express-session";
import { body, validationResult } from "express-validator";
import bcrypt from "bcryptjs";
import { getConnection } from "../database.js";

//const hashedUserPass = bcrypt.hashSync("userpass", 10);
//const hashedAdminPass = bcrypt.hashSync("adminpass", 10);
//console.log(`BCRYPT 'userpass': ${hashedUserPass}`);
//console.log(`BCRYPT 'adminpass': ${hashedAdminPass}`);

export function registrarUsuario({
  nombre,
  apellido,
  edad,
  email,
  username,
  password,
  role,
}) {
  const db = getConnection();

  const usuarioRegistrado = db
    .prepare("SELECT * FROM usuarios WHERE username = ?")
    .get(username);
  if (usuarioRegistrado) {
    throw new Error("El usuario ya existe");
  }
  const passwordHash = bcrypt.hashSync(password, 10);
  db.prepare(
    "INSERT INTO usuarios (nombre, apellido, edad, email, username, password, role) VALUES (?, ?, ?, ?, ?, ?, ?)"
  ).run(nombre, apellido, edad, email, username, passwordHash, role);
}

export function viewRegistro(req, res) {
  res.render("pagina", { contenido: "paginas/registro", session: req.session });
}

export function doRegistro(req, res) {
  console.log("Datos recibidos en el registro:", req.body);

  const { nombre, apellido, edad, email, username, password, role } = req.body;

  if (
    !nombre ||
    !apellido ||
    !edad ||
    !email ||
    !username ||
    !password ||
    !role
  ) {
    console.error(" Error: Falta un campo en el registro");
    return res.status(400).send("Todos los campos son obligatorios");
  }

  try {
    registrarUsuario({
      nombre,
      apellido,
      edad,
      email,
      username,
      password,
      role,
    });
    res.redirect("/usuarios/login");
  } catch (error) {
    console.error(" Error en el registro:", error);
    res.status(500).send("Error al guardar el usuario");
  }
}
export function viewLogin(req, res) {
  res.render("pagina", {
    contenido: "paginas/login",
    session: req.session,
    error: null,
    errores: {},
    datos: {},
  });
}

export function doLogin(req, res) {
  const errores = validationResult(req);
  const datos = req.body;

  if (!errores.isEmpty()) {
    return res.render("pagina", {
      contenido: "paginas/login",
      session: req.session,
      error: null,
      errores: errores.mapped(), // Mapea errores por campo
      datos,
    });
  }

  const { username, password } = req.body;
  const db = getConnection();
  const user = db
    .prepare("SELECT * FROM usuarios WHERE username = ?")
    .get(username);

  if (!user || !bcrypt.compareSync(password, user.password)) {
    return res.render("pagina", {
      contenido: "paginas/login",
      session: req.session,
      error: "Usuario o contraseña incorrectos",
      errores: {},
      datos,
    });
  }

  req.session.login = true;
  req.session.nombre = user.nombre;
  req.session.esAdmin = user.role === "admin";

  res.redirect(
    user.role === "admin" ? "/contenido/admin" : "/contenido/normal"
  );
}

export function doLogout(req, res, next) {
  // TODO: https://expressjs.com/en/resources/middleware/session.html

  // Eliminar las variables de sesion
  delete req.session.login;
  delete req.session.nombre;
  delete req.session.esAdmin;

  res.render("pagina", { contenido: "paginas/logout", session: req.session });
}
