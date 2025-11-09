import express from 'express';
const router = express.Router();

// ✅ LISTAR TODAS AS ATIVIDADES (com nome da equipe)
router.get('/', async (req, res) => {
  try {
    const executeQuery = req.app.locals.executeQuery;
    const sql = `
      SELECT 
        a.*, 
        e.nome AS equipe_nome
      FROM atividades a
      LEFT JOIN equipes e ON a.equipe_id = e.id
      ORDER BY a.created_at DESC
    `;
    const rows = await executeQuery(sql);

    res.json({
      message: '✅ Atividades listadas com sucesso',
      data: rows
    });
  } catch (error) {
    console.error('❌ Erro no GET /atividades:', error);
    res.status(500).json({ error: 'Erro ao buscar atividades' });
  }
});

// ✅ BUSCAR UMA ATIVIDADE POR ID
router.get('/:id', async (req, res) => {
  try {
    const executeQuery = req.app.locals.executeQuery;
    const sql = `
      SELECT 
        a.*, 
        e.nome AS equipe_nome
      FROM atividades a
      LEFT JOIN equipes e ON a.equipe_id = e.id
      WHERE a.id = ?
    `;
    const rows = await executeQuery(sql, [req.params.id]);

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Atividade não encontrada' });
    }

    res.json({
      message: '✅ Atividade encontrada',
      data: rows[0]
    });
  } catch (error) {
    console.error('❌ Erro no GET /atividades/:id:', error);
    res.status(500).json({ error: 'Erro ao buscar atividade' });
  }
});

// ✅ CRIAR UMA NOVA ATIVIDADE
router.post('/', async (req, res) => {
  try {
    const {
      nome,
      tipo,
      descricao,
      equipe_id,
      equipeId,
      meta_pontos,
      pontos_arrecadados,
      status
    } = req.body;

    if (!nome || !tipo) {
      return res.status(400).json({ error: 'Nome e tipo são obrigatórios' });
    }

    const equipeFinalId = equipe_id || equipeId || null;

    const executeQuery = req.app.locals.executeQuery;
    const sql = `
      INSERT INTO atividades 
      (nome, tipo, descricao, equipe_id, meta_pontos, pontos_arrecadados, status, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, NOW())
    `;
    const params = [
      nome,
      tipo,
      descricao || '',
      equipeFinalId,
      meta_pontos || 0,
      pontos_arrecadados || 0,
      status || 'Pendente'
    ];

    const result = await executeQuery(sql, params);

    res.status(201).json({
      message: '✅ Atividade criada com sucesso!',
      data: {
        id: result.insertId,
        nome,
        tipo,
        descricao,
        equipe_id: equipeFinalId,
        meta_pontos,
        pontos_arrecadados,
        status
      }
    });
  } catch (error) {
    console.error('❌ Erro no POST /atividades:', error);
    res.status(500).json({ error: 'Erro ao criar atividade' });
  }
});

// ✅ ATUALIZAR UMA ATIVIDADE
router.put('/:id', async (req, res) => {
  try {
    const {
      nome,
      tipo,
      descricao,
      equipe_id,
      equipeId,
      meta_pontos,
      pontos_arrecadados,
      status
    } = req.body;

    if (!nome || !tipo) {
      return res.status(400).json({ error: 'Nome e tipo são obrigatórios' });
    }

    const equipeFinalId = equipe_id || equipeId || null;

    const executeQuery = req.app.locals.executeQuery;
    const sql = `
      UPDATE atividades
      SET nome = ?, tipo = ?, descricao = ?, equipe_id = ?, meta_pontos = ?, pontos_arrecadados = ?, status = ?
      WHERE id = ?
    `;
    const params = [
      nome,
      tipo,
      descricao || '',
      equipeFinalId,
      meta_pontos || 0,
      pontos_arrecadados || 0,
      status || 'Pendente',
      req.params.id
    ];

    const result = await executeQuery(sql, params);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Atividade não encontrada' });
    }

    res.json({
      message: '✅ Atividade atualizada com sucesso!',
      data: {
        id: req.params.id,
        nome,
        tipo,
        descricao,
        equipe_id: equipeFinalId,
        meta_pontos,
        pontos_arrecadados,
        status
      }
    });
  } catch (error) {
    console.error('❌ Erro no PUT /atividades/:id:', error);
    res.status(500).json({ error: 'Erro ao atualizar atividade' });
  }
});

// ✅ EXCLUIR UMA ATIVIDADE
router.delete('/:id', async (req, res) => {
  try {
    const executeQuery = req.app.locals.executeQuery;
    const sql = 'DELETE FROM atividades WHERE id = ?';
    const result = await executeQuery(sql, [req.params.id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Atividade não encontrada' });
    }

    res.json({ message: '🗑️ Atividade excluída com sucesso!' });
  } catch (error) {
    console.error('❌ Erro no DELETE /atividades/:id:', error);
    res.status(500).json({ error: 'Erro ao excluir atividade' });
  }
});

export default router;
