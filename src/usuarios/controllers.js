import session from "express-session";
import { body, validationResult, matchedData } from "express-validator";
import { logger } from "../logger.js";
import bcrypt from "bcryptjs";
import { getConnection } from "../database.js";

// Función para insertar nuevo usuario
export async function registrarUsuario({
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

  const emailRegistrado = db
    .prepare("SELECT * FROM usuarios WHERE email = ?")
    .get(email);
  if (emailRegistrado) {
    throw new Error("El email ya está registrado");
  }

  const passwordHash = await bcrypt.hash(password, 10);

  db.prepare(
    "INSERT INTO usuarios (nombre, apellido, edad, email, username, password, role) VALUES (?, ?, ?, ?, ?, ?, ?)"
  ).run(nombre, apellido, edad, email, username, passwordHash, role);
}

export function viewRegistro(req, res) {
  res.render("pagina", { contenido: "paginas/registro", session: req.session });
}

// to view the events :

export function viewEventos(req, res) {
  res.render("pagina", { contenido: "paginas/visualizarEventos", session: req.session });
}



export async function doRegistro(req, res) {
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
    await registrarUsuario(datos);
    res.redirect("/usuarios/login");
  } catch (error) {
    logger.error("Error en el registro");
    logger.debug(error.message);
    res.render("pagina", {
      contenido: "paginas/registro",
      session: req.session,
      error: error.message,
      errores: {},
      datos,
    });
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

export async function doLogin(req, res) {
  const errores = validationResult(req);
  const datos = matchedData(req);

  if (!errores.isEmpty()) {
    return res.render("pagina", {
      contenido: "paginas/login",
      session: req.session,
      errores: errores.mapped(),
      datos,
      error: null,
    });
  }

  const { username, password } = datos;
  const user = obtenerUsuario(username);

  if (user) {
    try {
      const passwordMatch = await bcrypt.compare(password, user.password);
      if (passwordMatch) {
        req.session.login = true;
        req.session.nombre = user.nombre;
        req.session.esAdmin = user.role === "admin";

        res.setFlash(`¡Encantado de verte de nuevo, ${user.nombre}!`);

        logger.info(`Inicio de sesión exitoso: ${user.username}`);
        return res.redirect(
          user.role === "admin" ? "/contenido/admin" : "/usuarios/normal"
        );
      }
    } catch (e) {
      logger.error("Error durante login (bcrypt falló)");
      logger.debug(e.message);
    }
  }
  logger.warn(`Intento de login fallido para username: ${username}`);

  return res.render("pagina", {
    contenido: "paginas/login",
    session: req.session,
    error: "Usuario o contraseña incorrectos",
    errores: {},
    datos,
  });
}

function obtenerUsuario(username) {
  const db = getConnection();
  return db.prepare("SELECT * FROM usuarios WHERE username = ?").get(username);
}

export function doLogout(req, res, next) {
  delete req.session.login;
  delete req.session.nombre;
  delete req.session.esAdmin;

  res.render("pagina", { contenido: "paginas/logout", session: req.session });
}
