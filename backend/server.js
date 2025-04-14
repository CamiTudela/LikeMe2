const express = require('express');
const cors = require('cors');

const app = express();

// Habilitar CORS para todas las rutas
app.use(cors());


app.listen(3001, () => {
  console.log('Servidor escuchando en el puerto 3001');
});
const { Client } = require('pg');

const client = new Client({
  user: 'postgres',
  host: 'localhost',
  database: 'likeme', 
  port: 5432,
});

client.connect()
  .then(() => console.log('Conectado a la base de datos'))
  .catch(err => console.error('Error de conexión', err));

  app.get('/posts', (req, res) => {
    const query = 'SELECT * FROM posts';
  
    client.query(query)
      .then(result => {
        res.json(result.rows);  // Devuelve los registros como respuesta JSON
      })
      .catch(err => {
        console.error('Error al obtener los posts', err);
        res.status(500).send('Error al obtener los posts');
      });
  });

  app.post('/posts', express.json(), (req, res) => {
    const { titulo, img, descripcion, likes } = req.body;
  
    const query = `
      INSERT INTO posts (titulo, img, descripcion, likes)
      VALUES ($1, $2, $3, $4) RETURNING *;
    `;
  
    client.query(query, [titulo, img, descripcion, likes])
      .then(result => {
        res.json(result.rows[0]);  // Devuelve el nuevo post insertado
      })
      .catch(err => {
        console.error('Error al insertar el post', err);
        res.status(500).send('Error al insertar el post');
      });
  });
  