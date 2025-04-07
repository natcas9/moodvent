export function flashMessages(req, res, next) {
  req.setFlash = (msg) => {
    req.session.flashMsg = msg;
  };

  res.locals.getAndClearFlash = () => {
    const msg = req.session.flashMsg;
    delete req.session.flashMsg;
    return msg;
  };

  next();
}
