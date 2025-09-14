import { useState } from 'react'

function Relatorios({ active, edicoes, participantes, equipes, atividades }) {
  const [reportType, setReportType] = useState('')
  const [reportData, setReportData] = useState(null)
  const [showResult, setShowResult] = useState(false)

  const generateReport = (type) => {
    setReportType(type)
    let data = {}

    switch (type) {
      case 'geral':
        data = generateGeralReport()
        break
      case 'periodo':
        data = generatePeriodoReport()
        break
      case 'equipe':
        data = generateEquipeReport()
        break
      case 'equipe-periodo':
        data = generateEquipePeriodoReport()
        break
      default:
        data = {}
    }

    setReportData(data)
    setShowResult(true)
  }

  const generateGeralReport = () => {
    const totalArrecadado = atividades.reduce((sum, atividade) => 
      sum + (parseFloat(atividade.arrecadado) || 0), 0
    )
    
    const totalMeta = atividades.reduce((sum, atividade) => 
      sum + (parseFloat(atividade.meta) || 0), 0
    )

    const atividadesPorTipo = atividades.reduce((acc, atividade) => {
      acc[atividade.tipo] = (acc[atividade.tipo] || 0) + 1
      return acc
    }, {})

    return {
      title: 'Relatório Geral',
      stats: {
        totalEdicoes: edicoes.length,
        totalParticipantes: participantes.length,
        totalEquipes: equipes.length,
        totalAtividades: atividades.length,
        totalArrecadado,
        totalMeta,
        percentualMeta: totalMeta > 0 ? (totalArrecadado / totalMeta * 100).toFixed(1) : 0
      },
      atividadesPorTipo
    }
  }

  const generatePeriodoReport = () => {
    const hoje = new Date()
    const mesPassado = new Date(hoje.getFullYear(), hoje.getMonth() - 1, hoje.getDate())
    
    const atividadesRecentes = atividades.filter(atividade => 
      new Date(atividade.dataInicio) >= mesPassado
    )

    const arrecadacaoRecente = atividadesRecentes.reduce((sum, atividade) => 
      sum + (parseFloat(atividade.arrecadado) || 0), 0
    )

    return {
      title: 'Relatório por Período (Último Mês)',
      stats: {
        atividadesNoMes: atividadesRecentes.length,
        arrecadacaoNoMes: arrecadacaoRecente,
        mediaArrecadacao: atividadesRecentes.length > 0 ? 
          (arrecadacaoRecente / atividadesRecentes.length).toFixed(2) : 0
      },
      atividades: atividadesRecentes
    }
  }

  const generateEquipeReport = () => {
    const equipesComStats = equipes.map(equipe => {
      const atividadesEquipe = atividades.filter(atividade => 
        atividade.equipeId === equipe.id.toString()
      )
      
      const arrecadado = atividadesEquipe.reduce((sum, atividade) => 
        sum + (parseFloat(atividade.arrecadado) || 0), 0
      )

      return {
        ...equipe,
        totalAtividades: atividadesEquipe.length,
        totalArrecadado: arrecadado
      }
    })

    return {
      title: 'Relatório por Equipe',
      equipes: equipesComStats.sort((a, b) => b.totalArrecadado - a.totalArrecadado)
    }
  }

  const generateEquipePeriodoReport = () => {
    const hoje = new Date()
    const mesPassado = new Date(hoje.getFullYear(), hoje.getMonth() - 1, hoje.getDate())
    
    const equipesComStats = equipes.map(equipe => {
      const atividadesEquipe = atividades.filter(atividade => 
        atividade.equipeId === equipe.id.toString() &&
        new Date(atividade.dataInicio) >= mesPassado
      )
      
      const arrecadado = atividadesEquipe.reduce((sum, atividade) => 
        sum + (parseFloat(atividade.arrecadado) || 0), 0
      )

      return {
        ...equipe,
        atividadesNoMes: atividadesEquipe.length,
        arrecadadoNoMes: arrecadado
      }
    })

    return {
      title: 'Equipe por Período (Último Mês)',
      equipes: equipesComStats.filter(equipe => equipe.atividadesNoMes > 0)
        .sort((a, b) => b.arrecadadoNoMes - a.arrecadadoNoMes)
    }
  }

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value || 0)
  }

  const getMentorNome = (mentorId) => {
    const mentor = participantes.find(p => p.id === parseInt(mentorId))
    return mentor ? mentor.nome : 'N/A'
  }

  return (
    <section className={`section ${active ? 'active' : ''}`}>
      <div className="container">
        <h2>Relatórios</h2>
        
        <div className="reports-grid">
          <div className="report-card" onClick={() => generateReport('geral')}>
            <i className="fas fa-chart-line"></i>
            <h3>Relatório Geral</h3>
            <p>Visão geral de todas as atividades</p>
          </div>
          
          <div className="report-card" onClick={() => generateReport('periodo')}>
            <i className="fas fa-calendar-alt"></i>
            <h3>Relatório por Período</h3>
            <p>Atividades em um período específico</p>
          </div>
          
          <div className="report-card" onClick={() => generateReport('equipe')}>
            <i className="fas fa-users"></i>
            <h3>Relatório por Equipe</h3>
            <p>Desempenho de equipes específicas</p>
          </div>
          
          <div className="report-card" onClick={() => generateReport('equipe-periodo')}>
            <i className="fas fa-chart-bar"></i>
            <h3>Equipe por Período</h3>
            <p>Desempenho de equipe em período específico</p>
          </div>
        </div>

        {showResult && reportData && (
          <div className="report-result active">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
              <h3>{reportData.title}</h3>
              <button 
                className="btn btn-outline" 
                onClick={() => setShowResult(false)}
              >
                Fechar
              </button>
            </div>

            {reportType === 'geral' && (
              <div>
                <div className="dashboard-stats" style={{ marginBottom: '2rem' }}>
                  <div className="stat-card">
                    <i className="fas fa-calendar"></i>
                    <div className="stat-info">
                      <h3>{reportData.stats.totalEdicoes}</h3>
                      <p>Edições</p>
                    </div>
                  </div>
                  <div className="stat-card">
                    <i className="fas fa-users"></i>
                    <div className="stat-info">
                      <h3>{reportData.stats.totalParticipantes}</h3>
                      <p>Participantes</p>
                    </div>
                  </div>
                  <div className="stat-card">
                    <i className="fas fa-user-friends"></i>
                    <div className="stat-info">
                      <h3>{reportData.stats.totalEquipes}</h3>
                      <p>Equipes</p>
                    </div>
                  </div>
                  <div className="stat-card">
                    <i className="fas fa-tasks"></i>
                    <div className="stat-info">
                      <h3>{reportData.stats.totalAtividades}</h3>
                      <p>Atividades</p>
                    </div>
                  </div>
                </div>

                <div className="dashboard-stats">
                  <div className="stat-card">
                    <i className="fas fa-dollar-sign"></i>
                    <div className="stat-info">
                      <h3>{formatCurrency(reportData.stats.totalArrecadado)}</h3>
                      <p>Total Arrecadado</p>
                    </div>
                  </div>
                  <div className="stat-card">
                    <i className="fas fa-target"></i>
                    <div className="stat-info">
                      <h3>{formatCurrency(reportData.stats.totalMeta)}</h3>
                      <p>Meta Total</p>
                    </div>
                  </div>
                  <div className="stat-card">
                    <i className="fas fa-percentage"></i>
                    <div className="stat-info">
                      <h3>{reportData.stats.percentualMeta}%</h3>
                      <p>Percentual da Meta</p>
                    </div>
                  </div>
                </div>

                <h4>Atividades por Tipo</h4>
                <div className="table-container">
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Tipo de Atividade</th>
                        <th>Quantidade</th>
                      </tr>
                    </thead>
                    <tbody>
                      {Object.entries(reportData.atividadesPorTipo).map(([tipo, quantidade]) => (
                        <tr key={tipo}>
                          <td>{tipo}</td>
                          <td>{quantidade}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {reportType === 'periodo' && (
              <div>
                <div className="dashboard-stats" style={{ marginBottom: '2rem' }}>
                  <div className="stat-card">
                    <i className="fas fa-tasks"></i>
                    <div className="stat-info">
                      <h3>{reportData.stats.atividadesNoMes}</h3>
                      <p>Atividades no Mês</p>
                    </div>
                  </div>
                  <div className="stat-card">
                    <i className="fas fa-dollar-sign"></i>
                    <div className="stat-info">
                      <h3>{formatCurrency(reportData.stats.arrecadacaoNoMes)}</h3>
                      <p>Arrecadação no Mês</p>
                    </div>
                  </div>
                  <div className="stat-card">
                    <i className="fas fa-chart-line"></i>
                    <div className="stat-info">
                      <h3>{formatCurrency(reportData.stats.mediaArrecadacao)}</h3>
                      <p>Média por Atividade</p>
                    </div>
                  </div>
                </div>

                <h4>Atividades Recentes</h4>
                <div className="table-container">
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Nome</th>
                        <th>Tipo</th>
                        <th>Data Início</th>
                        <th>Arrecadado</th>
                      </tr>
                    </thead>
                    <tbody>
                      {reportData.atividades.map(atividade => (
                        <tr key={atividade.id}>
                          <td>{atividade.nome}</td>
                          <td>{atividade.tipo}</td>
                          <td>{new Date(atividade.dataInicio).toLocaleDateString('pt-BR')}</td>
                          <td>{formatCurrency(atividade.arrecadado)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {(reportType === 'equipe' || reportType === 'equipe-periodo') && (
              <div>
                <div className="table-container">
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Equipe</th>
                        <th>Mentor</th>
                        <th>{reportType === 'equipe-periodo' ? 'Atividades no Mês' : 'Total Atividades'}</th>
                        <th>{reportType === 'equipe-periodo' ? 'Arrecadado no Mês' : 'Total Arrecadado'}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {reportData.equipes.map(equipe => (
                        <tr key={equipe.id}>
                          <td>{equipe.nome}</td>
                          <td>{getMentorNome(equipe.mentorId)}</td>
                          <td>
                            {reportType === 'equipe-periodo' ? 
                              equipe.atividadesNoMes : 
                              equipe.totalAtividades
                            }
                          </td>
                          <td>
                            {formatCurrency(
                              reportType === 'equipe-periodo' ? 
                                equipe.arrecadadoNoMes : 
                                equipe.totalArrecadado
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  )
}

export default Relatorios

