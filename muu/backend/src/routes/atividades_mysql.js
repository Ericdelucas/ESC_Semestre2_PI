// muu/backend/src/routes/atividades_mysql.js
import express from 'express'
// Importar o módulo express
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
    //  Executar a consulta SQL
    const rows = await executeQuery(sql);
    // Retornar os resultados
    res.json({
      message: 'Atividades listadas com sucesso',
      data: rows
    });
    // Tratamento de erros
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
    // Parâmetros da consulta
    const params = [req.params.id];
    // Executar a consulta SQL
    const rows = await executeQuery(sql, params);
    // Verificar se a atividade foi encontrada
    if (rows.length > 0) {
      res.json({
        message: 'Atividade encontrada',
        data: rows[0]
      });
      // Atividade não encontrada
    } else {
      res.status(404).json({ error: 'Atividade não encontrada' });
    }
    // Tratamento de erros
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET - Buscar atividades por equipe
router.get('/equipe/:equipeId', async (req, res) => {
  // Buscar atividades associadas a uma equipe específica
  try {
    const executeQuery = req.app.locals.executeQuery;
    const sql = `
      SELECT a.*, e.nome as equipe_nome 
      FROM atividades a 
      LEFT JOIN equipes e ON a.equipe_id = e.id 
      WHERE a.equipe_id = ?
      ORDER BY a.created_at DESC
    `;
    // Parâmetros da consulta
    const params = [req.params.equipeId];
    // Executar a consulta SQL
    const rows = await executeQuery(sql, params);
    // Retornar os resultados
    res.json({
      message: 'Atividades da equipe listadas com sucesso',
      data: rows
    });
    // Tratamento de erros
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST - Criar nova atividade
router.post('/', async (req, res) => {
  try {
    const { nome, tipo, descricao, equipe_id, meta_financeira, valor_arrecadado, status } = req.body;
    // Validar campos obrigatórios
    if (!nome || !tipo) {
      return res.status(400).json({ error: 'Nome e tipo são obrigatórios' });
    }
// Inserir nova atividade no banco de dados
    const executeQuery = req.app.locals.executeQuery;
    // SQL de inserção
    const sql = 'INSERT INTO atividades (nome, tipo, descricao, equipe_id, meta_financeira, valor_arrecadado, status) VALUES (?, ?, ?, ?, ?, ?, ?)';
    // Parâmetros da consulta
    const params = [nome, tipo, descricao, equipe_id, meta_financeira || 0, valor_arrecadado || 0, status || 'Pendente'];
    // Executar a consulta SQL
    const result = await executeQuery(sql, params);
    // Retornar a resposta de sucesso
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
    // Tratamento de erros
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT - Atualizar atividade
router.put('/:id', async (req, res) => {
  try {
    const { nome, tipo, descricao, equipe_id, meta_financeira, valor_arrecadado, status } = req.body;
    // Validar campos obrigatórios
    if (!nome || !tipo) {
      return res.status(400).json({ error: 'Nome e tipo são obrigatórios' });
    }
// Atualizar atividade no banco de dados
    const executeQuery = req.app.locals.executeQuery;
    // SQL de atualização  
    const sql = 'UPDATE atividades SET nome = ?, tipo = ?, descricao = ?, equipe_id = ?, meta_financeira = ?, valor_arrecadado = ?, status = ? WHERE id = ?';
    // Parâmetros da consulta
    const params = [nome, tipo, descricao, equipe_id, meta_financeira || 0, valor_arrecadado || 0, status || 'Pendente', req.params.id];
    // Executar a consulta SQL
    const result = await executeQuery(sql, params);
    // Verificar se a atividade foi atualizada
    if (result.affectedRows === 0) {
      res.status(404).json({ error: 'Atividade não encontrada' });
    // Retornar a resposta de sucesso
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
    // Tratamento de erros
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
    // Verificar se a atividade foi excluída
    if (result.affectedRows === 0) {
      res.status(404).json({ error: 'Atividade não encontrada' });
    } else {
      res.json({
        message: 'Atividade excluída com sucesso',
        changes: result.affectedRows
      });
    }
    // Tratamento de erros
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// module.exports = router;
export default router
