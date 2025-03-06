import { eventos } from "./data.js";

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

export function modificarEvento(req, res) {
  const { id } = req.params;
  const { nombre, descripcion, fecha, lugar, hora, precio, estadoAnimo } =
    req.body;

  // Usar el ID del evento para poder encontrarlo
  const evento = eventos.find((e) => e.id == id);

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

  res.redirect("/eventos");
}

export function borrarEvento(req, res) {
  const { id } = req.params;

  const index = eventos.findIndex((e) => e.id == id);

  if (index == -1) {
    return res.status(404).send("No se ha encontrado el evento");
  }

  eventos.splice(index, 1); // Eliminar evento

  res.redirect("/eventos");
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

export function viewEventos(req, res) {
  res.render("paginas"),
    {
      contenido: "paginas/visualizarEventos",
      eventos,
    };
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
