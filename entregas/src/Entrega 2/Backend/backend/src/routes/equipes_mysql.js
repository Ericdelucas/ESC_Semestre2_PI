import express from 'express'
const router = express.Router();

// GET - Listar todas as equipes
router.get('/', async (req, res) => {
  try {
    const executeQuery = req.app.locals.executeQuery;
    const sql = `
      SELECT e.*, ed.nome as edicao_nome 
      FROM equipes e 
      LEFT JOIN edicoes ed ON e.edicao_id = ed.id 
      ORDER BY e.created_at DESC
    `;
    
    const rows = await executeQuery(sql);
    
    res.json({
      message: 'Equipes listadas com sucesso',
      data: rows
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET - Buscar equipe por ID
router.get('/:id', async (req, res) => {
  try {
    const executeQuery = req.app.locals.executeQuery;
    const sql = `
      SELECT e.*, ed.nome as edicao_nome 
      FROM equipes e 
      LEFT JOIN edicoes ed ON e.edicao_id = ed.id 
      WHERE e.id = ?
    `;
    const params = [req.params.id];
    
    const rows = await executeQuery(sql, params);
    
    if (rows.length > 0) {
      res.json({
        message: 'Equipe encontrada',
        data: rows[0]
      });
    } else {
      res.status(404).json({ error: 'Equipe não encontrada' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET - Buscar equipes por edição
router.get('/edicao/:edicaoId', async (req, res) => {
  try {
    const executeQuery = req.app.locals.executeQuery;
    const sql = `
      SELECT e.*, ed.nome as edicao_nome 
      FROM equipes e 
      LEFT JOIN edicoes ed ON e.edicao_id = ed.id 
      WHERE e.edicao_id = ?
      ORDER BY e.nome
    `;
    const params = [req.params.edicaoId];
    
    const rows = await executeQuery(sql, params);
    
    res.json({
      message: 'Equipes da edição listadas com sucesso',
      data: rows
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST - Criar nova equipe
router.post('/', async (req, res) => {
  try {
    const { nome, mentor, edicao_id, membros } = req.body;
    
    if (!nome) {
      return res.status(400).json({ error: 'Nome é obrigatório' });
    }

    const executeQuery = req.app.locals.executeQuery;
    const sql = 'INSERT INTO equipes (nome, mentor, edicao_id, membros) VALUES (?, ?, ?, ?)';
    const params = [nome, mentor, edicao_id, membros];
    
    const result = await executeQuery(sql, params);
    
    res.status(201).json({
      message: 'Equipe criada com sucesso',
      data: {
        id: result.insertId,
        nome,
        mentor,
        edicao_id,
        membros
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT - Atualizar equipe
router.put('/:id', async (req, res) => {
  try {
    const { nome, mentor, edicao_id, membros } = req.body;
    
    if (!nome) {
      return res.status(400).json({ error: 'Nome é obrigatório' });
    }

    const executeQuery = req.app.locals.executeQuery;
    const sql = 'UPDATE equipes SET nome = ?, mentor = ?, edicao_id = ?, membros = ? WHERE id = ?';
    const params = [nome, mentor, edicao_id, membros, req.params.id];
    
    const result = await executeQuery(sql, params);
    
    if (result.affectedRows === 0) {
      res.status(404).json({ error: 'Equipe não encontrada' });
    } else {
      res.json({
        message: 'Equipe atualizada com sucesso',
        data: {
          id: req.params.id,
          nome,
          mentor,
          edicao_id,
          membros
        }
      });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE - Excluir equipe
router.delete('/:id', async (req, res) => {
  try {
    const executeQuery = req.app.locals.executeQuery;
    const sql = 'DELETE FROM equipes WHERE id = ?';
    const params = [req.params.id];
    
    const result = await executeQuery(sql, params);
    
    if (result.affectedRows === 0) {
      res.status(404).json({ error: 'Equipe não encontrada' });
    } else {
      res.json({
        message: 'Equipe excluída com sucesso',
        changes: result.affectedRows
      });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// module.exports = router;
export default router
