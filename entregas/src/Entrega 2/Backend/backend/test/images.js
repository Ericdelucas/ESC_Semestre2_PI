// src/routes/images.js
import express from 'express';
import upload from '../uploadConfig.js'; // ajuste o caminho se necessário
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();
const r = express.Router();

console.log('🟢 [images.js] Rota de imagens inicializada.');

let db;

// Conectar ao MySQL (você pode usar o mesmo pool do server.js se preferir)
async function connectDB() {
  if (!db) {
    db = await mysql.createPool({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'liderancas_empaticas',
    });
    console.log('✅ [images.js] Conectado ao banco.');
  }
}
await connectDB();

// Upload de imagem
r.post('/images', upload.single('image'), async (req, res) => {
  console.log('🟢 [POST /images] Requisição recebida.');

  try {
    if (!req.file) {
      console.warn('⚠️ [POST /images] Nenhum arquivo enviado!');
      return res.status(400).json({ error: 'Nenhum arquivo enviado!' });
    }

    const filepath = req.file.path;
    console.log(`📂 [POST /images] Arquivo recebido: ${req.file.originalname}`);
    console.log(`🧭 Caminho salvo: ${filepath}`);

    await db.execute('INSERT INTO images (img) VALUES (?)', [filepath]);
    console.log('✅ [POST /images] Imagem salva no banco.');

    res.status(201).json({
      message: 'Imagem enviada com sucesso!',
      img: filepath,
    });
  } catch (error) {
    console.error('❌ [POST /images] Erro ao processar upload:', error.message);
    res.status(500).json({ error: error.message });
  }
});

export default r;
