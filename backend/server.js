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

/**
 * Creates a connection to the MySQL database.
 * 
 * @constant {mysql.Connection} conexion - The MySQL connection instance.
 * @property {string} host - The hostname of the database server (e.g., 'localhost').
 * @property {number} port - The port number on which the database server is running (default: 3306).
 * @property {string} user - The username used to authenticate with the database (e.g., 'root').
 * @property {string} password - The password used to authenticate with the database.
 * @property {string} database - The name of the database to connect to (e.g., 'smed_technology').
 */
const conexion = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'smed_admin23.',
    database: 'smed_technology'
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
    const {nombre, apellido, email, password } = req.body;
    console.log('Datos recibidos:', req.body);

    const sql = 'INSERT INTO smed_registro (nombre, apellido, email, password) VALUES (?,?,?,?)';
    conexion.query(sql, [nombre,apellido,email,password], (err, result)=> {
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