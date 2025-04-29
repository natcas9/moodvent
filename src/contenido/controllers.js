import { render } from "../utils/render.js";
import { SugerenciaFeedback } from "./SugerenciaFeedback.js";


export function viewContenidoNormal(req, res) {
  render(req, res, "paginas/home");
}

export function viewContenidoAdmin(req, res) {
  render(req, res, "paginas/admin");
}


//idk if we should add it here:
export function guardarSugerencia(req, res) {
  const { sugerencia } = req.body;
  if (!sugerencia) {
    req.setFlash("La sugerencia no puede estar vacía");
    return res.redirect("/contenido/admin");
  }
  SugerenciaFeedback.guardar("sugerencia", sugerencia);
  req.setFlash("Sugerencia guardada ✅");
  res.redirect("/contenido/admin");

}

export function guardarFeedback(req, res) {
  const { feedback } = req.body;
  if (!feedback) {
    req.setFlash("El feedback no puede estar vacío");
    return res.redirect("/contenido/admin");
  }
  SugerenciaFeedback.guardar("feedback", feedback);
  req.setFlash("Feedback guardada ✅");
  res.redirect("/contenido/admin");

}

export function verTablaInfo(req, res) {
  const datos = SugerenciaFeedback.obtenerTodos();
  render(req, res, "paginas/tableinfo", {
    datos,
    session: req.session,
  });
}

export function eliminarSugerencia(req, res) {
  const id = req.params.id;
  SugerenciaFeedback.eliminar(id);
 // req.setFlash("Elemento eliminado ✅");
  res.redirect("/contenido/tableinfo");
}
