// ✅ src/components/Relatorios.jsx
import { useState, useEffect } from 'react'
import axios from 'axios'
import {
  BarChart, Bar, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts'

function Relatorios({ active, edicoes, participantes, equipes, atividades, metas = [], doacoes = [] }) {
  const [reportType, setReportType] = useState('')
  const [reportData, setReportData] = useState(null)
  const [showResult, setShowResult] = useState(false)
  const [relatorios, setRelatorios] = useState([])
  const [loading, setLoading] = useState(false)

  // ============================================================
  // ===================== INTEGRAÇÃO BACKEND ====================
  // ============================================================
  useEffect(() => {
    const fetchRelatorios = async () => {
      try {
        setLoading(true)
        const res = await axios.get('http://localhost:3001/api/relatorios')
        setRelatorios(res.data)
      } catch (error) {
        console.error('Erro ao carregar relatórios:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchRelatorios()
  }, [])

  // ============================================================
  // =================== CRIAÇÃO DE RELATÓRIOS ===================
  // ============================================================
  const handleCreateRelatorio = async (formData) => {
    try {
      await axios.post('http://localhost:3001/api/relatorios', formData)
      alert('✅ Relatório criado com sucesso!')

      // Atualiza lista após criar
      const res = await axios.get('http://localhost:3001/api/relatorios')
      setRelatorios(res.data)
    } catch (err) {
      console.error('Erro ao criar relatório:', err)
      alert('❌ Falha ao salvar relatório. Verifique o console.')
    }
  }

  // ============================================================
  // ============== FUNÇÕES DE GERAÇÃO DE RELATÓRIOS ============
  // ============================================================
  const generateReport = (type) => {
    setReportType(type)
    let data = {}

    switch (type) {
      case 'geral': data = generateGeralReport(); break
      case 'periodo': data = generatePeriodoReport(); break
      case 'equipe': data = generateEquipeReport(); break
      case 'equipe-periodo': data = generateEquipePeriodoReport(); break
      default: data = {}
    }

    setReportData(data)
    setShowResult(true)
  }

  // 🔹 Relatório Geral
  const generateGeralReport = () => {
    const totalArrecadado = atividades.reduce((sum, a) => sum + (parseFloat(a.arrecadado) || 0), 0)
    const totalMeta = atividades.reduce((sum, a) => sum + (parseFloat(a.meta) || 0), 0)
    const atividadesPorTipo = atividades.reduce((acc, a) => {
      acc[a.tipo] = (acc[a.tipo] || 0) + 1
      return acc
    }, {})

    const totalDoacoes = doacoes.length
    const totalPontosDoacoes = doacoes.reduce((sum, d) => sum + (d.pontuacao || 0), 0)
    const totalQuantidadeDoacoes = doacoes.reduce((sum, d) => sum + (parseFloat(d.quantidade) || 0), 0)

    const totalMetas = metas.length
    const metasConcluidas = metas.filter(m => m.status === 'concluida').length
    const metasEmAndamento = metas.filter(m => m.status === 'em_andamento').length

    return {
      title: 'Relatório Geral',
      stats: {
        totalEdicoes: edicoes.length,
        totalParticipantes: participantes.length,
        totalEquipes: equipes.length,
        totalAtividades: atividades.length,
        totalArrecadado,
        totalMeta,
        percentualMeta: totalMeta > 0 ? (totalArrecadado / totalMeta * 100).toFixed(1) : 0,
        totalDoacoes,
        totalPontosDoacoes,
        totalQuantidadeDoacoes,
        totalMetas,
        metasConcluidas,
        metasEmAndamento,
        percentualMetasConcluidas: totalMetas > 0 ? (metasConcluidas / totalMetas * 100).toFixed(1) : 0
      },
      atividadesPorTipo
    }
  }

  // 🔹 Relatório por Período
  const generatePeriodoReport = () => {
    const hoje = new Date()
    const mesPassado = new Date(hoje.getFullYear(), hoje.getMonth() - 1, hoje.getDate())
    const atividadesRecentes = atividades.filter(a => new Date(a.dataInicio) >= mesPassado)
    const arrecadacaoRecente = atividadesRecentes.reduce((sum, a) => sum + (parseFloat(a.arrecadado) || 0), 0)

    return {
      title: 'Relatório por Período (Último Mês)',
      stats: {
        atividadesNoMes: atividadesRecentes.length,
        arrecadacaoNoMes: arrecadacaoRecente,
        mediaArrecadacao: atividadesRecentes.length > 0
          ? (arrecadacaoRecente / atividadesRecentes.length).toFixed(2)
          : 0
      },
      atividades: atividadesRecentes
    }
  }

  // 🔹 Relatório por Equipe
  const generateEquipeReport = () => {
    const equipesComStats = equipes.map(eq => {
      const atividadesEquipe = atividades.filter(a => a.equipeId === eq.id.toString())
      const arrecadado = atividadesEquipe.reduce((sum, a) => sum + (parseFloat(a.arrecadado) || 0), 0)
      return {
        ...eq,
        totalAtividades: atividadesEquipe.length,
        totalArrecadado: arrecadado
      }
    })

    return {
      title: 'Relatório por Equipe',
      equipes: equipesComStats.sort((a, b) => b.totalArrecadado - a.totalArrecadado)
    }
  }

  // 🔹 Relatório de Equipe por Período
  const generateEquipePeriodoReport = () => {
    const hoje = new Date()
    const mesPassado = new Date(hoje.getFullYear(), hoje.getMonth() - 1, hoje.getDate())
    const equipesComStats = equipes.map(eq => {
      const atividadesEquipe = atividades.filter(a =>
        a.equipeId === eq.id.toString() && new Date(a.dataInicio) >= mesPassado
      )
      const arrecadado = atividadesEquipe.reduce((sum, a) => sum + (parseFloat(a.arrecadado) || 0), 0)
      return {
        ...eq,
        atividadesNoMes: atividadesEquipe.length,
        arrecadadoNoMes: arrecadado
      }
    })

    return {
      title: 'Equipe por Período (Último Mês)',
      equipes: equipesComStats.filter(eq => eq.atividadesNoMes > 0)
        .sort((a, b) => b.arrecadadoNoMes - a.arrecadadoNoMes)
    }
  }

  const formatImpacto = (tipo, valor) => {
    if (tipo === 'dinheiro') return `R$ ${valor.toFixed(2)}`
    if (tipo === 'arroz') return `${valor} kg`
    if (tipo === 'óleo') return `${valor} L`
    return valor
  }

  const getMentorNome = (mentorId) => {
    const mentor = participantes.find(p => p.id === parseInt(mentorId))
    return mentor ? mentor.nome : 'N/A'
  }

  // ============================================================
  // ===================== RENDERIZAÇÃO =========================
  // ============================================================
  return (
    <section className={`section ${active ? 'active' : ''}`}>
      <div className="container">
        <h2>📊 Relatórios</h2>

        {/* === SELETOR DE RELATÓRIO === */}
        <div className="reports-grid">
          <div className="report-card" onClick={() => generateReport('geral')}>
            <i className="fas fa-chart-line"></i>
            <h3>Relatório Geral</h3>
            <p>Visão geral de todas as atividades</p>
          </div>

          <div className="report-card" onClick={() => generateReport('periodo')}>
            <i className="fas fa-calendar-alt"></i>
            <h3>Relatório por Período</h3>
            <p>Atividades do último mês</p>
          </div>

          <div className="report-card" onClick={() => generateReport('equipe')}>
            <i className="fas fa-users"></i>
            <h3>Relatório por Equipe</h3>
            <p>Desempenho das equipes</p>
          </div>

          <div className="report-card" onClick={() => generateReport('equipe-periodo')}>
            <i className="fas fa-chart-bar"></i>
            <h3>Equipe por Período</h3>
            <p>Equipes e resultados recentes</p>
          </div>
        </div>

        {/* === RESULTADO DO RELATÓRIO === */}
        {showResult && reportData && (
          <div className="report-result active">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3>{reportData.title}</h3>
              <button className="btn btn-outline" onClick={() => setShowResult(false)}>Fechar</button>
            </div>

            {/* === RELATÓRIO GERAL === */}
            {reportType === 'geral' && (
              <>
                <div className="dashboard-stats">
                  {Object.entries(reportData.stats).slice(0, 6).map(([key, value]) => (
                    <div key={key} className="stat-card">
                      <h4>{key.replace(/([A-Z])/g, ' $1')}</h4>
                      <p>{typeof value === 'number' ? value : String(value)}</p>
                    </div>
                  ))}
                </div>

                <h4>Atividades por Tipo</h4>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={Object.entries(reportData.atividadesPorTipo).map(([k, v]) => ({ tipo: k, valor: v }))}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="tipo" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="valor" fill="#1abc9c" />
                  </BarChart>
                </ResponsiveContainer>
              </>
            )}

            {/* === RELATÓRIO POR EQUIPE === */}
            {(reportType === 'equipe' || reportType === 'equipe-periodo') && (
              <>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <h4>Equipes</h4>
                  <button
                    className="btn btn-primary"
                    onClick={() => window.dispatchEvent(new CustomEvent('abrirModalRelatorio'))}
                  >
                    + Criar Relatório de Equipe
                  </button>
                </div>

                <ResponsiveContainer width="100%" height={350}>
                  <BarChart
                    data={reportData.equipes.map(eq => ({
                      nome: eq.nome,
                      valor: reportType === 'equipe-periodo' ? eq.arrecadadoNoMes : eq.totalArrecadado
                    }))}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="nome" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="valor" fill="#9b59b6" />
                  </BarChart>
                </ResponsiveContainer>

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
                      {reportData.equipes.map(eq => (
                        <tr key={eq.id}>
                          <td style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <img
                              src={eq.fotoUrl || 'https://via.placeholder.com/40'}
                              alt={eq.nome}
                              style={{ width: '40px', height: '40px', borderRadius: '50%' }}
                            />
                            {eq.nome}
                          </td>
                          <td>{getMentorNome(eq.mentorId)}</td>
                          <td>{reportType === 'equipe-periodo' ? eq.atividadesNoMes : eq.totalAtividades}</td>
                          <td>{formatImpacto('dinheiro', reportType === 'equipe-periodo' ? eq.arrecadadoNoMes : eq.totalArrecadado)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            )}
          </div>
        )}

        {/* === LISTA DE RELATÓRIOS SALVOS === */}
        {relatorios.length > 0 && (
          <div style={{ marginTop: '2rem' }}>
            <h3>📁 Relatórios Salvos</h3>
            {loading ? (
              <p>Carregando relatórios...</p>
            ) : (
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Título</th>
                    <th>Tipo</th>
                    <th>Equipe</th>
                    <th>Data</th>
                  </tr>
                </thead>
                <tbody>
                  {relatorios.map(r => (
                    <tr key={r.id}>
                      <td>{r.titulo}</td>
                      <td>{r.tipo}</td>
                      <td>{r.equipe_id || '—'}</td>
                      <td>{new Date(r.created_at).toLocaleDateString('pt-BR')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}
      </div>
    </section>
  )
}

export default Relatorios
