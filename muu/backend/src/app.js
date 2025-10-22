import express from "express";
import cors from "cors";
import { connection } from "./database.js"; // conexão MySQL

const app = express();
app.use(cors());
app.use(express.json());

// exemplo de rota GET
app.get("/usuarios", async (req, res) => {
  try {
    const [rows] = await connection.query("SELECT * FROM usuarios");
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao buscar usuários" });
  }
});

// rota simples de teste
app.get("/", (req, res) => {
  res.send("Servidor funcionando!");
});

export default app;
