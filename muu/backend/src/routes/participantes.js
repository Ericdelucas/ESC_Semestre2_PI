import express from 'express'
const router = express.Router();

// GET - Listar todos os participantes
router.get('/', async (req, res) => {
  try {
    const executeQuery = req.app.locals.executeQuery;
    const sql = `
      SELECT *
      FROM participantes
      ORDER BY created_at DESC
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
      SELECT *
      FROM participantes
      WHERE id = ?
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

// POST - Criar novo participante (sem edicao_id)
router.post('/', async (req, res) => {
  try {
    const { nome, email, telefone, tipo } = req.body;
    
    if (!nome || !email || !tipo) {
      return res.status(400).json({ error: 'Nome, email e tipo são obrigatórios' });
    }

    const executeQuery = req.app.locals.executeQuery;
    const sql = 'INSERT INTO participantes (nome, email, telefone, tipo) VALUES (?, ?, ?, ?)';
    const params = [nome, email, telefone, tipo];
    
    const result = await executeQuery(sql, params);
    
    res.status(201).json({
      message: 'Participante criado com sucesso',
      data: {
        id: result.insertId,
        nome,
        email,
        telefone,
        tipo
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

// PUT - Atualizar participante (sem edicao_id)
router.put('/:id', async (req, res) => {
  try {
    const { nome, email, telefone, tipo } = req.body;
    
    if (!nome || !email || !tipo) {
      return res.status(400).json({ error: 'Nome, email e tipo são obrigatórios' });
    }

    const executeQuery = req.app.locals.executeQuery;
    const sql = 'UPDATE participantes SET nome = ?, email = ?, telefone = ?, tipo = ? WHERE id = ?';
    const params = [nome, email, telefone, tipo, req.params.id];
    
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
          tipo
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

export default router;
