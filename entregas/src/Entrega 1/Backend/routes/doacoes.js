const express = require('express');
const router = express.Router();

// GET - Listar todas as doações
router.get('/', async (req, res) => {
  try {
    const executeQuery = req.app.locals.executeQuery;
    const sql = 'SELECT * FROM doacoes ORDER BY data_doacao DESC, created_at DESC';
    
    const rows = await executeQuery(sql);
    
    res.json({
      message: 'Doações listadas com sucesso',
      data: rows
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET - Buscar doação por ID
router.get('/:id', async (req, res) => {
  try {
    const executeQuery = req.app.locals.executeQuery;
    const sql = 'SELECT * FROM doacoes WHERE id = ?';
    const params = [req.params.id];
    
    const rows = await executeQuery(sql, params);
    
    if (rows.length > 0) {
      res.json({
        message: 'Doação encontrada',
        data: rows[0]
      });
    } else {
      res.status(404).json({ error: 'Doação não encontrada' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET - Buscar doações por aluno responsável
router.get('/aluno/:aluno', async (req, res) => {
  try {
    const executeQuery = req.app.locals.executeQuery;
    const sql = 'SELECT * FROM doacoes WHERE aluno_responsavel LIKE ? ORDER BY data_doacao DESC';
    const params = [`%${req.params.aluno}%`];
    
    const rows = await executeQuery(sql, params);
    
    res.json({
      message: 'Doações do aluno listadas com sucesso',
      data: rows
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET - Buscar doações por campanha
router.get('/campanha/:campanha', async (req, res) => {
  try {
    const executeQuery = req.app.locals.executeQuery;
    const sql = 'SELECT * FROM doacoes WHERE campanha LIKE ? ORDER BY data_doacao DESC';
    const params = [`%${req.params.campanha}%`];
    
    const rows = await executeQuery(sql, params);
    
    res.json({
      message: 'Doações da campanha listadas com sucesso',
      data: rows
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET - Estatísticas de doações
router.get('/stats/resumo', async (req, res) => {
  try {
    const executeQuery = req.app.locals.executeQuery;
    
    // Total de doações
    const totalDoacoes = await executeQuery('SELECT COUNT(*) as total FROM doacoes');
    
    // Total de pontuação
    const totalPontuacao = await executeQuery('SELECT SUM(pontuacao) as total FROM doacoes');
    
    // Total por item
    const totalPorItem = await executeQuery(`
      SELECT item_doacao, COUNT(*) as quantidade, SUM(quantidade) as total_quantidade, SUM(pontuacao) as total_pontos
      FROM doacoes 
      GROUP BY item_doacao 
      ORDER BY total_pontos DESC
    `);
    
    // Top alunos
    const topAlunos = await executeQuery(`
      SELECT aluno_responsavel, COUNT(*) as total_doacoes, SUM(pontuacao) as total_pontos
      FROM doacoes 
      GROUP BY aluno_responsavel 
      ORDER BY total_pontos DESC 
      LIMIT 10
    `);
    
    res.json({
      message: 'Estatísticas de doações',
      data: {
        total_doacoes: totalDoacoes[0].total,
        total_pontuacao: totalPontuacao[0].total || 0,
        total_por_item: totalPorItem,
        top_alunos: topAlunos
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST - Criar nova doação
router.post('/', async (req, res) => {
  try {
    const { data_doacao, aluno_responsavel, item_doacao, quantidade, campanha, doador, pontuacao } = req.body;
    
    if (!data_doacao || !aluno_responsavel || !item_doacao || !quantidade || !pontuacao) {
      return res.status(400).json({ error: 'Data, aluno responsável, item, quantidade e pontuação são obrigatórios' });
    }

    const executeQuery = req.app.locals.executeQuery;
    const sql = 'INSERT INTO doacoes (data_doacao, aluno_responsavel, item_doacao, quantidade, campanha, doador, pontuacao) VALUES (?, ?, ?, ?, ?, ?, ?)';
    const params = [data_doacao, aluno_responsavel, item_doacao, quantidade, campanha, doador, pontuacao];
    
    const result = await executeQuery(sql, params);
    
    res.status(201).json({
      message: 'Doação criada com sucesso',
      data: {
        id: result.insertId,
        data_doacao,
        aluno_responsavel,
        item_doacao,
        quantidade,
        campanha,
        doador,
        pontuacao
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT - Atualizar doação
router.put('/:id', async (req, res) => {
  try {
    const { data_doacao, aluno_responsavel, item_doacao, quantidade, campanha, doador, pontuacao } = req.body;
    
    if (!data_doacao || !aluno_responsavel || !item_doacao || !quantidade || !pontuacao) {
      return res.status(400).json({ error: 'Data, aluno responsável, item, quantidade e pontuação são obrigatórios' });
    }

    const executeQuery = req.app.locals.executeQuery;
    const sql = 'UPDATE doacoes SET data_doacao = ?, aluno_responsavel = ?, item_doacao = ?, quantidade = ?, campanha = ?, doador = ?, pontuacao = ? WHERE id = ?';
    const params = [data_doacao, aluno_responsavel, item_doacao, quantidade, campanha, doador, pontuacao, req.params.id];
    
    const result = await executeQuery(sql, params);
    
    if (result.affectedRows === 0) {
      res.status(404).json({ error: 'Doação não encontrada' });
    } else {
      res.json({
        message: 'Doação atualizada com sucesso',
        data: {
          id: req.params.id,
          data_doacao,
          aluno_responsavel,
          item_doacao,
          quantidade,
          campanha,
          doador,
          pontuacao
        }
      });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE - Excluir doação
router.delete('/:id', async (req, res) => {
  try {
    const executeQuery = req.app.locals.executeQuery;
    const sql = 'DELETE FROM doacoes WHERE id = ?';
    const params = [req.params.id];
    
    const result = await executeQuery(sql, params);
    
    if (result.affectedRows === 0) {
      res.status(404).json({ error: 'Doação não encontrada' });
    } else {
      res.json({
        message: 'Doação excluída com sucesso',
        changes: result.affectedRows
      });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;

