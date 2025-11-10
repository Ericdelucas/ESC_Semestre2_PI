import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connection } from "./database.js"; // conexão MySQL
import authRouter from "./routes/authRouter.js"; // rotas de autenticação
import participantesRouter from "./routes/participantes.js"; // suas rotas de participantes

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Injetar função global de execução de query no app
app.locals.executeQuery = async (sql, params = []) => {
  const [rows] = await connection.query(sql, params);
  return rows;
};

// Rotas principais
app.use("/api/auth", authRouter);
app.use("/api/participantes", participantesRouter);

// Rota de exemplo
app.get("/usuarios", async (req, res) => {
  try {
    const [rows] = await connection.query("SELECT * FROM usuarios");
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao buscar usuários" });
  }
});

// Health check
app.get("/", (req, res) => {
  res.send("🚀 Servidor funcionando!");
});

export default app;
