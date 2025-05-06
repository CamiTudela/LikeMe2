const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

// Configuración del servidor
const app = express();
const port = 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Configuración de la conexión a PostgreSQL
const pool = new Pool({
  user: 'postgres', 
  host: 'localhost',
  database: 'likeme',
  password: 'camila123tudela', 
  port: 5432,
});

// Ruta GET para obtener los posts

app.get('/posts', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM posts');
    res.status(200).json(result.rows);
  } catch (err) {
    console.error('Error al obtener los posts:', err);
    res.status(500).send('Error al obtener los posts');
  }
});



app.post('/posts', async (req, res) => {
  const { titulo, img, descripcion, likes } = req.body;

  try {
    const result = await pool.query(
      'INSERT INTO posts (titulo, img, descripcion, likes) VALUES ($1, $2, $3, $4) RETURNING *',
      [titulo, img, descripcion, likes]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error al crear el post');
  }
});

// Iniciar el servidor en el puerto 3001
app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});

// Ruta PUT para dar like a un post
app.put('/posts/like/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      'UPDATE posts SET likes = likes + 1 WHERE id = $1 RETURNING *',
      [id]
    );

    if (result.rowCount === 0) {
      return res.status(404).send('Post no encontrado');
    }

    res.status(200).json(result.rows[0]);
  } catch (err) {
    console.error('Error al dar like:', err);
    res.status(500).send('Error al dar like al post');
  }
});

// Ruta DELETE para eliminar un post
app.delete('/posts/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query('DELETE FROM posts WHERE id = $1', [id]);

    if (result.rowCount === 0) {
      return res.status(404).send('Post no encontrado');
    }

    res.status(200).send('Post eliminado con éxito');
  } catch (err) {
    console.error('Error al eliminar el post:', err);
    res.status(500).send('Error al eliminar el post');
  }
});
