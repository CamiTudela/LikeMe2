const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");

const app = express();
app.use(cors());
app.use(express.json());

// Conexión a PostgreSQL
const pool = new Pool({
  user: "postgres",
  host: "localhost",
  password: "camila123tudela",
  database: "likeme",
  port: 5432,
});

// Ruta GET - Obtener posts
app.get("/posts", async (req, res) => {
  try {
    const { rows } = await pool.query("SELECT * FROM posts");
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener los posts" });
  }
});

// Ruta POST - Agregar un post
app.post("/posts", async (req, res) => {
  const { titulo, img, descripcion } = req.body;
  try {
    const query =
      "INSERT INTO posts (titulo, img, descripcion, likes) VALUES ($1, $2, $3, 0) RETURNING *";
    const values = [titulo, img, descripcion];
    const { rows } = await pool.query(query, values);
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: "Error al agregar el post" });
  }
});

app.listen(3001, () => {
  console.log("Servidor corriendo en http://localhost:3001");
});

app.post("/posts", async (req, res) => {
    try {
      const { titulo, img, descripcion } = req.body;
      const likes = 0; // Cuando se crea un post nuevo, comienza con 0 likes
  
      const result = await pool.query(
        "INSERT INTO posts (titulo, img, descripcion, likes) VALUES ($1, $2, $3, $4) RETURNING *",
        [titulo, img, descripcion, likes]
      );
  
      res.status(201).json(result.rows[0]);
    } catch (error) {
      console.error("Error al crear el post:", error);
      res.status(500).json({ error: "Error al crear el post" });
    }
  });
  
  app.put("/posts/like/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const result = await pool.query("UPDATE posts SET likes = likes + 1 WHERE id = $1 RETURNING *", [id]);
      res.json(result.rows[0]);
    } catch (error) {
      console.error("Error al dar like:", error);
      res.status(500).send("Error al actualizar los likes");
    }
  });
  