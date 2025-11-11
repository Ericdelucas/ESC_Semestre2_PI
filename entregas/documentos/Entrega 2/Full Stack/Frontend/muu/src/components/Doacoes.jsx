import { useState, useEffect } from 'react'
import StudentInput from './Monitoring/StudentInput'
import axios from 'axios'

function Doacoes({ active, participantes = [], equipes: equipesProp = [], doacoes = [], onDoacoesChange, userType }) {
  const [showModal, setShowModal] = useState(false)
  const [equipes, setEquipes] = useState(equipesProp || [])

  const [novaDoacao, setNovaDoacao] = useState({
    data_doacao: '',
    aluno_responsavel: '',
    item_doacao: '',
    quantidade: '',
    campanha: '',
    doador: '',
    pontuacao: 0,
    equipe_id: '' // 🔹 adiciona o campo de equipe
  })

  // 🔹 Buscar equipes do backend caso não venham por props
  useEffect(() => {
    const fetchEquipes = async () => {
      try {
        if (!equipesProp?.length) {
          const eqRes = await axios.get('http://localhost:3001/api/equipes')
          const lista = Array.isArray(eqRes.data) ? eqRes.data : (eqRes.data?.data || [])
          setEquipes(lista)
        }
      } catch (error) {
        console.error('❌ Erro ao carregar equipes:', error)
      }
    }
    fetchEquipes()
  }, [])

  const handleAddDonation = (novaDonacao) => {
    const novasDoacoes = [novaDonacao, ...doacoes]
    if (onDoacoesChange) onDoacoesChange(novasDoacoes)
  }

  // 🔹 Enviar doação para o backend
  const handleSalvarDoacao = async () => {
    try {
      if (!novaDoacao.equipe_id) {
        alert('Por favor, selecione uma equipe antes de salvar.')
        return
      }

      const response = await fetch('http://localhost:3001/api/doacoes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(novaDoacao)
      })
      if (!response.ok) throw new Error('Erro ao registrar doação')

      const data = await response.json()
      handleAddDonation(data.data)
      setShowModal(false)
      alert('✅ Doação registrada com sucesso e pontos atualizados na equipe!')
    } catch (error) {
      console.error(error)
      alert('❌ Erro ao registrar a doação.')
    }
  }

  // 🔹 Exportar dados
  const handleExportarDados = () => {
    const dados = {
      timestamp: new Date().toISOString(),
      totalDoacoes: doacoes.length,
      totalPontos: doacoes.reduce((total, doacao) => total + doacao.pontuacao, 0),
      totalQuantidade: doacoes.reduce((total, doacao) => total + doacao.quantidade, 0),
      doacoes
    }

    const dataStr = JSON.stringify(dados, null, 2)
    const blob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `doacoes_${new Date().toISOString().split('T')[0]}.json`
    link.click()
    URL.revokeObjectURL(url)
    alert('Dados de doações exportados com sucesso!')
  }

  const handleVerRelatorios = () => {
    alert('Redirecionando para relatórios de doações...')
  }

  // 🔹 Estatísticas básicas
  const totalDoacoes = doacoes.length
  const totalPontos = doacoes.reduce((total, d) => total + (d.pontuacao || 0), 0)
  const totalQuantidade = doacoes.reduce((total, d) => total + Number(d.quantidade || 0), 0)
  const alunosAtivos = [...new Set(doacoes.map(d => d.aluno_responsavel))].length

  if (!active) return null

  return (
    <section className={`section ${active ? 'active' : ''}`}>
      <div className="container">
        <div className="section-header">
          <h2>Sistema de Doações</h2>
          {userType !== 'aluno' && (
            <div className="section-actions">
              <button className="btn btn-outline" onClick={handleExportarDados}>
                <i className="fas fa-download"></i> Exportar Dados
              </button>
              <button className="btn btn-primary" onClick={handleVerRelatorios}>
                <i className="fas fa-chart-bar"></i> Ver Relatórios
              </button>
            </div>
          )}
        </div>

        {/* Estatísticas gerais */}
        {userType !== 'aluno' && (
          <>
            <div className="donations-stats">
              <div className="stat-card donations">
                <i className="fas fa-hand-holding-heart"></i>
                <div className="stat-info">
                  <h3>{totalDoacoes}</h3>
                  <p>Total de Doações</p>
                </div>
              </div>
              <div className="stat-card points">
                <i className="fas fa-star"></i>
                <div className="stat-info">
                  <h3>{totalPontos}</h3>
                  <p>Pontos Acumulados</p>
                </div>
              </div>
              <div className="stat-card quantity">
                <i className="fas fa-weight"></i>
                <div className="stat-info">
                  <h3>{totalQuantidade.toFixed(2)}</h3>
                  <p>Quantidade Total</p>
                </div>
              </div>
              <div className="stat-card students">
                <i className="fas fa-users"></i>
                <div className="stat-info">
                  <h3>{alunosAtivos}</h3>
                  <p>Alunos Participantes</p>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Formulário de Doação */}
        <div style={{ marginTop: '2rem' }}>
          <label><strong>Selecione a Equipe:</strong></label>
          <select
            value={novaDoacao.equipe_id}
            onChange={(e) => setNovaDoacao({ ...novaDoacao, equipe_id: e.target.value })}
            style={{ padding: '0.5rem', marginBottom: '1rem' }}
          >
            <option value="">-- Escolher equipe --</option>
            {equipes.map(eq => (
              <option key={eq.id} value={eq.id}>{eq.nome}</option>
            ))}
          </select>
        </div>

        <StudentInput
          onAddDonation={handleAddDonation}
          participantes={participantes}
          equipes={equipes}
          doacoes={doacoes}
          showModal={showModal}
          setShowModal={setShowModal}
          novaDoacao={novaDoacao}
          setNovaDoacao={setNovaDoacao}
          handleSalvarDoacao={handleSalvarDoacao}
        />

        {/* Alerta/Resumo */}
        {userType !== 'aluno' && (
          <div className="donations-alerts" style={{ marginTop: '2rem' }}>
            <h3><i className="fas fa-bell"></i> Alertas e Metas</h3>
            <div className="alerts-list">
              {doacoes.length === 0 ? (
                <div className="no-data">
                  <i className="fas fa-info-circle"></i>
                  <p>Nenhum alerta no momento.</p>
                </div>
              ) : (
                <div className="alert-item info">
                  <i className="fas fa-info-circle"></i>
                  <div className="alert-content">
                    <h4>Sistema Ativo</h4>
                    <p>Total de {totalDoacoes} doações com {totalPontos} pontos acumulados.</p>
                    <small>Atualizado agora</small>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  )
}

export default Doacoes
