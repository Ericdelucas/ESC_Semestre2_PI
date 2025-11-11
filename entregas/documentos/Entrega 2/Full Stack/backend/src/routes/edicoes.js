import express from 'express';
const router = express.Router();

/* ============================================================
   ✅ GET - Listar todas as edições
============================================================ */
router.get('/', async (req, res) => {
  console.log('🟡 [ROTA] /api/edicoes chamada');

  try {
    const executeQuery = req.app.locals.executeQuery;

    if (!executeQuery) {
      console.error('❌ ERRO: executeQuery não está definido em app.locals.');
      return res.status(500).json({ error: 'Banco de dados não inicializado corretamente.' });
    }

    const sql = 'SELECT * FROM edicoes ORDER BY created_at DESC';
    const rows = await executeQuery(sql);

    res.json({
      message: 'Edições listadas com sucesso',
      data: rows
    });
  } catch (error) {
    console.error('🔴 ERRO EM /api/edicoes (GET):', error);
    res.status(500).json({ error: error.message || 'Erro interno ao listar edições.' });
  }
});

/* ============================================================
   ✅ GET - Buscar uma edição por ID
============================================================ */
router.get('/:id', async (req, res) => {
  try {
    const executeQuery = req.app.locals.executeQuery;
    const sql = 'SELECT * FROM edicoes WHERE id = ?';
    const params = [req.params.id];
    const rows = await executeQuery(sql, params);

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Edição não encontrada.' });
    }

    res.json({
      message: 'Edição encontrada com sucesso',
      data: rows[0]
    });
  } catch (error) {
    console.error('🔴 ERRO EM /api/edicoes/:id (GET):', error);
    res.status(500).json({ error: error.message });
  }
});

/* ============================================================
   ✅ POST - Criar nova edição
============================================================ */
router.post('/', async (req, res) => {
  try {
    const { nome, dataInicio, dataFim, descricao } = req.body;

    if (!nome || !dataInicio || !dataFim) {
      return res.status(400).json({ error: 'Nome, data de início e data de fim são obrigatórios.' });
    }

    const hoje = new Date();
    const inicio = new Date(dataInicio);
    const fim = new Date(dataFim);

    let status = 'Planejada';
    if (hoje >= inicio && hoje <= fim) status = 'Em Andamento';
    else if (hoje > fim) status = 'Finalizada';

    const executeQuery = req.app.locals.executeQuery;
    const sql = `
      INSERT INTO edicoes (nome, dataInicio, dataFim, descricao, status)
      VALUES (?, ?, ?, ?, ?)
    `;
    const params = [nome, dataInicio, dataFim, descricao, status];

    const result = await executeQuery(sql, params);

    res.status(201).json({
      message: 'Edição criada com sucesso.',
      data: { id: result.insertId, nome, dataInicio, dataFim, descricao, status }
    });
  } catch (error) {
    console.error('🔴 ERRO EM /api/edicoes (POST):', error);
    res.status(500).json({ error: error.message });
  }
});

/* ============================================================
   ✅ PUT - Atualizar uma edição existente
============================================================ */
router.put('/:id', async (req, res) => {
  try {
    const { nome, dataInicio, dataFim, descricao } = req.body;

    if (!nome || !dataInicio || !dataFim) {
      return res.status(400).json({ error: 'Nome, data de início e data de fim são obrigatórios.' });
    }

    const hoje = new Date();
    const inicio = new Date(dataInicio);
    const fim = new Date(dataFim);

    let status = 'Planejada';
    if (hoje >= inicio && hoje <= fim) status = 'Em Andamento';
    else if (hoje > fim) status = 'Finalizada';

    const executeQuery = req.app.locals.executeQuery;
    const sql = `
      UPDATE edicoes
      SET nome = ?, dataInicio = ?, dataFim = ?, descricao = ?, status = ?
      WHERE id = ?
    `;
    const params = [nome, dataInicio, dataFim, descricao, status, req.params.id];

    const result = await executeQuery(sql, params);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Edição não encontrada.' });
    }

    res.json({
      message: 'Edição atualizada com sucesso.',
      data: { id: req.params.id, nome, dataInicio, dataFim, descricao, status }
    });
  } catch (error) {
    console.error('🔴 ERRO EM /api/edicoes/:id (PUT):', error);
    res.status(500).json({ error: error.message });
  }
});

/* ============================================================
   ✅ DELETE - Excluir uma edição
============================================================ */
router.delete('/:id', async (req, res) => {
  try {
    const executeQuery = req.app.locals.executeQuery;
    const sql = 'DELETE FROM edicoes WHERE id = ?';
    const params = [req.params.id];

    const result = await executeQuery(sql, params);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Edição não encontrada.' });
    }

    res.json({
      message: 'Edição excluída com sucesso.',
      changes: result.affectedRows
    });
  } catch (error) {
    console.error('🔴 ERRO EM /api/edicoes/:id (DELETE):', error);
    res.status(500).json({ error: error.message });
  }
});

export default router;
