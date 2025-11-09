import express from 'express';
const router = express.Router();

// 🧮 Função para atualizar a pontuação total da equipe
async function atualizarPontuacaoEquipe(executeQuery, equipe_id) {
  if (!equipe_id) return;
  try {
    const sqlSoma = `
      SELECT COALESCE(SUM(pontuacao), 0) AS total
      FROM doacoes
      WHERE equipe_id = ?
    `;
    const [resultado] = await executeQuery(sqlSoma, [equipe_id]);
    const novaPontuacao = resultado.total || 0;

    await executeQuery(
      'UPDATE equipes SET pontuacao_total = ? WHERE id = ?',
      [novaPontuacao, equipe_id]
    );
  } catch (err) {
    console.error('❌ Erro ao atualizar pontuação da equipe:', err);
  }
}

// ✅ GET - Listar todas as doações
router.get('/', async (req, res) => {
  try {
    const executeQuery = req.app.locals.executeQuery;
    const sql = `
      SELECT d.*, e.nome AS equipe_nome
      FROM doacoes d
      LEFT JOIN equipes e ON d.equipe_id = e.id
      ORDER BY d.created_at DESC
    `;
    const rows = await executeQuery(sql);
    res.json({ message: 'Doações listadas com sucesso', data: rows });
  } catch (error) {
    console.error('Erro ao listar doações:', error);
    res.status(500).json({ error: error.message });
  }
});

// ✅ GET - Buscar uma doação específica
router.get('/:id', async (req, res) => {
  try {
    const executeQuery = req.app.locals.executeQuery;
    const sql = `
      SELECT d.*, e.nome AS equipe_nome
      FROM doacoes d
      LEFT JOIN equipes e ON d.equipe_id = e.id
      WHERE d.id = ?
    `;
    const rows = await executeQuery(sql, [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ error: 'Doação não encontrada' });
    res.json({ message: 'Doação encontrada', data: rows[0] });
  } catch (error) {
    console.error('Erro ao buscar doação:', error);
    res.status(500).json({ error: error.message });
  }
});

// ✅ POST - Criar nova doação (pontuação já vem do front-end)
router.post('/', async (req, res) => {
  try {
    const executeQuery = req.app.locals.executeQuery;
    const {
      alunoResponsavel,
      itemDoacao,
      quantidade,
      campanha,
      doador,
      pontuacao,
      equipe_id
    } = req.body;

    if (!alunoResponsavel || !itemDoacao || !quantidade || !pontuacao || !equipe_id) {
      return res.status(400).json({
        error: 'Campos obrigatórios: alunoResponsavel, itemDoacao, quantidade, pontuacao, equipe_id'
      });
    }

    const sqlInsert = `
      INSERT INTO doacoes 
      (aluno_responsavel, item_doacao, quantidade, campanha, doador, pontuacao, equipe_id, data_doacao)
      VALUES (?, ?, ?, ?, ?, ?, ?, NOW())
    `;
    const params = [alunoResponsavel, itemDoacao, quantidade, campanha, doador, pontuacao, equipe_id];
    const result = await executeQuery(sqlInsert, params);

    await atualizarPontuacaoEquipe(executeQuery, equipe_id);

    res.status(201).json({
      message: '✅ Doação registrada e pontuação da equipe atualizada!',
      data: {
        id: result.insertId,
        alunoResponsavel,
        itemDoacao,
        quantidade,
        campanha,
        doador,
        pontuacao,
        equipe_id
      }
    });
  } catch (error) {
    console.error('Erro ao criar doação:', error);
    res.status(500).json({ error: error.message });
  }
});

