import { useState, useEffect } from 'react'

function Timeline({ atividades = [], participantes = [], equipes = [] }) {
  const [filtro, setFiltro] = useState('todos') // todos, grupo, individual
  const [equipeSelecionada, setEquipeSelecionada] = useState('')
  const [alunoSelecionado, setAlunoSelecionado] = useState('')
  const [timelineData, setTimelineData] = useState([])

  // Dados de exemplo para demonstração
  const exemploTimeline = [
    {
      id: 1,
      tipo: 'doacao',
      titulo: 'Doação de Arroz',
      descricao: '5kg de arroz arrecadados',
      responsavel: 'João Silva',
      equipe: 'Equipe Alpha',
      pontos: 5,
      data: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 dias atrás
      icone: 'fas fa-heart'
    },
    {
      id: 2,
      tipo: 'meta',
      titulo: 'Meta Semanal Atingida',
      descricao: 'Equipe atingiu 80% da meta semanal',
      responsavel: null,
      equipe: 'Equipe Beta',
      pontos: 10,
      data: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 dia atrás
      icone: 'fas fa-trophy'
    },
    {
      id: 3,
      tipo: 'doacao',
      titulo: 'Doação de Feijão',
      descricao: '3kg de feijão arrecadados',
      responsavel: 'Maria Santos',
      equipe: 'Equipe Alpha',
      pontos: 6,
      data: new Date(Date.now() - 5 * 60 * 60 * 1000), // 5 horas atrás
      icone: 'fas fa-heart'
    },
    {
      id: 4,
      tipo: 'atividade',
      titulo: 'Workshop de Liderança',
      descricao: 'Participação no workshop de desenvolvimento de liderança',
      responsavel: 'Pedro Costa',
      equipe: 'Equipe Gamma',
      pontos: 15,
      data: new Date(Date.now() - 30 * 60 * 1000), // 30 minutos atrás
      icone: 'fas fa-graduation-cap'
    }
  ]

  useEffect(() => {
    // Combinar dados reais com dados de exemplo
    let dados = [...exemploTimeline]
    
    // Filtrar dados baseado no filtro selecionado
    if (filtro === 'grupo' && equipeSelecionada) {
      dados = dados.filter(item => item.equipe === equipeSelecionada)
    } else if (filtro === 'individual' && alunoSelecionado) {
      dados = dados.filter(item => item.responsavel === alunoSelecionado)
    }
    
    // Ordenar por data (mais recente primeiro)
    dados.sort((a, b) => new Date(b.data) - new Date(a.data))
    
    setTimelineData(dados)
  }, [filtro, equipeSelecionada, alunoSelecionado, atividades])

  const formatarData = (data) => {
    const agora = new Date()
    const diferenca = agora - data
    const minutos = Math.floor(diferenca / (1000 * 60))
    const horas = Math.floor(diferenca / (1000 * 60 * 60))
    const dias = Math.floor(diferenca / (1000 * 60 * 60 * 24))

    if (minutos < 60) {
      return `${minutos} minuto${minutos !== 1 ? 's' : ''} atrás`
    } else if (horas < 24) {
      return `${horas} hora${horas !== 1 ? 's' : ''} atrás`
    } else {
      return `${dias} dia${dias !== 1 ? 's' : ''} atrás`
    }
  }

  const getTipoClass = (tipo) => {
    switch (tipo) {
      case 'doacao': return 'timeline-item-doacao'
      case 'meta': return 'timeline-item-meta'
      case 'atividade': return 'timeline-item-atividade'
      default: return 'timeline-item-default'
    }
  }

  return (
    <div className="timeline-container">
      <div className="timeline-header">
        <h3>
          <i className="fas fa-timeline"></i>
          Linha do Tempo de Tarefas
        </h3>
        
        <div className="timeline-filters">
          <div className="filter-group">
            <label>Visualizar:</label>
            <select 
              value={filtro} 
              onChange={(e) => setFiltro(e.target.value)}
              className="filter-select"
            >
              <option value="todos">Todos</option>
              <option value="grupo">Por Equipe</option>
              <option value="individual">Por Aluno</option>
            </select>
          </div>
          
          {filtro === 'grupo' && (
            <div className="filter-group">
              <label>Equipe:</label>
              <select 
                value={equipeSelecionada} 
                onChange={(e) => setEquipeSelecionada(e.target.value)}
                className="filter-select"
              >
                <option value="">Selecione uma equipe</option>
                <option value="Equipe Alpha">Equipe Alpha</option>
                <option value="Equipe Beta">Equipe Beta</option>
                <option value="Equipe Gamma">Equipe Gamma</option>
              </select>
            </div>
          )}
          
          {filtro === 'individual' && (
            <div className="filter-group">
              <label>Aluno:</label>
              <select 
                value={alunoSelecionado} 
                onChange={(e) => setAlunoSelecionado(e.target.value)}
                className="filter-select"
              >
                <option value="">Selecione um aluno</option>
                <option value="João Silva">João Silva</option>
                <option value="Maria Santos">Maria Santos</option>
                <option value="Pedro Costa">Pedro Costa</option>
              </select>
            </div>
          )}
        </div>
      </div>

      <div className="timeline-content">
        {timelineData.length === 0 ? (
          <div className="timeline-empty">
            <i className="fas fa-clock"></i>
            <p>Nenhuma atividade registrada ainda</p>
            <small>As atividades aparecerão aqui conforme forem sendo realizadas</small>
          </div>
        ) : (
          <div className="timeline-list">
            {timelineData.map((item, index) => (
              <div key={item.id} className={`timeline-item ${getTipoClass(item.tipo)}`}>
                <div className="timeline-marker">
                  <i className={item.icone}></i>
                </div>
                
                <div className="timeline-content-item">
                  <div className="timeline-header-item">
                    <h4>{item.titulo}</h4>
                    <div className="timeline-meta">
                      <span className="timeline-time">
                        <i className="fas fa-clock"></i>
                        {formatarData(item.data)}
                      </span>
                      {item.pontos && (
                        <span className="timeline-points">
                          <i className="fas fa-star"></i>
                          {item.pontos} pts
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <p className="timeline-description">{item.descricao}</p>
                  
                  <div className="timeline-details">
                    {item.responsavel && (
                      <span className="timeline-responsible">
                        <i className="fas fa-user"></i>
                        {item.responsavel}
                      </span>
                    )}
                    {item.equipe && (
                      <span className="timeline-team">
                        <i className="fas fa-users"></i>
                        {item.equipe}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      <div className="timeline-stats">
        <div className="stat-item">
          <i className="fas fa-tasks"></i>
          <span>Total de Atividades: {timelineData.length}</span>
        </div>
        <div className="stat-item">
          <i className="fas fa-star"></i>
          <span>Pontos Totais: {timelineData.reduce((total, item) => total + (item.pontos || 0), 0)}</span>
        </div>
      </div>
    </div>
  )
}

export default Timeline

