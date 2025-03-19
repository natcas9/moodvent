import session from "express-session";
import { body, validationResult } from "express-validator";
import bcrypt from "bcryptjs";

//const hashedUserPass = bcrypt.hashSync("userpass", 10);
//const hashedAdminPass = bcrypt.hashSync("adminpass", 10);
//console.log(`BCRYPT 'userpass': ${hashedUserPass}`);
//console.log(`BCRYPT 'adminpass': ${hashedAdminPass}`);

const users = {
  user: {
    password: bcrypt.hashSync("userpass", 10),
    name: "Usuario",
    role: "user",
  },
  admin: {
    password: bcrypt.hashSync("adminpass", 10),
    name: "Administrador",
    role: "admin",
  },
};

export function viewLogin(req, res) {
  res.render("pagina", {
    contenido: "paginas/login",
    session: req.session,
    error: null,
  });
}

export function doLogin(req, res) {
  body("username").escape();
  body("password").escape();

  const { username, password } = req.body;
  const user = users[username];

  if (user && bcrypt.compareSync(password, user.password)) {
    req.session.login = true;
    req.session.nombre = user.name;
    req.session.esAdmin = user.role === "admin";

    return res.redirect(
      user.role === "admin" ? "/contenido/admin" : "/contenido/normal"
    );
  } else {
    return res.render("pagina", {
      contenido: "paginas/login",
      session: req.session,
      error: "Usuario o contraseña incorrectos",
    });
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
