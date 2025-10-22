import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import imageRoutes from "./routes/images.js";
import authRoutes from './src/routes/authRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Rotas
app.use("/api/images", imageRoutes);
app.use('/api/auth', authRoutes);

// Health check
app.get("/api", (req, res) => res.send("✅ API Funcionando!"));

app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
});
