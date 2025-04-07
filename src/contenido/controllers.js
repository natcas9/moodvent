import { render } from "../utils/render.js";

export function viewContenidoNormal(req, res) {
  render(req, res, "paginas/home");
}

export function viewContenidoAdmin(req, res) {
  render(req, res, "paginas/admin");
}
