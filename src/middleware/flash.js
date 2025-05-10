export function flashMessages(req, res, next) {
  // Establecer el mensaje en la sesión
  req.setFlash = (msg) => {
    req.session.flashMsg = msg;
  };

  // Asegúrate de que getAndClearFlash esté disponible en las vistas
  res.locals.getAndClearFlash = () => {
    const msg = req.session.flashMsg || null; // Si flashMsg no existe, regresamos null
    delete req.session.flashMsg; // Limpiamos después de acceder al mensaje
    return msg;
  };

  next();
}
