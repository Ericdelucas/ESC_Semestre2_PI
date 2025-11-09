import cron from 'node-cron'
import db from '../src/db.js' // 🔧 ajuste o caminho conforme seu projeto
// Ex: '../db.js' ou '../database/db.js'

// -----------------------------------------------------------------------------
// 🧮 Função principal: recalcular e sincronizar pontuações das equipes
// -----------------------------------------------------------------------------
async function recalcularPontuacoes() {
  console.log('🔁 Iniciando verificação de pontuação das equipes...')

  try {
    // 1️⃣ Buscar todas as equipes
    const [equipes] = await db.query('SELECT id, nome FROM equipes')

    for (const equipe of equipes) {
      const equipeId = equipe.id

      // 2️⃣ Somar pontos de doações
      const [[{ total_doacoes }]] = await db.query(`
        SELECT COALESCE(SUM(pontuacao), 0) AS total_doacoes
        FROM doacoes
        WHERE equipe_id = ?
      `, [equipeId])

      // 3️⃣ Somar pontos de atividades ainda válidas (meta não expirada)
      const [[{ total_ativas }]] = await db.query(`
        SELECT COALESCE(SUM(pontuacao), 0) AS total_ativas
        FROM atividades
        WHERE equipe_id = ? 
          AND (data_fim IS NULL OR data_fim > NOW())
      `, [equipeId])

      // 4️⃣ Somar pontos expirados (para descontar)
      const [[{ total_expiradas }]] = await db.query(`
        SELECT COALESCE(SUM(pontuacao), 0) AS total_expiradas
        FROM atividades
        WHERE equipe_id = ? 
          AND data_fim <= NOW()
      `, [equipeId])

      // 5️⃣ Cálculo final da pontuação total
      let novaPontuacao = (total_doacoes || 0) + (total_ativas || 0) - (total_expiradas || 0)
      if (novaPontuacao < 0) novaPontuacao = 0 // nunca deixa negativo

      // 6️⃣ Atualizar no banco
      await db.query(`
        UPDATE equipes
        SET pontuacao_total = ?
        WHERE id = ?
      `, [novaPontuacao, equipeId])

      console.log(`✅ Pontuação recalculada para equipe "${equipe.nome}": ${novaPontuacao}`)
    }

    console.log('🎯 Verificação concluída com sucesso!')
  } catch (err) {
    console.error('❌ Erro ao recalcular pontuações:', err)
  }
}

// -----------------------------------------------------------------------------
// ⏱️ Agendar o job para rodar automaticamente
// -----------------------------------------------------------------------------

// 🔹 A cada hora
cron.schedule('0 * * * *', () => {
  console.log('🕐 Executando cron: atualização de pontuação de equipes')
  recalcularPontuacoes()
})

// Você pode testar manualmente chamando a função uma vez ao iniciar o servidor:
recalcularPontuacoes()

export default recalcularPontuacoes
