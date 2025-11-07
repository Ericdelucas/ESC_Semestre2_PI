import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import multer from 'multer';
import { db } from '../../server.js'; // ✅ Conecta com o banco exportado do server.js

// ========= CONFIGURAÇÃO DE UPLOAD ========= //
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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

// ========= ROTAS ========= //

// ✅ 1. LISTAR TODOS OS RELATÓRIOS
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM relatorios ORDER BY created_at DESC');
    res.json(rows);
  } catch (error) {
    console.error('❌ Erro ao buscar relatórios:', error);
    res.status(500).json({ error: 'Erro ao buscar relatórios' });
  }
});

// ✅ 2. OBTER UM RELATÓRIO POR ID
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await db.query('SELECT * FROM relatorios WHERE id = ?', [id]);
    if (rows.length === 0) return res.status(404).json({ error: 'Relatório não encontrado' });
    res.json(rows[0]);
  } catch (error) {
    console.error('❌ Erro ao buscar relatório:', error);
    res.status(500).json({ error: 'Erro ao buscar relatório' });
  }
});

// ✅ 3. CRIAR UM NOVO RELATÓRIO (com imagem opcional)
router.post('/', upload.single('imagem'), async (req, res) => {
  try {
    const {
      titulo,
      tipo,
      periodo_inicio,
      periodo_fim,
      equipe_id,
      edicao_id,
      gerado_por,
      dados_json
    } = req.body;

    const arquivo_path = req.file ? `/uploads/${req.file.filename}` : null;

    const sql = `
      INSERT INTO relatorios 
      (titulo, tipo, periodo_inicio, periodo_fim, equipe_id, edicao_id, gerado_por, dados_json, arquivo_path)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const params = [
      titulo || 'Relatório sem título',
      tipo || 'equipe',
      periodo_inicio || null,
      periodo_fim || null,
      equipe_id || null,
      edicao_id || null,
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

// ✅ 4. DELETAR RELATÓRIO (e imagem associada)
router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const [rows] = await db.query('SELECT arquivo_path FROM relatorios WHERE id = ?', [id]);
    if (rows.length === 0) return res.status(404).json({ error: 'Relatório não encontrado' });

    const arquivoPath = rows[0].arquivo_path
      ? path.join(__dirname, '..', arquivoPath.replace('/uploads', 'uploads'))
      : null;

    await db.query('DELETE FROM relatorios WHERE id = ?', [id]);

    if (arquivoPath && fs.existsSync(arquivoPath)) {
      fs.unlink(arquivoPath, (err) => {
        if (err) console.warn('⚠️ Erro ao excluir imagem:', err);
      });
    }

    res.json({ message: '🗑️ Relatório excluído com sucesso!' });
  } catch (error) {
    console.error('❌ Erro ao excluir relatório:', error);
    res.status(500).json({ error: 'Erro ao excluir relatório' });
  }
});

export default router;
