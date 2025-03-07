CREATE TABLE Evento (
    Id_evento INT PRIMARY KEY AUTO_INCREMENT,
    Nombre VARCHAR(255) NOT NULL,
    Descripcion TEXT NOT NULL,
    Fecha DATE NOT NULL,
    Hora TIME NOT NULL,
    Lugar VARCHAR(255) NOT NULL,
    Precio DECIMAL(10,2) NOT NULL,
    Estado_animo ENUM('Feliz', 'Triste', 'Enojado', 'Ansioso', 'Relajado') NOT NULL
);
