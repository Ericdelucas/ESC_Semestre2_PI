import express from 'express'
const router = express.Router();

// GET - Listar todas as atividades
router.get('/', async (req, res) => {
  try {
    const executeQuery = req.app.locals.executeQuery;
    const sql = `
      SELECT a.*, e.nome as equipe_nome 
      FROM atividades a 
      LEFT JOIN equipes e ON a.equipe_id = e.id 
      ORDER BY a.created_at DESC
    `;
    
    const rows = await executeQuery(sql);
    
    res.json({
      message: 'Atividades listadas com sucesso',
      data: rows
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET - Buscar atividade por ID
router.get('/:id', async (req, res) => {
  try {
    const executeQuery = req.app.locals.executeQuery;
    const sql = `
      SELECT a.*, e.nome as equipe_nome 
      FROM atividades a 
      LEFT JOIN equipes e ON a.equipe_id = e.id 
      WHERE a.id = ?
    `;
    const params = [req.params.id];
    
    const rows = await executeQuery(sql, params);
    
    if (rows.length > 0) {
      res.json({
        message: 'Atividade encontrada',
        data: rows[0]
      });
    } else {
      res.status(404).json({ error: 'Atividade não encontrada' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET - Buscar atividades por equipe
router.get('/equipe/:equipeId', async (req, res) => {
  try {
    const executeQuery = req.app.locals.executeQuery;
    const sql = `
      SELECT a.*, e.nome as equipe_nome 
      FROM atividades a 
      LEFT JOIN equipes e ON a.equipe_id = e.id 
      WHERE a.equipe_id = ?
      ORDER BY a.created_at DESC
    `;
    const params = [req.params.equipeId];
    
    const rows = await executeQuery(sql, params);
    
    res.json({
      message: 'Atividades da equipe listadas com sucesso',
      data: rows
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST - Criar nova atividade
router.post('/', async (req, res) => {
  try {
    const { nome, tipo, descricao, equipe_id, meta_financeira, valor_arrecadado, status } = req.body;
    
    if (!nome || !tipo) {
      return res.status(400).json({ error: 'Nome e tipo são obrigatórios' });
    }

    const executeQuery = req.app.locals.executeQuery;
    const sql = 'INSERT INTO atividades (nome, tipo, descricao, equipe_id, meta_financeira, valor_arrecadado, status) VALUES (?, ?, ?, ?, ?, ?, ?)';
    const params = [nome, tipo, descricao, equipe_id, meta_financeira || 0, valor_arrecadado || 0, status || 'Pendente'];
    
    const result = await executeQuery(sql, params);
    
    res.status(201).json({
      message: 'Atividade criada com sucesso',
      data: {
        id: result.insertId,
        nome,
        tipo,
        descricao,
        equipe_id,
        meta_financeira: meta_financeira || 0,
        valor_arrecadado: valor_arrecadado || 0,
        status: status || 'Pendente'
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT - Atualizar atividade
router.put('/:id', async (req, res) => {
  try {
    const { nome, tipo, descricao, equipe_id, meta_financeira, valor_arrecadado, status } = req.body;
    
    if (!nome || !tipo) {
      return res.status(400).json({ error: 'Nome e tipo são obrigatórios' });
    }

    const executeQuery = req.app.locals.executeQuery;
    const sql = 'UPDATE atividades SET nome = ?, tipo = ?, descricao = ?, equipe_id = ?, meta_financeira = ?, valor_arrecadado = ?, status = ? WHERE id = ?';
    const params = [nome, tipo, descricao, equipe_id, meta_financeira || 0, valor_arrecadado || 0, status || 'Pendente', req.params.id];
    
    const result = await executeQuery(sql, params);
    
    if (result.affectedRows === 0) {
      res.status(404).json({ error: 'Atividade não encontrada' });
    } else {
      res.json({
        message: 'Atividade atualizada com sucesso',
        data: {
          id: req.params.id,
          nome,
          tipo,
          descricao,
          equipe_id,
          meta_financeira: meta_financeira || 0,
          valor_arrecadado: valor_arrecadado || 0,
          status: status || 'Pendente'
        }
      });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE - Excluir atividade
router.delete('/:id', async (req, res) => {
  try {
    const executeQuery = req.app.locals.executeQuery;
    const sql = 'DELETE FROM atividades WHERE id = ?';
    const params = [req.params.id];
    
    const result = await executeQuery(sql, params);
    
    if (result.affectedRows === 0) {
      res.status(404).json({ error: 'Atividade não encontrada' });
    } else {
      res.json({
        message: 'Atividade excluída com sucesso',
        changes: result.affectedRows
      });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// module.exports = router;
export default router