// ✅ PUT - Atualizar doação
router.put('/:id', async (req, res) => {
  try {
    const executeQuery = req.app.locals.executeQuery;
    const {
      alunoResponsavel,
      itemDoacao,
      quantidade,
      campanha,
      doador,
      pontuacao,
      equipe_id
    } = req.body;

    if (!alunoResponsavel || !itemDoacao || !quantidade || !pontuacao || !equipe_id) {
      return res.status(400).json({
        error: 'Campos obrigatórios: alunoResponsavel, itemDoacao, quantidade, pontuacao, equipe_id'
      });
    }

    const sqlUpdate = `
      UPDATE doacoes 
      SET aluno_responsavel = ?, item_doacao = ?, quantidade = ?, campanha = ?, doador = ?, pontuacao = ?, equipe_id = ?
      WHERE id = ?
    `;
    const result = await executeQuery(sqlUpdate, [
      alunoResponsavel,
      itemDoacao,
      quantidade,
      campanha,
      doador,
      pontuacao,
      equipe_id,
      req.params.id
    ]);

    await atualizarPontuacaoEquipe(executeQuery, equipe_id);

    if (result.affectedRows === 0) {
      res.status(404).json({ error: 'Doação não encontrada' });
    } else {
      res.json({ message: '✅ Doação atualizada e pontuação da equipe ajustada!' });
    }
  } catch (error) {
    console.error('Erro ao atualizar doação:', error);
    res.status(500).json({ error: error.message });
  }
});

// ✅ DELETE - Excluir doação
router.delete('/:id', async (req, res) => {
  try {
    const executeQuery = req.app.locals.executeQuery;
    const [oldDoacao] = await executeQuery('SELECT equipe_id FROM doacoes WHERE id = ?', [req.params.id]);
    if (!oldDoacao) return res.status(404).json({ error: 'Doação não encontrada' });

    await executeQuery('DELETE FROM doacoes WHERE id = ?', [req.params.id]);
    await atualizarPontuacaoEquipe(executeQuery, oldDoacao.equipe_id);

    res.json({ message: '🗑️ Doação excluída e pontuação da equipe atualizada!' });
  } catch (error) {
    console.error('Erro ao excluir doação:', error);
    res.status(500).json({ error: error.message });
  }
});

// ✅ NOVO: GET - Estatísticas mensais de doações por equipe
router.get('/stats/mensal', async (req, res) => {
  try {
    const executeQuery = req.app.locals.executeQuery;
    const sql = `
      SELECT 
        e.nome AS equipe_nome,
        MONTH(d.data_doacao) AS mes,
        YEAR(d.data_doacao) AS ano,
        COUNT(d.id) AS total_doacoes
      FROM doacoes d
      JOIN equipes e ON d.equipe_id = e.id
      GROUP BY e.nome, ano, mes
      ORDER BY ano, mes
    `;
    const rows = await executeQuery(sql);
    res.json({ message: '📅 Estatísticas mensais de doações', data: rows });
  } catch (error) {
    console.error('Erro ao buscar estatísticas mensais:', error);
    res.status(500).json({ error: error.message });
  }
});

// ✅ Estatísticas de doações (para gráficos)

// 📊 Total de pontos e quantidade de doações por equipe
router.get('/stats/resumo', async (req, res) => {
  try {
    const executeQuery = req.app.locals.executeQuery;
    const sql = `
      SELECT 
        e.nome AS equipe_nome,
        COUNT(d.id) AS total_doacoes,
        COALESCE(SUM(d.pontuacao), 0) AS total_pontos
      FROM equipes e
      LEFT JOIN doacoes d ON e.id = d.equipe_id
      GROUP BY e.id
      ORDER BY total_pontos DESC;
    `;
    const rows = await executeQuery(sql);
    res.json({ message: 'Resumo de doações por equipe', data: { total_por_equipe: rows } });
  } catch (error) {
    console.error('Erro ao gerar resumo de doações:', error);
    res.status(500).json({ error: error.message });
  }
});

// 📅 Quantidade de doações recebidas por mês (para gráfico de linha)
router.get('/stats/mensal', async (req, res) => {
  try {
    const executeQuery = req.app.locals.executeQuery;
    const sql = `
      SELECT 
        e.nome AS equipe_nome,
        MONTH(d.data_doacao) AS mes,
        YEAR(d.data_doacao) AS ano,
        COUNT(d.id) AS total_doacoes,
        COALESCE(SUM(d.pontuacao), 0) AS total_pontos
      FROM doacoes d
      INNER JOIN equipes e ON e.id = d.equipe_id
      GROUP BY e.id, ano, mes
      ORDER BY ano DESC, mes DESC;
    `;
    const rows = await executeQuery(sql);
    res.json({ message: 'Doações mensais por equipe', data: rows });
  } catch (error) {
    console.error('Erro ao gerar estatísticas mensais:', error);
    res.status(500).json({ error: error.message });
  }
});

export default router;
