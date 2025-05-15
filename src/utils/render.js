import { error } from "./helpers.js";

export function render(req, res, contenido, params = {}) {
  res.render("pagina", {
    contenido,
    session: req.session,
    helpers: { error },
    flash_msg: params.flash_msg ?? res.locals.getAndClearFlash?.(),
    ...params,
  });
}
