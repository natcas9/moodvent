import { render } from "../utils/render.js";

export function errorHandler(err, req, res, next) {
  if (res.headersSent) {
    req.log?.error?.(err, "An error occurred after response was sent");
    return;
  }

  let statusCode = 500;
  if ("statusCode" in err) statusCode = err.statusCode;

  let message = "Oops, ha ocurrido un error";
  if ("message" in err) message = err.message;

  const loglevel =
    statusCode === 401 || statusCode === 404
      ? "debug"
      : statusCode < 500
      ? "warn"
      : "error";

  req.log?.[loglevel]?.(err);

  if (req.is("application/json")) {
    return res.status(statusCode).json({ code: statusCode, message });
  }

  return render(req, res, "paginas/error", { message });
}
