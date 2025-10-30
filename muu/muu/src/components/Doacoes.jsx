import { useState } from 'react'
import StudentInput from './Monitoring/StudentInput'

function Doacoes({ active, participantes, equipes, doacoes = [], onDoacoesChange, userType, edicoes }) {
  const [showModal, setShowModal] = useState(false)
  const [novaDoacao, setNovaDoacao] = useState({
    data_doacao: '',
    aluno_responsavel: '',
    item_doacao: '',
    quantidade: '',
    campanha: '',
    doador: '',
    pontuacao: 0
  })
  const handleAddDonation = (novaDonacao) => {
    const novasDoacoes = [novaDonacao, ...doacoes]
    if (onDoacoesChange) {
      onDoacoesChange(novasDoacoes)
    }
  }
  const handleSalvarDoacao = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/doacoes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(novaDoacao)
      })
      if (!response.ok) throw new Error('Erro ao registrar doação')

      const data = await response.json()
      handleAddDonation(data.data)
      setShowModal(false)
      alert('✅ Doação registrada com sucesso!')
    } catch (error) {
      console.error(error)
      alert('❌ Erro ao registrar a doação.')
    }
  }

  // Handlers para botões
  const handleExportarDados = () => {
    const dados = {
      timestamp: new Date().toISOString(),
      totalDoacoes: doacoes.length,
      totalPontos: doacoes.reduce((total, doacao) => total + doacao.pontuacao, 0),
      totalQuantidade: doacoes.reduce((total, doacao) => total + doacao.quantidade, 0),
      doacoes: doacoes
    }
    
    const dataStr = JSON.stringify(dados, null, 2)
    const dataBlob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(dataBlob)
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

  // Calcular estatísticas
  const totalDoacoes = doacoes.length
  const totalPontos = doacoes.reduce((total, doacao) => total + doacao.pontuacao, 0)
  const totalQuantidade = doacoes.reduce((total, doacao) => total + doacao.quantidade, 0)
  const alunosAtivos = [...new Set(doacoes.map(d => d.alunoResponsavel))].length

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

        {userType !== 'aluno' && (
          <>
            {/* Cards de Estatísticas */}
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

            {/* Ranking de Doações por Item */}
            <div className="donations-ranking">
              <h3>
                <i className="fas fa-trophy"></i>
                Ranking de Itens Mais Doados
              </h3>
              <div className="ranking-grid">
                {doacoes.length === 0 ? (
                  <div className="no-data">
                    <i className="fas fa-info-circle"></i>
                    <p>Nenhuma doação registrada ainda. Comece registrando a primeira doação!</p>
                  </div>
                ) : (
                  // Calcular ranking dinâmico baseado nas doações reais
                  (() => {
                    const itemCount = {}
                    doacoes.forEach(doacao => {
                      itemCount[doacao.itemDoacao] = (itemCount[doacao.itemDoacao] || 0) + 1
                    })
                    
                    const sortedItems = Object.entries(itemCount)
                      .sort(([,a], [,b]) => b - a)
                      .slice(0, 3)
                    
                    return sortedItems.map(([item, count], index) => {
                      const positions = ['gold', 'silver', 'bronze']
                      const positionNumbers = ['1º', '2º', '3º']
                      
                      // Encontrar pontuação do item
                      const itemPontos = {
                        'Arroz': 1, 'Feijão': 2, 'Açúcar': 3, 'Óleo': 4,
                        'Macarrão': 5, 'Fubá': 6, 'Leite em pó': 7,
                        'Item não listado': 8, 'Dinheiro | Moeda': 9
                      }
                      
                      return (
                        <div key={item} className={`ranking-item ${positions[index]}`}>
                          <div className="ranking-position">{positionNumbers[index]}</div>
                          <div className="ranking-info">
                            <h4>{item}</h4>
                            <p>{itemPontos[item] || 0} pontos por unidade</p>
                            <span className="ranking-count">{count} doações</span>
                          </div>
                        </div>
                      )
                    })
                  })()
                )}
              </div>
            </div>
          </>
        )}
        

        {/* Componente de Input de Doações */}
        <StudentInput 
          onAddDonation={handleAddDonation}
          participantes={participantes}
          equipes={equipes}
          doacoes={doacoes}
          edicoes={edicoes}
        />

        {userType !== 'aluno' && (
          <>
            {/* Gráfico de Progresso por Campanha */}
            <div className="campaign-progress">
              <h3>
                <i className="fas fa-chart-line"></i>
                Progresso por Campanha
              </h3>
              <div className="progress-list">
                {doacoes.length === 0 ? (
                  <div className="no-data">
                    <i className="fas fa-info-circle"></i>
                    <p>Nenhuma campanha ativa. As campanhas aparecerão aqui quando houver doações registradas.</p>
                  </div>
                ) : (
                  <div className="progress-item">
                    <div className="progress-header">
                      <span>Campanha Geral</span>
                      <span>{Math.min(100, Math.round((totalPontos / 100) * 100))}%</span>
                    </div>
                    <div className="progress-bar">
                      <div className="progress-fill" style={{width: `${Math.min(100, (totalPontos / 100) * 100)}%`}}></div>
                    </div>
                    <small>Meta: 100 pontos | Acumulados: {totalPontos} pontos</small>
                  </div>
                )}
              </div>
            </div>

            {/* Alertas e Notificações */}
            <div className="donations-alerts">
              <h3>
                <i className="fas fa-bell"></i>
                Alertas e Metas
              </h3>
              <div className="alerts-list">
                {doacoes.length === 0 ? (
                  <div className="no-data">
                    <i className="fas fa-info-circle"></i>
                    <p>Nenhum alerta no momento. Os alertas aparecerão aqui conforme as atividades de doação.</p>
                  </div>
                ) : (
                  <div className="alert-item info">
                    <i className="fas fa-info-circle"></i>
                    <div className="alert-content">
                      <h4>Sistema Ativo</h4>
                      <p>Total de {totalDoacoes} doações registradas com {totalPontos} pontos acumulados.</p>
                      <small>Atualizado agora</small>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </section>
  )
}

export default Doacoes