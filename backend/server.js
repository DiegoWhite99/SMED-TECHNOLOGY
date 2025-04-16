// fuen necesario isntalr expresss para relizar un solicitud de los  datos mas extacta y vincularla a mysql//
const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
const bodyparse = require('body-parser');


const app  = express();
const PORT = 3000;
// este port es para el servidor no tiene nada que ver con puerto del mysql //

// Middleware usamos este funcion para la comunicacion entre la base de datos y el front //
app.use(cors());
app.use(bodyparse.urlencoded({ extended: true}));
app.use(bodyparse.json());

// preparamos la conexion //

const conexion = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'smed_admin23.',
    database: 'smed_tecnology'
});

// mensaje de error //

conexion.connect((err)=>{
    if (err) {
        console.error('Error en la conexion del mysql:', err);
        return;
    }
    console.log('Registro exitoso');
});

// ruta del la tabal de registro //

app.post('/registro', (req, res)=> {
    const {Nombre, Apellido, Email, Password } = req.body;

    const sql = 'INSERT INTO smed_registro (Nombre, Apellido, Email, Password) VALUES (?,?,?,?)';
    conexion.query(sql, [Nombre,Apellido,Email,Password], (err, result)=> {
        if (err) {
            console.error('Error al ingresar datos:', err);
            res.status(500).send('Error al registrar un ususario');
            return;
        }
        console.log('Registro insertado:', result);
        res.status(200).send('Usuario registrado exitosamente');
    });
});

// inicio del servidor //

app.listen(PORT, ()=> {
    console.log(`El servidor esta corriendo en http://localhost:${PORT}`);
});