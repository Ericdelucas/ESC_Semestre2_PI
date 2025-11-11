import Timeline from './Monitoring/Timeline'

function Monitoramento({ active, edicoes, participantes, equipes, atividades, metas, doacoes, onNavigate }) {
  // Definir data alvo para 1 mês a partir de hoje
  const getTargetDate = () => {
    const today = new Date()
    const targetDate = new Date(today)
    targetDate.setMonth(today.getMonth() + 1)
    return targetDate.toISOString()
  }

  // Handlers para os botões de ação
  const handleRegistrarDoacao = () => {
    if (onNavigate) {
      onNavigate('doacoes')
    } else {
      alert('Redirecionando para seção de Doações...')
    }
  }

  const handleVerTimeline = () => {
    // Rolar para a seção de timeline na mesma página
    const timelineElement = document.querySelector('.timeline-section')
    if (timelineElement) {
      timelineElement.scrollIntoView({ behavior: 'smooth' })
    } else {
      alert('Timeline carregada abaixo!')
    }
  }

  const handleGerenciarMetas = () => {
    if (onNavigate) {
      onNavigate('metas')
    } else {
      alert('Redirecionando para seção de Metas...')
    }
  }

  const handleExportarDados = () => {
    // Simular exportação de dados
    const dados = {
      timestamp: new Date().toISOString(),
      tarefasConcluidas: 0,
      alunosAtivos: 0,
      pontosTotais: 0,
      itensDoados: 0,
      atividades: atividades || []
    }
    
    const dataStr = JSON.stringify(dados, null, 2)
    const dataBlob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement('a')
    link.href = url
    link.download = `monitoramento_${new Date().toISOString().split('T')[0]}.json`
    link.click()
    URL.revokeObjectURL(url)
    
    alert('Dados exportados com sucesso!')
  }

  return (
    <section className={`section ${active ? 'active' : ''}`}>
      <div className="container">
        <div className="section-header">
          <h2>Monitoramento de Alunos</h2>
          <div className="monitoring-actions">
            <button className="btn btn-primary">
              <i className="fas fa-chart-line"></i> Ver Relatórios
            </button>
          </div>
        </div>

        {/* 🚫 CountdownTimer removido completamente */}

        {/* Cards de Estatísticas de Monitoramento */}
        <div className="monitoring-stats">
          <div className="stat-card">
            <i className="fas fa-tasks"></i>
            <div className="stat-info">
              <h3>0</h3>
              <p>Tarefas Concluídas</p>
            </div>
          </div>
          
          <div className="stat-card">
            <i className="fas fa-users-check"></i>
            <div className="stat-info">
              <h3>0</h3>
              <p>Alunos Ativos</p>
            </div>
          </div>
          
          <div className="stat-card">
            <i className="fas fa-trophy"></i>
            <div className="stat-info">
              <h3>0</h3>
              <p>Pontos Totais</p>
            </div>
          </div>
          
          <div className="stat-card">
            <i className="fas fa-heart"></i>
            <div className="stat-info">
              <h3>0</h3>
              <p>Itens Doados</p>
            </div>
          </div>
        </div>

        {/* Seção de Alertas */}
        <div className="monitoring-alerts">
          <h3>
            <i className="fas fa-bell"></i>
            Alertas e Notificações
          </h3>
          <div className="alerts-list">
            <div className="alert-item info">
              <i className="fas fa-info-circle"></i>
              <div className="alert-content">
                <h4>Sistema de Monitoramento Ativo</h4>
                <p>O sistema está registrando todas as atividades dos alunos e equipes.</p>
                <small>Hoje, 09:00</small>
              </div>
            </div>
            
            <div className="alert-item warning">
              <i className="fas fa-exclamation-triangle"></i>
              <div className="alert-content">
                <h4>Prazo se Aproximando</h4>
                <p>Lembre os alunos sobre o prazo final para conclusão das tarefas.</p>
                <small>Hoje, 08:30</small>
              </div>
            </div>
          </div>
        </div>

        {/* Seção de Ações Rápidas */}
        <div className="quick-actions">
          <h3>
            <i className="fas fa-bolt"></i>
            Ações Rápidas
          </h3>
          <div className="actions-grid">
            <button className="action-card" onClick={handleRegistrarDoacao}>
              <i className="fas fa-plus-circle"></i>
              <span>Registrar Doação</span>
            </button>
            
            <button className="action-card" onClick={handleVerTimeline}>
              <i className="fas fa-timeline"></i>
              <span>Ver Timeline</span>
            </button>
            
            <button className="action-card" onClick={handleGerenciarMetas}>
              <i className="fas fa-calendar-check"></i>
              <span>Gerenciar Metas</span>
            </button>
            
            <button className="action-card" onClick={handleExportarDados}>
              <i className="fas fa-file-export"></i>
              <span>Exportar Dados</span>
            </button>
          </div>
        </div>

        {/* Timeline de Tarefas */}
        <div className="timeline-section">
          <Timeline 
            atividades={atividades}
            participantes={participantes}
            equipes={equipes}
            doacoes={doacoes}
            metas={metas}
          />
        </div>
      </div>
    </section>
  )
}

export default Monitoramento
