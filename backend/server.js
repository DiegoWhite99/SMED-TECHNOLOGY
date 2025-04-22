// fuen necesario isntalr expresss para relizar un solicitud de los  datos mas extacta y vincularla a mysql//
import express from 'express';
import mysql from 'mysql';
import cors from 'cors';
import bodyparse from 'body-parser';
import dotenv from 'dotenv';
dotenv.config(); // Para leer el archivo .env


const app  = express();
const PORT = process.env.PORT;
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
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE
});

// mensaje de error //

conexion.connect((err)=>{
    if (err) {
        console.error('Error en la conexion del mysql:', err);
        return;
    }
    console.log('Conexion exitosa a la base de datos:', conexion.config.database);
});

// ruta del la tabal de login //
app.post(process.env.LOGIN, (req, res)=> {
    const {email, password } = req.body;
    console.log('Datos recibidos en login:', req.body);

    const sql = "SELECT email, password from smed_technology.smed_login WHERE email = ? AND password = ?";
    conexion.query(sql, [email,password], (err, result)=> {
        if (err) {
            console.error('Error al ingresar datos:', err);
            res.status(500).send('Error al consultar un ususario');
            return;
        }

        if (result.length > 0) {
            console.log('Usuario encontrado: ', result);
            // redireccionar a la pagina de support //
            res.status(200).send('<script>alert("Bienvenido a SMED Technology"); window.location.href = "http://127.0.0.1:5500/bootcamp_smed/html/support.html";</script>);');
        } else {
            console.log('Usuario no encontrado');
            res.status(401).send('<script>alert("Credenciales incorrectas"); window.location.href = "http://127.0.0.1:5500/bootcamp_smed/html/login.html";</script>');
        }
    });
});

// ruta del la tabal de registro //

app.post(process.env.REGISTER, (req, res)=> {
    const {nombre, apellido, email, password } = req.body;
    console.log('Datos recibidos en registro:', req.body);

    const sql = 'INSERT INTO smed_technology.smed_registro (nombre, apellido, email, password) VALUES (?,?,?,?)';
    conexion.query(sql, [nombre,apellido,email,password], (err, result)=> {
        if (err) {
            console.error('Error al ingresar datos:', err);
            res.status(500).send('Error al registrar un ususario');
            return;
        }
        console.log('Registro insertado:', result);
        // redireccionar a la pagina de login
        res.status(200).send('<script>alert("Te has registrado exitosamente"); window.location.href = "http://127.0.0.1:5500/bootcamp_smed/html/login.html"</script>');
    });
});

// inicio del servidor //

app.listen(PORT, ()=> {
    console.log(`El servidor esta corriendo en http://localhost:${PORT}`);
});