import { useState } from 'react'
import StudentInput from './Monitoring/StudentInput'

function Doacoes({ active, participantes, equipes }) {
  const [doacoes, setDoacoes] = useState([])

  const handleAddDonation = (novaDonacao) => {
    setDoacoes(prev => [novaDonacao, ...prev])
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
          <div className="section-actions">
            <button className="btn btn-outline" onClick={handleExportarDados}>
              <i className="fas fa-download"></i> Exportar Dados
            </button>
            <button className="btn btn-primary" onClick={handleVerRelatorios}>
              <i className="fas fa-chart-bar"></i> Ver Relatórios
            </button>
          </div>
        </div>

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
            <div className="ranking-item gold">
              <div className="ranking-position">1º</div>
              <div className="ranking-info">
                <h4>Dinheiro | Moeda</h4>
                <p>9 pontos por unidade</p>
                <span className="ranking-count">15 doações</span>
              </div>
            </div>
            
            <div className="ranking-item silver">
              <div className="ranking-position">2º</div>
              <div className="ranking-info">
                <h4>Leite em pó</h4>
                <p>7 pontos por unidade</p>
                <span className="ranking-count">8 doações</span>
              </div>
            </div>
            
            <div className="ranking-item bronze">
              <div className="ranking-position">3º</div>
              <div className="ranking-info">
                <h4>Fubá</h4>
                <p>6 pontos por unidade</p>
                <span className="ranking-count">5 doações</span>
              </div>
            </div>
          </div>
        </div>

        {/* Componente de Input de Doações */}
        <StudentInput 
          onAddDonation={handleAddDonation}
          participantes={participantes}
          equipes={equipes}
        />

        {/* Gráfico de Progresso por Campanha */}
        <div className="campaign-progress">
          <h3>
            <i className="fas fa-chart-line"></i>
            Progresso por Campanha
          </h3>
          <div className="progress-list">
            <div className="progress-item">
              <div className="progress-header">
                <span>Rifa - Camisa time...</span>
                <span>75%</span>
              </div>
              <div className="progress-bar">
                <div className="progress-fill" style={{width: '75%'}}></div>
              </div>
              <small>Meta: R$ 1.000,00 | Arrecadado: R$ 750,00</small>
            </div>
            
            <div className="progress-item">
              <div className="progress-header">
                <span>Caixa FECAP</span>
                <span>60%</span>
              </div>
              <div className="progress-bar">
                <div className="progress-fill" style={{width: '60%'}}></div>
              </div>
              <small>Meta: 100 itens | Coletados: 60 itens</small>
            </div>
            
            <div className="progress-item">
              <div className="progress-header">
                <span>Campanha Natal</span>
                <span>40%</span>
              </div>
              <div className="progress-bar">
                <div className="progress-fill" style={{width: '40%'}}></div>
              </div>
              <small>Meta: 200 itens | Coletados: 80 itens</small>
            </div>
          </div>
        </div>

        {/* Alertas e Notificações */}
        <div className="donations-alerts">
          <h3>
            <i className="fas fa-bell"></i>
            Alertas e Metas
          </h3>
          <div className="alerts-list">
            <div className="alert-item success">
              <i className="fas fa-check-circle"></i>
              <div className="alert-content">
                <h4>Meta Semanal Atingida!</h4>
                <p>A Equipe Alpha atingiu 120% da meta semanal de doações.</p>
                <small>Hoje, 14:30</small>
              </div>
            </div>
            
            <div className="alert-item warning">
              <i className="fas fa-exclamation-triangle"></i>
              <div className="alert-content">
                <h4>Meta em Risco</h4>
                <p>A campanha "Caixa FECAP" precisa de mais 40 itens para atingir a meta.</p>
                <small>Ontem, 16:45</small>
              </div>
            </div>
            
            <div className="alert-item info">
              <i className="fas fa-info-circle"></i>
              <div className="alert-content">
                <h4>Nova Campanha Disponível</h4>
                <p>A campanha "Ação Solidária" foi criada e está disponível para doações.</p>
                <small>2 dias atrás</small>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Doacoes

