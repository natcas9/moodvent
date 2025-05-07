import { Usuario, UsuarioYaExiste } from "./Usuario.js";
import { validationResult, matchedData } from "express-validator";
import { render } from "../utils/render.js";
import { Evento } from "../eventos/Evento.js";
import { getConnection } from "../database.js";
import session from "express-session";

export function viewLogin(req, res) {
  render(req, res, "paginas/login", {
    datos: {},
    errores: {},
    error: null,
    session: req.session,
  });
}

export async function doLogin(req, res) {
  const result = validationResult(req);
  const datos = matchedData(req);

  if (!result.isEmpty()) {
    return render(req, res, "paginas/login", {
      errores: result.mapped(),
      datos,
      error: null,
      session: req.session,
    });
  }

  try {
    const usuario = await Usuario.login(datos.username, datos.password);
    req.session.login = true;
    req.session.nombre = usuario.nombre;
    req.session.rol = usuario.role;
    req.session.username = usuario.username;
  

    req.setFlash(`¡Encantado de verte de nuevo, ${usuario.nombre}!`);
    return res.redirect(
      usuario.role === "admin" ? "/contenido/admin" : "/contenido/normal"
    );
  } catch (e) {
    req.log.warn(` Login fallido para '${datos.username}'`);
    req.log.debug(e.message);
    return render(req, res, "paginas/login", {
      error: "Usuario o contraseña incorrectos",
      datos,
      errores: {},
      session: req.session,
    });
  }
}

export function viewRegistro(req, res) {
  render(req, res, "paginas/registro", {
    datos: {},
    errores: {},
    error: null,
    session: req.session,
  });
}

export async function doRegistro(req, res) {
  const result = validationResult(req);
  const datos = matchedData(req);

  if (!result.isEmpty()) {
    return render(req, res, "paginas/registro", {
      errores: result.mapped(),
      datos,
      error: null,
      session: req.session,
    });
  }

  try {
    datos.role = "user";
    await Usuario.registro(datos);
    req.setFlash("¡Usuario registrado correctamente!");
    return res.redirect("/usuarios/login");
  } catch (e) {
    req.log.error(`Error al registrar '${datos.username}'`);
    req.log.debug(e.message);
    return render(req, res, "paginas/registro", {
      error: e instanceof UsuarioYaExiste ? "El usuario ya existe" : e.message,
      errores: {},
      datos,
      session: req.session,
    });
  }
}

export function doLogout(req, res, next) {
  req.session.login = null;
  req.session.nombre = null;
  req.session.rol = null;
  req.session.username = null;

  req.session.save((err) => {
    if (err) return next(err);
    req.session.regenerate((err) => {
      if (err) return next(err);
      res.redirect("/");
    });
  });
}

export function viewHome(req, res) {
  render(req, res, "paginas/home", {
    session: req.session,
  });
}

export function viewPerfil(req, res) {
  const username = req.session?.username;
  if (!username) return res.redirect("/usuarios/login");

  const usuario = Usuario.getPorUsername(username);
  const eventosCreados = Evento.obtenerPorUsuario(username);
  const eventosAsistidos = Evento.obtenerAsistenciasPorUsuario(username);

  render(req, res, "paginas/perfil", {
    usuario,
    eventos: eventosCreados,
    eventosAsistidos,
    session: req.session,
  });
}

export async function viewHistorial(req,res) {
  const username = req.session?.username;
  if (!username) return res.redirect("/usuarios/perfil");

  const db = getConnection();

  const historial = db.prepare(`
    SELECT fecha, mood FROM TestResults
    WHERE username = ?
    ORDER BY fecha desc
  `).all(username);

  render(req,res, "paginas/historial", {
    TestResults: historial,
    session: req.session,
  });

}
