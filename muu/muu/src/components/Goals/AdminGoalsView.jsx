import { useState, useEffect } from 'react'

function AdminGoalsView() {
  const [equipes, setEquipes] = useState([])
  const [equipeSelecionada, setEquipeSelecionada] = useState('todas')
  const [filtroStatus, setFiltroStatus] = useState('todos')
  const [historico, setHistorico] = useState([])
  const [relatorioSemanal, setRelatorioSemanal] = useState(null)

  // Dados de exemplo
  const dadosEquipes = [
    {
      nome: 'Equipe Alpha',
      metas: [
        {
          id: 1,
          titulo: 'Arrecadar 50kg de alimentos',
          status: 'em_andamento',
          progresso: 75,
          dataInicio: '2025-09-15',
          dataFim: '2025-09-22',
          prioridade: 'alta'
        },
        {
          id: 2,
          titulo: 'Workshop de Liderança',
          status: 'pendente',
          progresso: 0,
          dataInicio: '2025-09-20',
          dataFim: '2025-09-20',
          prioridade: 'media'
        }
      ]
    },
    {
      nome: 'Equipe Beta',
      metas: [
        {
          id: 3,
          titulo: 'Campanha de Reciclagem',
          status: 'concluida',
          progresso: 100,
          dataInicio: '2025-09-10',
          dataFim: '2025-09-17',
          prioridade: 'alta'
        },
        {
          id: 4,
          titulo: 'Visita ao Lar de Idosos',
          status: 'em_andamento',
          progresso: 60,
          dataInicio: '2025-09-18',
          dataFim: '2025-09-25',
          prioridade: 'media'
        }
      ]
    },
    {
      nome: 'Equipe Gamma',
      metas: [
        {
          id: 5,
          titulo: 'Arrecadação de Brinquedos',
          status: 'atrasada',
          progresso: 30,
          dataInicio: '2025-09-05',
          dataFim: '2025-09-12',
          prioridade: 'alta'
        }
      ]
    }
  ]

  const historicoExemplo = [
    {
      id: 1,
      acao: 'criou',
      meta: 'Arrecadar 50kg de alimentos',
      equipe: 'Equipe Alpha',
      usuario: 'João Silva',
      data: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 horas atrás
      detalhes: 'Meta criada com prazo de 1 semana'
    },
    {
      id: 2,
      acao: 'editou',
      meta: 'Workshop de Liderança',
      equipe: 'Equipe Alpha',
      usuario: 'Maria Santos',
      data: new Date(Date.now() - 5 * 60 * 60 * 1000), // 5 horas atrás
      detalhes: 'Alterou data de realização'
    },
    {
      id: 3,
      acao: 'concluiu',
      meta: 'Campanha de Reciclagem',
      equipe: 'Equipe Beta',
      usuario: 'Pedro Costa',
      data: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 dia atrás
      detalhes: 'Meta concluída com sucesso'
    },
    {
      id: 4,
      acao: 'removeu',
      meta: 'Evento Beneficente',
      equipe: 'Equipe Gamma',
      usuario: 'Ana Silva',
      data: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 dias atrás
      detalhes: 'Meta cancelada por falta de recursos'
    }
  ]

  const relatorioExemplo = {
    periodo: 'Semana de 09/09 a 15/09/2025',
    totalMetas: 12,
    metasConcluidas: 4,
    metasEmAndamento: 5,
    metasAtrasadas: 2,
    metasPendentes: 1,
    equipeMaisAtiva: 'Equipe Alpha',
    equipeMelhorDesempenho: 'Equipe Beta',
    alertas: [
      'Equipe Gamma tem 1 meta atrasada',
      'Meta de arrecadação está 75% concluída',
      '3 novas metas foram criadas esta semana'
    ]
  }

  useEffect(() => {
    setEquipes(dadosEquipes)
    setHistorico(historicoExemplo)
    setRelatorioSemanal(relatorioExemplo)
  }, [])

  const getMetasFiltradas = () => {
    let todasMetas = []
    
    equipes.forEach(equipe => {
      equipe.metas.forEach(meta => {
        todasMetas.push({
          ...meta,
          nomeEquipe: equipe.nome
        })
      })
    })

    if (equipeSelecionada !== 'todas') {
      todasMetas = todasMetas.filter(meta => meta.nomeEquipe === equipeSelecionada)
    }

    if (filtroStatus !== 'todos') {
      todasMetas = todasMetas.filter(meta => meta.status === filtroStatus)
    }

    return todasMetas
  }

  const getStatusClass = (status) => {
    switch (status) {
      case 'concluida': return 'status-completed'
      case 'em_andamento': return 'status-progress'
      case 'pendente': return 'status-pending'
      case 'atrasada': return 'status-overdue'
      default: return 'status-pending'
    }
  }

  const getPrioridadeClass = (prioridade) => {
    switch (prioridade) {
      case 'alta': return 'priority-high'
      case 'media': return 'priority-medium'
      case 'baixa': return 'priority-low'
      default: return 'priority-medium'
    }
  }

  const getAcaoIcon = (acao) => {
    switch (acao) {
      case 'criou': return 'fas fa-plus-circle'
      case 'editou': return 'fas fa-edit'
      case 'concluiu': return 'fas fa-check-circle'
      case 'removeu': return 'fas fa-trash'
      default: return 'fas fa-info-circle'
    }
  }

  const formatarTempo = (data) => {
    const agora = new Date()
    const diferenca = agora - data
    const horas = Math.floor(diferenca / (1000 * 60 * 60))
    const dias = Math.floor(diferenca / (1000 * 60 * 60 * 24))

    if (dias > 0) {
      return `${dias} dia${dias !== 1 ? 's' : ''} atrás`
    } else if (horas > 0) {
      return `${horas} hora${horas !== 1 ? 's' : ''} atrás`
    } else {
      return 'Agora mesmo'
    }
  }

  const gerarRelatorioSemanal = () => {
    alert('Relatório semanal gerado e enviado por email!')
  }

  return (
    <div className="admin-goals-view">
      <div className="admin-header">
        <h2>
          <i className="fas fa-users-cog"></i>
          Painel Administrativo - Metas das Equipes
        </h2>
        <div className="admin-actions">
          <button className="btn btn-outline" onClick={gerarRelatorioSemanal}>
            <i className="fas fa-file-pdf"></i>
            Gerar Relatório
          </button>
          <button className="btn btn-primary">
            <i className="fas fa-download"></i>
            Exportar Dados
          </button>
        </div>
      </div>

      {/* Filtros */}
      <div className="admin-filters">
        <div className="filter-group">
          <label>Equipe:</label>
          <select 
            value={equipeSelecionada} 
            onChange={(e) => setEquipeSelecionada(e.target.value)}
          >
            <option value="todas">Todas as Equipes</option>
            {equipes.map(equipe => (
              <option key={equipe.nome} value={equipe.nome}>
                {equipe.nome}
              </option>
            ))}
          </select>
        </div>
        
        <div className="filter-group">
          <label>Status:</label>
          <select 
            value={filtroStatus} 
            onChange={(e) => setFiltroStatus(e.target.value)}
          >
            <option value="todos">Todos os Status</option>
            <option value="pendente">Pendente</option>
            <option value="em_andamento">Em Andamento</option>
            <option value="concluida">Concluída</option>
            <option value="atrasada">Atrasada</option>
          </select>
        </div>
      </div>

      {/* Relatório Semanal */}
      {relatorioSemanal && (
        <div className="weekly-report">
          <h3>
            <i className="fas fa-chart-line"></i>
            Relatório Semanal - {relatorioSemanal.periodo}
          </h3>
          
          <div className="report-stats">
            <div className="report-stat">
              <i className="fas fa-tasks"></i>
              <div>
                <h4>{relatorioSemanal.totalMetas}</h4>
                <p>Total de Metas</p>
              </div>
            </div>
            
            <div className="report-stat success">
              <i className="fas fa-check-circle"></i>
              <div>
                <h4>{relatorioSemanal.metasConcluidas}</h4>
                <p>Concluídas</p>
              </div>
            </div>
            
            <div className="report-stat warning">
              <i className="fas fa-clock"></i>
              <div>
                <h4>{relatorioSemanal.metasEmAndamento}</h4>
                <p>Em Andamento</p>
              </div>
            </div>
            
            <div className="report-stat danger">
              <i className="fas fa-exclamation-triangle"></i>
              <div>
                <h4>{relatorioSemanal.metasAtrasadas}</h4>
                <p>Atrasadas</p>
              </div>
            </div>
          </div>
          
          <div className="report-highlights">
            <div className="highlight">
              <strong>Equipe Mais Ativa:</strong> {relatorioSemanal.equipeMaisAtiva}
            </div>
            <div className="highlight">
              <strong>Melhor Desempenho:</strong> {relatorioSemanal.equipeMelhorDesempenho}
            </div>
          </div>
          
          <div className="report-alerts">
            <h4>Alertas:</h4>
            <ul>
              {relatorioSemanal.alertas.map((alerta, index) => (
                <li key={index}>{alerta}</li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Lista de Metas */}
      <div className="admin-metas-list">
        <h3>
          <i className="fas fa-list"></i>
          Metas das Equipes ({getMetasFiltradas().length})
        </h3>
        
        <div className="metas-table">
          <div className="table-header">
            <div>Meta</div>
            <div>Equipe</div>
            <div>Status</div>
            <div>Progresso</div>
            <div>Prazo</div>
            <div>Prioridade</div>
          </div>
          
          {getMetasFiltradas().map(meta => (
            <div key={meta.id} className="table-row">
              <div className="meta-info">
                <strong>{meta.titulo}</strong>
              </div>
              <div className="team-name">{meta.nomeEquipe}</div>
              <div>
                <span className={`status-badge ${getStatusClass(meta.status)}`}>
                  {meta.status.replace(/_/g, ' ')}
                </span>
              </div>
              <div className="progress-cell">
                <div className="progress-bar-small">
                  <div 
                    className="progress-fill-small" 
                    style={{width: `${meta.progresso}%`}}
                  ></div>
                </div>
                <span>{meta.progresso}%</span>
              </div>
              <div className="date-cell">
                {new Date(meta.dataFim).toLocaleDateString('pt-BR')}
              </div>
              <div>
                <span className={`priority-badge ${getPrioridadeClass(meta.prioridade)}`}>
                  {meta.prioridade}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Histórico de Alterações */}
      <div className="admin-history">
        <h3>
          <i className="fas fa-history"></i>
          Histórico de Alterações
        </h3>
        
        <div className="history-list">
          {historico.map(item => (
            <div key={item.id} className="history-item">
              <div className="history-icon">
                <i className={getAcaoIcon(item.acao)}></i>
              </div>
              
              <div className="history-content">
                <div className="history-main">
                  <strong>{item.usuario}</strong> {item.acao} a meta 
                  <strong> "{item.meta}"</strong> da {item.equipe}
                </div>
                <div className="history-details">{item.detalhes}</div>
                <div className="history-time">{formatarTempo(item.data)}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default AdminGoalsView