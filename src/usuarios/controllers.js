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

// pour eventos:

export function viewCrearEventos(req, res) {
  res.render("paginas/crearEventos.ejs");
}

export function viewModificarEvento(req, res) {
  const { id } = req.params;

  const evento = eventos.find((e) => e.id == id);

  if (!evento) {
    return res.status(404).send("No se encontró el evento");
  }
  res.render("paginas/modificarEvento", { evento });
}

// modificación de eventos
export function modificarEvento(req, res) {
  const { id } = req.params;
  const { nombre, descripcion, fecha, lugar, hora, precio, estadoAnimo } =
    req.body;

  // Usar el ID del evento para poder encontrarlo
  const evento = eventos.find((e) => e.id == id); // Deben de importarse de la bases de datos
  // Por ahora lo deje como un array

  if (!evento) {
    return res.status(404).send("No se encontró el evento");
  }

  // Actualizar la info del evento
  evento.nombre = nombre || evento.nombre;
  evento.descripcion = descripcion || evento.descripcion;
  evento.fecha = fecha || evento.fecha;
  evento.lugar = lugar || evento.lugar;
  evento.hora = hora || evento.hora;
  evento.precio = precio || evento.precio;
  evento.estadoAnimo = estadoAnimo || evento.estadoAnimo;

  res.redirect("/contenido/normal");
}

export function borrarEvento(req, res) {
  const { id } = req.params;

  const index = eventos.findIndex((e) => e.id == id);

  if (index == -1) {
    return res.status(404).send("No se ha encontrado el evento");
  }

  eventos.splice(index, 1); // Eliminar un evento

  res.redirect("/contenido/normal");
}

/*import { eventos } from "./data.js";

//Procesa la creación de cada evento
export function crearEvento(req, res) {
  const { nombre, descripcion, fecha, lugar, hora, precio, estadoAnimo } =
    req.body;
  //validar que la información este completo
  if (
    !nombre ||
    !descripcion ||
    !fecha ||
    !lugar ||
    !hora ||
    !precio ||
    !estadoAnimo
  ) {
    return res.render("paginas/crearevento", {
      error: "Necesitamos que completes los campos requeridos",
    });
  }
  //se crea el evento
  const nuevoEvento = {
    id: eventos.length + 1, // identificador único de cada evento
    nombre,
    descripcion,
    fecha,
    hora,
    lugar,
    precio,
    estadoAnimo,
  };

  eventos.push(nuevoEvento);
  res.redirect("/eventos"); //Donde se mostrarán todos los eventos
}

export function viewLogin(req, res) {
  let contenido = "paginas/login";
  if (req.session != null && req.session.login) {
    contenido = "paginas/home";
  }
  res.render("pagina", {
    contenido,
    session: req.session,
  });
}

export function doLogin(req, res) {
  body("username").escape();
  body("password").escape();
  // Capturo las variables username y password
  const username = req.body.username.trim();
  const password = req.body.password.trim();

  try {
    const usuario = Usuario.login(username, password);
    req.session.login = true;
    req.session.nombre = usuario.nombre;
    req.session.esAdmin = usuario.rol === RolesEnum.ADMIN;

    return res.render("pagina", {
      contenido: "paginas/home",
      session: req.session,
    });
  } catch (e) {
    res.render("pagina", {
      contenido: "paginas/login",
      error: "El usuario o contraseña no son válidos",
    });
  }
}

export function doLogout(req, res, next) {
  // https://expressjs.com/en/resources/middleware/session.html
  // logout logic

  // clear the user from the session object and save.
  // this will ensure that re-using the old session id
  // does not have a logged in user
  req.session.login = null;
  req.session.nombre = null;
  req.session.esAdmin = null;
  req.session.save((err) => {
    if (err) next(err);
  });
}

export function viewCrearEvento(req, res) {}

export function viewEventos(req, res) {
  res.render("paginas"),
    {
      contenido: "paginas/visualizarEventos",
      eventos,
    };
}


export function viewMisEventos(req, res) {
  if (!req.session || !req.session.login) {
    return res.redirect("/usuarios/login"); // Redirect to login if user is not authenticated
  }

  const db = getConnection();
  const eventos = db.prepare("SELECT * FROM Eventos WHERE creador = ?").all(req.session.nombre);

  res.render("paginas/misEventos", {
    eventos,
    session: req.session
  });
}





/*
import { body } from 'express-validator';
import { Usuario, RolesEnum } from './Usuario.js';

export function viewLogin(req, res) {
    let contenido = 'paginas/login';
    if (req.session != null && req.session.login) {
        contenido = 'paginas/home'
    }
    res.render('pagina', {
        contenido,
        session: req.session
    });
}

export function doLogin(req, res) {
    body('username').escape();
    body('password').escape();
    // Capturo las variables username y password
    const username = req.body.username.trim();
    const password = req.body.password.trim();

    try {
        const usuario = Usuario.login(username, password);
        req.session.login = true;
        req.session.nombre = usuario.nombre;
        req.session.esAdmin = usuario.rol === RolesEnum.ADMIN;

        return res.render('pagina', {
            contenido: 'paginas/home',
            session: req.session
        });

    } catch (e) {
        res.render('pagina', {
            contenido: 'paginas/login',
            error: 'El usuario o contraseña no son válidos'
        })
    }
}

export function doLogout(req, res, next) {
    // https://expressjs.com/en/resources/middleware/session.html
    // logout logic

    // clear the user from the session object and save.
    // this will ensure that re-using the old session id
    // does not have a logged in user
    req.session.login = null
    req.session.nombre = null;
    req.session.esAdmin = null;
    req.session.save((err) => {
        if (err) next(err);

        // regenerate the session, which is good practice to help
        // guard against forms of session fixation
        req.session.regenerate((err) => {
            if (err) next(err)
            res.redirect('/');
        })
    })
}
    */
