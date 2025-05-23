import { Evento } from "./Evento.js";
import { render } from "../utils/render.js";
import { validationResult, matchedData } from "express-validator";
import session from "express-session";

export function viewCrearEvento(req, res) {
  render(req, res, "paginas/crearEventos", { session: req.session });
}

export function crearEvento(req, res) {
  const result = validationResult(req);
  if (!result.isEmpty()) {
    return render(req, res, "paginas/crearEventos", {
      errores: result.mapped(),
      datos: req.body,
      session: req.session,
      flash_msg: "Por favor completa todos los campos correctamente",
    });
  }

  const datos = matchedData(req);

  datos.creador = req.session.username;

  console.log(datos);

  try {
    Evento.crear({ ...datos });
    req.setFlash( "Evento creado exitosamente");
    res.redirect("/eventos/visualizarEventos");
  } catch (e) {
    req.log.error("Error creando evento");
    req.log.debug(e.message);
    req.setFlash( "Error al guardar el evento");
    res.redirect("/eventos/crear");
  }
}

export function viewEventos(req, res) {
  const filtros = matchedData(req, { locations: ["query"] });

  try {
    const eventos = Evento.obtenerTodos(filtros);
    render(req, res, "paginas/visualizarEventos", { eventos });
  } catch (e) {
    req.log.error("Error obteniendo eventos");
    req.log.debug(e.message);
    res.status(500).send("Error al obtener eventos");
  }
}

export function viewEditarEvento(req, res) {
  const id = parseInt(req.params.id);
  if (isNaN(id)) return res.status(400).send("ID inválido");

  const evento = Evento.obtenerPorId(id);
  if (!evento) return res.status(404).send("Evento no encontrado");

  render(req, res, "paginas/modificarEvento", { evento });
}

export function modificarEvento(req, res) {
  const result = validationResult(req);
  if (!result.isEmpty()) {
    console.log("Errores de validación:", result.mapped());
    return render(req, res, "paginas/modificarEvento", {
      errores: result.mapped(),
      datos: req.body,
      session: req.session,
      flash_msg: "Por favor completa todos los campos correctamente.",
    });
  }

  const datos = { ...req.body};
  datos.precio = Number(datos.precio);
  const id = parseInt(req.params.id);
  datos.creador = req.session.username;

  try {
    console.log("Datos que se envían a modificar:", datos);
    Evento.modificar(id, datos);
    req.setFlash( "Evento modificado con éxito");
    res.redirect("/eventos/visualizarEventos");
  } catch (e) {
    req.log.error("Error modificando evento",e);
    req.log.debug(e.message);
    req.setFlash("Error al modificar el evento");
    res.redirect(`/eventos/editar/${id}`);
  }
}

export function eliminarEvento(req, res) {
  const id = parseInt(req.params.id);
  if (isNaN(id)) {
    req.setFlash( "ID inválido");
    return res.redirect("/eventos/visualizarEventos");
  } 

  try {
    Evento.eliminar(id);
    req.setFlash("Evento eliminado exitosamente");
    res.redirect("/eventos/visualizarEventos");
  } catch (e) {
    req.log.error("Error eliminando evento");
    req.log.debug(e.message);
    req.setFlash("Error al eliminar el evento");
    res.redirect("/eventos/visualizarEventos");
  }
}

export function viewDetalles(req, res) {
  const id = parseInt(req.params.id);
  if (isNaN(id)) return res.status(400).send("ID inválido");

  const evento = Evento.obtenerPorId(id);
  if (!evento) return res.status(404).send("Evento no encontrado");

  render(req, res, "paginas/detallesEvento", { evento });
}

export function asistirEvento(req, res) {
  const username = req.session?.username;
  const eventoId = req.params.id;
  if (!username || !eventoId) {
    req.setFlash( "Debe estar logueado para asistir");
    return res.redirect("/usuarios/perfil");
  } 

  Evento.asistirEvento(username, eventoId);
  req.setFlash( "Te has registrado al evento");
  res.redirect("/usuarios/perfil");
}

export function cancelarAsistencia(req, res) {
  const username = req.session?.username;
  const eventoId = req.params.id;
  if (!username || !eventoId)  {
    req.setFlash( "Debes estar logueado para cancelar");
    return res.redirect("/usuarios/perfil");
  }

  Evento.cancelarAsistencia(username, eventoId);
  req.setFlash( "Has cancelado tu asistencia");
  res.redirect("/usuarios/perfil");
}

export function viewMoodForm(req, res) {
  render(req, res, "paginas/mood-test", {
    errorTest: null,
    session: req.session,
  });
}

export async function handleMoodTest(req, res) {
  const { FELIZ, TRISTE, RELAJADO, ANSIOSO, ENOJADO, ABURRIDO } = req.body;

  const emociones = {
    FELIZ: parseInt(FELIZ),
    TRISTE: parseInt(TRISTE),
    RELAJADO: parseInt(RELAJADO),
    ANSIOSO: parseInt(ANSIOSO),
    ENOJADO: parseInt(ENOJADO),
    ABURRIDO: parseInt(ABURRIDO),
  };

  const { dominant, sorted } = getDominantEmotion(emociones);

  let error = null;

  if (req.session?.username) {
    console.log(
      "Llamando a guardarResTest con:",
      req.session.username,
      dominant
    );
    const resultado = Evento.guardarResTest(req.session.username, dominant);

    if (resultado?.error) {
      return render(req, res, "paginas/mood-test", {
        session: req.session,
        errorTest: resultado.error,
      });
    }
  }

  render(req, res, "paginas/resultado", {
    session: req.session,
    sortedEmotions: sorted,
    dominantEmotion: dominant,
    errorTest: error,
  });
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
