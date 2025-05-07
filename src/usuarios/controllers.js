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

  try {
    const usuario = Usuario.getPorUsername(username);
    const eventosCreados = Evento.obtenerPorUsuario(username);
    const eventosAsistidos = Evento.obtenerAsistenciasPorUsuario(username);

    render(req, res, "paginas/perfil", {
      usuario,
      eventos: eventosCreados,
      eventosAsistidos,
      session: req.session,
    });
  } catch (e) {
    req.log.error("Error al mostrar perfil");
    req.log.debug(e.message);
    res.status(500).send("Error al cargar el perfil");
  }
}

<<<<<<< Updated upstream
export async function viewHistorial(req, res) {
  const username = req.session?.username;
  if (!username) return res.redirect("/usuarios/perfil");

  try {
    const historial = Evento.obtenerResPorUsuario(username);
=======
export function viewMoodForm(req, res) {
  render(req, res, "paginas/mood-test", {
    session: req.session,
  });
}

export async function handleMoodTest(req, res) {
  try {
    const { FELIZ, TRISTE, RELAJADO, ANSIOSO, ENOJADO, ABURRIDO } = req.body;
    const emociones = {
      FELIZ: parseInt(FELIZ),
      TRISTE: parseInt(TRISTE),
      RELAJADO: parseInt(RELAJADO),
      ANSIOSO: parseInt(ANSIOSO),
      ENOJADO: parseInt(ENOJADO),
      ABURRIDO: parseInt(ABURRIDO),
    };
>>>>>>> Stashed changes

    const { dominant, sorted } = getDominantEmotion(emociones);

    if (req.session?.username) {
      Evento.guardarResTest(req.session.username, dominant);
    }

    res.render("pagina", {
      contenido: "paginas/resultado",
      session: req.session,
      sortedEmotions: sorted,
      dominantEmotion: dominant,
    });
  } catch (e) {
    req.log?.error("Error procesando el test de estado de ánimo");
    req.log?.debug(e.message);
    res.status(500).send("Ocurrió un error al procesar el test");
  }
}

function getDominantEmotion(emociones) {
  const entrada = Object.entries(emociones);
  const priority = [
    "FELIZ",
    "RELAJADO",
    "TRISTE",
    "ANSIOSO",
    "ENOJADO",
    "ABURRIDO",
  ];

  entrada.sort((a, b) => {
    if (b[1] !== a[1]) return b[1] - a[1];
    return priority.indexOf(a[0]) - priority.indexOf(b[0]);
  });

  return {
    dominant: entrada[0][0],
    sorted: entrada.map(([key]) => key),
  };
}
