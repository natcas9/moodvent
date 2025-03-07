import session from "express-session";
import { body, validationResult } from "express-validator";

export function viewLogin(req, res) {
  res.render("pagina", {
    contenido: "paginas/login", // Use the login page as content
    session: req.session, // Pass session data
    error: null, // Pass error if any
  });
}

export function doLogin(req, res) {
  const users = {
    user: { password: "userpass", name: "Usuario", role: "user" },
    admin: { password: "adminpass", name: "Administrador", role: "admin" },
  };

  body("username").escape(); // Se asegura que eliminar caracteres problemáticos
  body("password").escape(); // Se asegura que eliminar caracteres problemáticos
  // TODO: tu código aquí

  const { username, password } = req.body;

  if (users[username] && users[username].password === password) {
    req.session.login = true;
    req.session.nombre = users[username].name;
    req.session.esAdmin = users[username].role === "admin";

    if (req.session.esAdmin) {
      return res.redirect("/contenido/admin");
    } else {
      return res.redirect("/contenido/normal");
    }
  } else {
    return res.render("pagina", {
      contenido: "paginas/login",
      session: req.session,
      error: "Usuario o contraseña incorrectos",
    });
  }
}

export function viewContenido(req, res) {
  if (req.session.login) {
    res.render("paginas/contenido.ejs", { usuario: req.session.name });
  } else {
    res.render("paginas/noPermisos.ejs");
  }
}

export function viewContenidoAdmin(req, res) {
  if (req.session.administrator) {
    res.render("paginas/contenidoAdmin.ejs", { usuario: req.session.name });
  } else {
    res.render("paginas/noPermisos.ejs");
  }
}

export function doLogout(req, res, next) {
  // TODO: https://expressjs.com/en/resources/middleware/session.html

  // Eliminar las variables de sesion
  delete req.session.login;
  delete req.session.nombre;
  delete req.session.esAdmin;

  res.render("pagina", { contenido: "paginas/logout", session: req.session });
}

/*export function viewContenidoNormal(req, res) {
    let contenido = 'paginas/noPermisos';
    if (req.session != null && req.session.nombre != null) {
        contenido = 'paginas/normal';
    }
    res.render('pagina', {
        contenido,
        session: req.session
    });
}

export function viewContenidoAdmin(req, res) {
    let contenido = 'paginas/noPermisos';
    if (req.session != null && req.session.login && req.session.nombre === 'Administrador') {
        contenido = 'paginas/admin';
    }
    res.render('pagina', {
        contenido,
        session: req.session
    });
}
    */
