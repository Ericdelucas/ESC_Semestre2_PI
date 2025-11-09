import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import multer from 'multer';
import { db } from '../../server.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// === Configuração de uploads ===
const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}-${Math.floor(Math.random() * 1e9)}${ext}`);
  },
});
const upload = multer({ storage });
const router = express.Router();


// === 1️⃣ LISTAR TODOS OS RELATÓRIOS ===
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM relatorios ORDER BY created_at DESC');
    res.json(rows);
  } catch (error) {
    console.error('❌ Erro ao buscar relatórios:', error);
    res.status(500).json({ error: 'Erro ao buscar relatórios' });
  }
});


// === 2️⃣ OBTER RELATÓRIO POR ID ===
router.get('/:id', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM relatorios WHERE id = ?', [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ error: 'Relatório não encontrado' });
    res.json(rows[0]);
  } catch (error) {
    console.error('❌ Erro ao buscar relatório:', error);
    res.status(500).json({ error: 'Erro ao buscar relatório' });
  }
});


// === 3️⃣ CRIAR RELATÓRIO (sem quantidade ou tipo) ===
router.post('/', upload.single('imagem'), async (req, res) => {
  try {
    const { titulo, equipe_id, gerado_por, dados_json } = req.body;
    const arquivo_path = req.file ? `/uploads/${req.file.filename}` : null;

    const sql = `
      INSERT INTO relatorios (titulo, tipo, equipe_id, gerado_por, dados_json, arquivo_path)
      VALUES (?, 'equipe', ?, ?, ?, ?)
    `;

    const params = [
      titulo || 'Relatório de equipe',
      equipe_id || null,
      gerado_por || 'Sistema',
      dados_json || null,
      arquivo_path
    ];

    const [result] = await db.query(sql, params);

    res.status(201).json({
      message: '✅ Relatório criado com sucesso!',
      id: result.insertId,
      arquivo_path
    });
  } catch (error) {
    console.error('❌ Erro ao criar relatório:', error);
    res.status(500).json({ error: 'Erro ao criar relatório', detalhes: error.message });
  }
});


// === 4️⃣ EXCLUIR RELATÓRIO ===
router.delete('/:id', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT arquivo_path FROM relatorios WHERE id = ?', [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ error: 'Relatório não encontrado' });

    const rel = rows[0];
    const filePath = rel.arquivo_path
      ? path.join(__dirname, '..', rel.arquivo_path.replace('/uploads', 'uploads'))
      : null;

    await db.query('DELETE FROM relatorios WHERE id = ?', [req.params.id]);

    if (filePath && fs.existsSync(filePath)) fs.unlinkSync(filePath);

    res.json({ message: '🗑️ Relatório excluído com sucesso!' });
  } catch (error) {
    console.error('❌ Erro ao excluir relatório:', error);
    res.status(500).json({ error: 'Erro ao excluir relatório' });
  }
});


// === 5️⃣ ESTATÍSTICAS GERAIS (pontuação total e doações por equipe) ===
router.get('/stats/equipes', async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT 
        e.id,
        e.nome AS equipe_nome,
        COALESCE(e.pontuacao_total, 0) AS total_pontos,
        COUNT(d.id) AS total_doacoes
      FROM equipes e
      LEFT JOIN doacoes d ON d.equipe_id = e.id
      GROUP BY e.id
      ORDER BY total_pontos DESC
    `);
    res.json({ message: 'Pontuação total por equipe', data: rows });
  } catch (error) {
    console.error('❌ Erro ao buscar estatísticas:', error);
    res.status(500).json({ error: 'Erro ao buscar estatísticas' });
  }
});

export default router;
