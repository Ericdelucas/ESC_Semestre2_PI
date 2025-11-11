import express from 'express'
const router = express.Router();

// GET - Listar todas as metas
router.get('/', async (req, res) => {
  try {
    const executeQuery = req.app.locals.executeQuery;
    const sql = 'SELECT * FROM metas ORDER BY data DESC, created_at DESC';
    
    const rows = await executeQuery(sql);
    
    res.json({
      message: 'Metas listadas com sucesso',
      data: rows
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET - Buscar meta por ID
router.get('/:id', async (req, res) => {
  try {
    const executeQuery = req.app.locals.executeQuery;
    const sql = 'SELECT * FROM metas WHERE id = ?';
    const params = [req.params.id];
    
    const rows = await executeQuery(sql, params);
    
    if (rows.length > 0) {
      res.json({
        message: 'Meta encontrada',
        data: rows[0]
      });
    } else {
      res.status(404).json({ error: 'Meta não encontrada' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET - Buscar metas por equipe
router.get('/equipe/:equipe', async (req, res) => {
  try {
    const executeQuery = req.app.locals.executeQuery;
    const sql = 'SELECT * FROM metas WHERE equipe LIKE ? ORDER BY data DESC';
    const params = [`%${req.params.equipe}%`];
    
    const rows = await executeQuery(sql, params);
    
    res.json({
      message: 'Metas da equipe listadas com sucesso',
      data: rows
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET - Buscar metas por status
router.get('/status/:status', async (req, res) => {
  try {
    const executeQuery = req.app.locals.executeQuery;
    const sql = 'SELECT * FROM metas WHERE status = ? ORDER BY data DESC';
    const params = [req.params.status];
    
    const rows = await executeQuery(sql, params);
    
    res.json({
      message: `Metas com status '${req.params.status}' listadas com sucesso`,
      data: rows
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET - Buscar metas por prioridade
router.get('/prioridade/:prioridade', async (req, res) => {
  try {
    const executeQuery = req.app.locals.executeQuery;
    const sql = 'SELECT * FROM metas WHERE prioridade = ? ORDER BY data DESC';
    const params = [req.params.prioridade];
    
    const rows = await executeQuery(sql, params);
    
    res.json({
      message: `Metas com prioridade '${req.params.prioridade}' listadas com sucesso`,
      data: rows
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET - Buscar metas por período
router.get('/periodo/:dataInicio/:dataFim', async (req, res) => {
  try {
    const executeQuery = req.app.locals.executeQuery;
    const sql = 'SELECT * FROM metas WHERE data BETWEEN ? AND ? ORDER BY data DESC';
    const params = [req.params.dataInicio, req.params.dataFim];
    
    const rows = await executeQuery(sql, params);
    
    res.json({
      message: 'Metas do período listadas com sucesso',
      data: rows
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET - Estatísticas de metas
router.get('/stats/resumo', async (req, res) => {
  try {
    const executeQuery = req.app.locals.executeQuery;
    
    // Total de metas
    const totalMetas = await executeQuery('SELECT COUNT(*) as total FROM metas');
    
    // Metas por status
    const metasPorStatus = await executeQuery(`
      SELECT status, COUNT(*) as quantidade
      FROM metas 
      GROUP BY status
    `);
    
    // Metas por prioridade
    const metasPorPrioridade = await executeQuery(`
      SELECT prioridade, COUNT(*) as quantidade
      FROM metas 
      GROUP BY prioridade
    `);
    
    // Metas por equipe
    const metasPorEquipe = await executeQuery(`
      SELECT equipe, COUNT(*) as quantidade
      FROM metas 
      WHERE equipe IS NOT NULL AND equipe != ''
      GROUP BY equipe 
      ORDER BY quantidade DESC
    `);
    
    res.json({
      message: 'Estatísticas de metas',
      data: {
        total_metas: totalMetas[0].total,
        metas_por_status: metasPorStatus,
        metas_por_prioridade: metasPorPrioridade,
        metas_por_equipe: metasPorEquipe
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST - Criar nova meta
router.post('/', async (req, res) => {
  try {
    const { data, titulo, descricao, equipe, prioridade, status } = req.body;
    
    if (!data || !titulo) {
      return res.status(400).json({ error: 'Data e título são obrigatórios' });
    }

    const executeQuery = req.app.locals.executeQuery;
    const sql = 'INSERT INTO metas (data, titulo, descricao, equipe, prioridade, status) VALUES (?, ?, ?, ?, ?, ?)';
    const params = [data, titulo, descricao, equipe, prioridade || 'media', status || 'pendente'];
    
    const result = await executeQuery(sql, params);
    
    res.status(201).json({
      message: 'Meta criada com sucesso',
      data: {
        id: result.insertId,
        data,
        titulo,
        descricao,
        equipe,
        prioridade: prioridade || 'media',
        status: status || 'pendente'
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT - Atualizar meta
router.put('/:id', async (req, res) => {
  try {
    const { data, titulo, descricao, equipe, prioridade, status } = req.body;
    
    if (!data || !titulo) {
      return res.status(400).json({ error: 'Data e título são obrigatórios' });
    }

    const executeQuery = req.app.locals.executeQuery;
    const sql = 'UPDATE metas SET data = ?, titulo = ?, descricao = ?, equipe = ?, prioridade = ?, status = ? WHERE id = ?';
    const params = [data, titulo, descricao, equipe, prioridade || 'media', status || 'pendente', req.params.id];
    
    const result = await executeQuery(sql, params);
    
    if (result.affectedRows === 0) {
      res.status(404).json({ error: 'Meta não encontrada' });
    } else {
      res.json({
        message: 'Meta atualizada com sucesso',
        data: {
          id: req.params.id,
          data,
          titulo,
          descricao,
          equipe,
          prioridade: prioridade || 'media',
          status: status || 'pendente'
        }
      });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PATCH - Atualizar status da meta
router.patch('/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    
    if (!status) {
      return res.status(400).json({ error: 'Status é obrigatório' });
    }

    const validStatuses = ['pendente', 'em_andamento', 'concluida', 'cancelada'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Status inválido. Use: pendente, em_andamento, concluida ou cancelada' });
    }

    const executeQuery = req.app.locals.executeQuery;
    const sql = 'UPDATE metas SET status = ? WHERE id = ?';
    const params = [status, req.params.id];
    
    const result = await executeQuery(sql, params);
    
    if (result.affectedRows === 0) {
      res.status(404).json({ error: 'Meta não encontrada' });
    } else {
      res.json({
        message: 'Status da meta atualizado com sucesso',
        data: {
          id: req.params.id,
          status
        }
      });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE - Excluir meta
router.delete('/:id', async (req, res) => {
  try {
    const executeQuery = req.app.locals.executeQuery;
    const sql = 'DELETE FROM metas WHERE id = ?';
    const params = [req.params.id];
    
    const result = await executeQuery(sql, params);
    
    if (result.affectedRows === 0) {
      res.status(404).json({ error: 'Meta não encontrada' });
    } else {
      res.json({
        message: 'Meta excluída com sucesso',
        changes: result.affectedRows
      });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// module.exports = router;
export default router
