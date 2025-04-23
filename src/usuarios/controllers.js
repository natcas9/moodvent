import { Usuario, UsuarioYaExiste } from "./Usuario.js";
import { validationResult, matchedData } from "express-validator";
import { render } from "../utils/render.js";
import { Evento } from "../eventos/Evento.js";

export function viewLogin(req, res) {
  render(req, res, "paginas/login", {
    datos: {},
    errores: {},
    error: null,
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
    });
  }
}

export function viewRegistro(req, res) {
  render(req, res, "paginas/registro", {
    datos: {},
    errores: {},
    error: null,
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
    });
  }
}

export function doLogout(req, res, next) {
  req.session.login = null;
  req.session.nombre = null;
  req.session.rol = null;
  req.session.save((err) => {
    if (err) return next(err);
    req.session.regenerate((err) => {
      if (err) return next(err);
      res.redirect("/");
    });
  });
}

export function viewHome(req, res) {
  render(req, res, "paginas/home");
}

export function viewPerfil(req, res) {
  const username = req.session?.username;
  if (!username) return res.redirect("/usuarios/login");

  const usuario = Usuario.getPorUsername(username);
  const eventos = Evento.obtenerPorUsuario(username);

  render(req, res, "paginas/perfil", { usuario, eventos });
}
