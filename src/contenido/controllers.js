import session from "express-session";
import { body, validationResult } from "express-validator";
import { getConnection } from "../database";

export function viewLogin(req, res) {
  res.render("pagina", {
    contenido: "paginas/login",
    session: req.session,
    error: null,
  });
}

export function doLogin(req, res) {
  const users = {
    user: { password: "userpass", name: "Usuario", role: "user" },
    admin: { password: "adminpass", name: "Administrador", role: "admin" },
  };

  body("username").escape();
  body("password").escape();

  const { username, password } = req.body;

  if (users[username] && users[username].password === password) {
    req.session.login = true;
    req.session.nombre = users[username].name;
    req.session.esAdmin = users[username].role === "admin";

    if (req.session.esAdmin) {
      return res.redirect("/contenido/admin");
    } else {
      return res.redirect("/contenido/normal");
    }
  } else {
    return res.render("pagina", {
      contenido: "paginas/login",
      session: req.session,
      error: "Usuario o contraseña incorrectos",
    });
  }
}

export function viewContenido(req, res) {
  const db = getConnection();
  const eventos = db.prepare("SELECT * FROM eventos").all();
  let contenido = "paginas/noPermisos";

  res.render("pagina", {
    contenido: "paginas/contenido",
    session: req.session,
    eventos,
  });
}

export function viewContenidoAdmin(req, res) {
  let contenido = "paginas/noPermisos";

  if (req.session && req.session.esAdmin) {
    contenido = "paginas/contenidoAdmin";
  }

  res.render("pagina", {
    contenido,
    session: req.session,
  });
}

export function doLogout(req, res, next) {
  // TODO: https://expressjs.com/en/resources/middleware/session.html

  // Eliminar las variables de sesion
  delete req.session.login;
  delete req.session.nombre;
  delete req.session.esAdmin;

  res.render("pagina", { contenido: "paginas/logout", session: req.session });
}
