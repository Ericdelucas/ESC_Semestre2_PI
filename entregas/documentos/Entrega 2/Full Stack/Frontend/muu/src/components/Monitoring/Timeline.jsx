import { useState, useEffect } from 'react'

function Timeline({ atividades = [], participantes = [], equipes = [], doacoes = [], metas = [] }) {
  const [filtro, setFiltro] = useState('todos') // todos, grupo, individual
  const [equipeSelecionada, setEquipeSelecionada] = useState('')
  const [alunoSelecionado, setAlunoSelecionado] = useState('')

  // Gerar timeline baseada em dados reais
  const gerarTimelineData = () => {
    const timelineItems = []

    // Adicionar doações à timeline
    doacoes.forEach(doacao => {
      timelineItems.push({
        id: `doacao-${doacao.id || Math.random()}`,
        tipo: 'doacao',
        titulo: `Doação de ${doacao.itemDoacao}`,
        descricao: `${doacao.quantidade} unidades arrecadadas`,
        responsavel: doacao.alunoResponsavel,
        equipe: doacao.equipe || 'Não especificada',
        pontos: doacao.pontuacao,
        data: new Date(doacao.dataDoacao),
        icone: 'fas fa-heart'
      })
    })

    // Adicionar metas à timeline
    metas.forEach(meta => {
      timelineItems.push({
        id: `meta-${meta.id}`,
        tipo: 'meta',
        titulo: meta.titulo,
        descricao: meta.descricao,
        responsavel: meta.responsavel,
        equipe: meta.equipe,
        pontos: meta.progresso || 0,
        data: new Date(meta.dataInicio),
        icone: 'fas fa-target'
      })
    })

    // Adicionar atividades à timeline
    atividades.forEach(atividade => {
      timelineItems.push({
        id: `atividade-${atividade.id}`,
        tipo: 'atividade',
        titulo: atividade.nome,
        descricao: atividade.descricao,
        responsavel: atividade.responsavel,
        equipe: atividade.equipe,
        pontos: atividade.pontos || 0,
        data: new Date(atividade.dataInicio),
        icone: 'fas fa-tasks'
      })
    })

    // Ordenar por data (mais recente primeiro)
    return timelineItems.sort((a, b) => new Date(b.data) - new Date(a.data))
  }

  const timelineData = gerarTimelineData()

  // Filtrar dados baseado no filtro selecionado
  const dadosFiltrados = (() => {
    let dados = [...timelineData]
    
    if (filtro === 'grupo' && equipeSelecionada) {
      dados = dados.filter(item => item.equipe === equipeSelecionada)
    } else if (filtro === 'individual' && alunoSelecionado) {
      dados = dados.filter(item => item.responsavel === alunoSelecionado)
    }
    
    return dados
  })()

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
        {dadosFiltrados.length === 0 ? (
          <div className="timeline-empty">
            <i className="fas fa-info-circle"></i>
            <h3>Nenhuma atividade encontrada</h3>
            <p>
              {filtro === 'todos' 
                ? 'Ainda não há atividades registradas. Comece criando edições, participantes e registrando doações!'
                : `Nenhuma atividade encontrada para o filtro selecionado.`
              }
            </p>
          </div>
        ) : (
          <div className="timeline-list">
            {dadosFiltrados.map((item, index) => (
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
          <span>Total de Atividades: {dadosFiltrados.length}</span>
        </div>
        <div className="stat-item">
          <i className="fas fa-star"></i>
          <span>Pontos Totais: {dadosFiltrados.reduce((total, item) => total + (item.pontos || 0), 0)}</span>
        </div>
      </div>
    </div>
  )
}

export default Timeline

