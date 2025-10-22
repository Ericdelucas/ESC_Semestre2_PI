import express from 'express'
const router = express.Router();

// GET - Listar todos os participantes
router.get('/', async (req, res) => {
  try {
    const executeQuery = req.app.locals.executeQuery;
    const sql = `
      SELECT p.*, e.nome as edicao_nome 
      FROM participantes p 
      LEFT JOIN edicoes e ON p.edicao_id = e.id 
      ORDER BY p.created_at DESC
    `;
    
    const rows = await executeQuery(sql);
    
    res.json({
      message: 'Participantes listados com sucesso',
      data: rows
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET - Buscar participante por ID
router.get('/:id', async (req, res) => {
  try {
    const executeQuery = req.app.locals.executeQuery;
    const sql = `
      SELECT p.*, e.nome as edicao_nome 
      FROM participantes p 
      LEFT JOIN edicoes e ON p.edicao_id = e.id 
      WHERE p.id = ?
    `;
    const params = [req.params.id];
    
    const rows = await executeQuery(sql, params);
    
    if (rows.length > 0) {
      res.json({
        message: 'Participante encontrado',
        data: rows[0]
      });
    } else {
      res.status(404).json({ error: 'Participante não encontrado' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET - Buscar participantes por edição
router.get('/edicao/:edicaoId', async (req, res) => {
  try {
    const executeQuery = req.app.locals.executeQuery;
    const sql = `
      SELECT p.*, e.nome as edicao_nome 
      FROM participantes p 
      LEFT JOIN edicoes e ON p.edicao_id = e.id 
      WHERE p.edicao_id = ?
      ORDER BY p.nome
    `;
    const params = [req.params.edicaoId];
    
    const rows = await executeQuery(sql, params);
    
    res.json({
      message: 'Participantes da edição listados com sucesso',
      data: rows
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST - Criar novo participante
router.post('/', async (req, res) => {
  try {
    const { nome, email, telefone, tipo, edicao_id } = req.body;
    
    if (!nome || !email || !tipo) {
      return res.status(400).json({ error: 'Nome, email e tipo são obrigatórios' });
    }

    const executeQuery = req.app.locals.executeQuery;
    const sql = 'INSERT INTO participantes (nome, email, telefone, tipo, edicao_id) VALUES (?, ?, ?, ?, ?)';
    const params = [nome, email, telefone, tipo, edicao_id];
    
    const result = await executeQuery(sql, params);
    
    res.status(201).json({
      message: 'Participante criado com sucesso',
      data: {
        id: result.insertId,
        nome,
        email,
        telefone,
        tipo,
        edicao_id
      }
    });
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      res.status(400).json({ error: 'Email já cadastrado' });
    } else {
      res.status(500).json({ error: error.message });
    }
  }
});

// PUT - Atualizar participante
router.put('/:id', async (req, res) => {
  try {
    const { nome, email, telefone, tipo, edicao_id } = req.body;
    
    if (!nome || !email || !tipo) {
      return res.status(400).json({ error: 'Nome, email e tipo são obrigatórios' });
    }

    const executeQuery = req.app.locals.executeQuery;
    const sql = 'UPDATE participantes SET nome = ?, email = ?, telefone = ?, tipo = ?, edicao_id = ? WHERE id = ?';
    const params = [nome, email, telefone, tipo, edicao_id, req.params.id];
    
    const result = await executeQuery(sql, params);
    
    if (result.affectedRows === 0) {
      res.status(404).json({ error: 'Participante não encontrado' });
    } else {
      res.json({
        message: 'Participante atualizado com sucesso',
        data: {
          id: req.params.id,
          nome,
          email,
          telefone,
          tipo,
          edicao_id
        }
      });
    }
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      res.status(400).json({ error: 'Email já cadastrado' });
    } else {
      res.status(500).json({ error: error.message });
    }
  }
});

// DELETE - Excluir participante
router.delete('/:id', async (req, res) => {
  try {
    const executeQuery = req.app.locals.executeQuery;
    const sql = 'DELETE FROM participantes WHERE id = ?';
    const params = [req.params.id];
    
    const result = await executeQuery(sql, params);
    
    if (result.affectedRows === 0) {
      res.status(404).json({ error: 'Participante não encontrado' });
    } else {
      res.json({
        message: 'Participante excluído com sucesso',
        changes: result.affectedRows
      });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// module.exports = router;
export default router
