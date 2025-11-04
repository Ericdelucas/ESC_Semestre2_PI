import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import mysql from 'mysql2/promise';
import multer from 'multer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// ======== CONFIGURAÇÃO INICIAL ======== //
dotenv.config();
const app = express();
const PORT = process.env.PORT || 3001;

// ======== CONFIGURAÇÕES BÁSICAS ======== //
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// ======== CAMINHOS DO SISTEMA ======== //
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ======== UPLOAD DE IMAGENS ======== //
const uploadDir = path.join(__dirname, 'src', 'uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}-${Math.floor(Math.random() * 1e9)}${ext}`);
  },
});
const upload = multer({ storage });

// Servir imagens estáticas
app.use('/uploads', express.static(uploadDir));

// ======== BANCO DE DADOS (MySQL) ======== //
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'liderancas_empaticas',
  port: process.env.DB_PORT || 3306,
};

let db;

async function connectToDatabase() {
  try {
    db = await mysql.createPool(dbConfig);
    console.log('✅ Conectado ao banco de dados MySQL.');
    await initializeDatabase();
  } catch (error) {
    console.error('❌ Erro ao conectar ao banco:', error);
    process.exit(1);
  }
}

async function initializeDatabase() {
  await db.execute(`
    CREATE TABLE IF NOT EXISTS usuarios (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255),
      email VARCHAR(255) UNIQUE,
      password VARCHAR(255),
      tipo VARCHAR(50) DEFAULT 'aluno',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);
  console.log('🗃️  Tabela "usuarios" verificada.');
}

// Disponibiliza função global de queries
app.locals.executeQuery = async (sql, params = []) => {
  const [rows] = await db.query(sql, params);
  return rows;
};

// ======== ROTAS IMPORTADAS ======== //
import authRouter from './src/routes/authRouter.js';
import edicoesRoutes from './src/routes/edicoes.js';
import participantesRoutes from './src/routes/participantes.js';
import equipesRoutes from './src/routes/equipes.js';
import atividadesRoutes from './src/routes/atividades.js';
import doacoesRoutes from './src/routes/doacoes.js';
import metasRoutes from './src/routes/metas.js';

// ======== ROTAS PRINCIPAIS ======== //
app.use('/api/auth', authRouter);
app.use('/api/edicoes', edicoesRoutes);
app.use('/api/participantes', participantesRoutes);
app.use('/api/equipes', equipesRoutes);
app.use('/api/atividades', atividadesRoutes);
app.use('/api/doacoes', doacoesRoutes);
app.use('/api/metas', metasRoutes);

// ======== ROTAS DE TESTE ======== //
app.get('/', (req, res) => {
  res.json({
    message: '🚀 API Lideranças Empáticas rodando!',
    endpoints: {
      auth: '/api/auth',
      edicoes: '/api/edicoes',
      participantes: '/api/participantes',
    },
  });
});

app.get('/api/health', async (req, res) => {
  try {
    await db.query('SELECT 1');
    res.json({ status: 'ok', database: 'connected', time: new Date() });
  } catch (error) {
    res.status(500).json({ status: 'error', database: 'disconnected', error: error.message });
  }
});

// ======== ERROS ======== //
app.use((req, res) => res.status(404).json({ error: 'Rota não encontrada' }));
app.use((err, req, res, next) => {
  console.error('Erro interno:', err);
  res.status(500).json({ error: 'Erro interno no servidor' });
});

// ======== INICIAR SERVIDOR ======== //
async function startServer() {
  await connectToDatabase();
  app.listen(PORT, () => {
    console.log(`✅ Servidor rodando na porta ${PORT}`);
    console.log(`🌍 Acesse: http://localhost:${PORT}`);
  });
}

startServer();

export default app;
