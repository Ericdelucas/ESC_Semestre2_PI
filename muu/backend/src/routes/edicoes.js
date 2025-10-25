import express from 'express'

const router = express.Router();

// GET - Listar todas as edições
router.get('/', async (req, res) => {
  try {
    const executeQuery = req.app.locals.executeQuery;
    const sql = 'SELECT * FROM edicoes ORDER BY created_at DESC';
    
    const rows = await executeQuery(sql);
    
    res.json({
      message: 'Edições listadas com sucesso',
      data: rows
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET - Buscar edição por ID
router.get('/', async (req, res) => {
  console.log('🟡 [ROTA] /api/edicoes foi chamada'); // <-- LOG 1

  try {
    console.log('🟡 executeQuery existe?', req.app.locals.executeQuery); // <-- LOG 2

    const executeQuery = req.app.locals.executeQuery;
    const sql = 'SELECT * FROM edicoes ORDER BY created_at DESC';
    console.log('🟡 Rodando SQL:', sql); // <-- LOG 3

    const rows = await executeQuery(sql);
    console.log('🟢 Resultado do banco:', rows); // <-- LOG 4

    res.json({
      message: 'Edições listadas com sucesso',
      data: rows
    });

  } catch (error) {
    console.log('🔴 ERRO DETECTADO NA ROTA: ', error); // <-- LOG 5
    res.status(500).json({ error: error.message || 'Erro desconhecido' });
  }
});


// POST - Criar nova edição
router.post('/', async (req, res) => {
  try {
    const { nome, dataInicio, dataFim, descricao } = req.body;
    
    if (!nome || !dataInicio || !dataFim) {
      return res.status(400).json({ error: 'Nome, data de início e data de fim são obrigatórios' });
    }

    // Calcular status baseado nas datas
    const hoje = new Date();
    const inicio = new Date(dataInicio);
    const fim = new Date(dataFim);
    
    let status = 'Planejada';
    if (hoje >= inicio && hoje <= fim) {
      status = 'Em Andamento';
    } else if (hoje > fim) {
      status = 'Finalizada';
    }

    const executeQuery = req.app.locals.executeQuery;
    const sql = 'INSERT INTO edicoes (nome, dataInicio, dataFim, descricao, status) VALUES (?, ?, ?, ?, ?)';
    const params = [nome, dataInicio, dataFim, descricao, status];
    
    const result = await executeQuery(sql, params);
    
    res.status(201).json({
      message: 'Edição criada com sucesso',
      data: {
        id: result.insertId,
        nome,
        dataInicio,
        dataFim,
        descricao,
        status
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT - Atualizar edição
router.put('/:id', async (req, res) => {
  try {
    const { nome, dataInicio, dataFim, descricao } = req.body;
    
    if (!nome || !dataInicio || !dataFim) {
      return res.status(400).json({ error: 'Nome, data de início e data de fim são obrigatórios' });
    }

    // Calcular status baseado nas datas
    const hoje = new Date();
    const inicio = new Date(dataInicio);
    const fim = new Date(dataFim);
    
    let status = 'Planejada';
    if (hoje >= inicio && hoje <= fim) {
      status = 'Em Andamento';
    } else if (hoje > fim) {
      status = 'Finalizada';
    }

    const executeQuery = req.app.locals.executeQuery;
    const sql = 'UPDATE edicoes SET nome = ?, dataInicio = ?, dataFim = ?, descricao = ?, status = ? WHERE id = ?';
    const params = [nome, dataInicio, dataFim, descricao, status, req.params.id];
    
    const result = await executeQuery(sql, params);
    
    if (result.affectedRows === 0) {
      res.status(404).json({ error: 'Edição não encontrada' });
    } else {
      res.json({
        message: 'Edição atualizada com sucesso',
        data: {
          id: req.params.id,
          nome,
          dataInicio,
          dataFim,
          descricao,
          status
        }
      });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE - Excluir edição
router.delete('/:id', async (req, res) => {
  try {
    const executeQuery = req.app.locals.executeQuery;
    const sql = 'DELETE FROM edicoes WHERE id = ?';
    const params = [req.params.id];
    
    const result = await executeQuery(sql, params);
    
    if (result.affectedRows === 0) {
      res.status(404).json({ error: 'Edição não encontrada' });
    } else {
      res.json({
        message: 'Edição excluída com sucesso',
        changes: result.affectedRows
      });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// module.exports = router;
export default router
