import { Evento } from "./Evento.js";
import { render } from "../utils/render.js";
import session from "express-session";

export function viewCrearEvento(req, res) {
  render(req, res, "paginas/crearEventos");
}

export function crearEvento(req, res) {
  try {
    const { nombre, descripcion, fecha, hora, lugar, precio, estadoAnimo } =
      req.body;

    if (
      !nombre ||
      !descripcion ||
      !fecha ||
      !hora ||
      !lugar ||
      !precio ||
      !estadoAnimo
    ) {
      throw new Error("Todos los campos son obligatorios");
    }

    Evento.crear({
      nombre,
      descripcion,
      fecha,
      hora,
      lugar,
      precio,
      estadoAnimo,
    });
    res.redirect("/eventos/visualizarEventos");
  } catch (e) {
    req.log.error("Error creando evento");
    req.log.debug(e.message);
    res.status(500).send("Error al guardar el evento");
  }
}

export function viewEventos(req, res) {
  const filtros = {
    tematica: req.query.tematica,
    ubicacion: req.query.ubicacion,
    fecha: req.query.fecha,
    precio: req.query.precio ? parseFloat(req.query.precio) : undefined,
    estadoAnimo: req.query.estadoAnimo,
  };

  const eventos = Evento.obtenerTodos(filtros);
  render(req, res, "paginas/visualizarEventos", { eventos });
}

export function viewEditarEvento(req, res) {
  const evento = Evento.obtenerPorId(req.params.id);
  if (!evento) return res.status(404).send("Evento no encontrado");
  render(req, res, "paginas/modificarEvento", { evento });
}

export function modificarEvento(req, res) {
  try {
    Evento.modificar(req.params.id, req.body);
    res.redirect("/eventos/visualizarEventos");
  } catch (e) {
    req.log.error("Error modificando evento");
    req.log.debug(e.message);
    res.status(500).send("Error al modificar el evento");
  }
}

export function eliminarEvento(req, res) {
  try {
    Evento.eliminar(req.params.id);
    res.redirect("/eventos/visualizarEventos");
  } catch (e) {
    req.log.error("Error eliminando evento");
    req.log.debug(e.message);
    res.status(500).send("Error al eliminar el evento");
  }
}

export function viewDetalles(req, res) {
  const evento = Evento.porId(req.params.id);
  if (!evento) return res.status(404).send("Evento no encontrado");
  render(req, res, "paginas/detallesEvento", { evento });
}


export function viewProfile(req,res) {
  res.render("pagina", { contenido: "paginas/home", session: req.session});
}

export function viewMoodForm(req,res) {
  res.render("pagina", { contenido: "paginas/mood-test", session: req.session});
}

export function handleMoodTest(req,res) {
  const { FELIZ, TRISTE, RELAJADO, ANSIOSO, ENOJADO, ABURRIDO} = req.body;

  const emociones = {
    FELIZ: parseInt(FELIZ),
    TRISTE: parseInt(TRISTE),
    RELAJADO: parseInt(RELAJADO),
    ANSIOSO: parseInt(ANSIOSO),
    ENOJADO: parseInt(ENOJADO),
    ABURRIDO: parseInt(ABURRIDO)
  };

  const { dominant, sorted } = getDominantEmotion(emociones);


  res.render("pagina",{ 
      contenido: "paginas/resultado",
      session: req.session,
      sortedEmotions: sorted,
      dominantEmotion: dominant 
    });
}

function getDominantEmotion(emociones) {
  const entrada = Object.entries(emociones);

  const priority = [ "FELIZ" , "RELAJADO", "TRISTE", "ANSIOSO", "ENOJADO", "ABURRIDO"];

  entrada.sort((a,b) => {
    if (b[1] !== a[1] ) return b[1] - a[1];
    return priority.indexOf(a[0]) - priority.indexOf(b[0]);
  });
  return {
    dominant: entrada[0][0],
    sorted: entrada.map(([key]) => key)
  };
}