// src/components/Relatorios.jsx
import { useState, useEffect } from 'react'
import axios from 'axios'
import ModalRelatorioEquipe from '../modal/ModalRelatorioEquipe'
import ModalVerRelatorio from '../modal/ModalVerRelatorio'
import {
  BarChart, Bar, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts'

function Relatorios({ active, edicoes = [], participantes = [], equipes = [], atividades = [] }) {
  const [reportFilter, setReportFilter] = useState('geral')
  const [reportData, setReportData] = useState({})
  const [showCreateReportModal, setShowCreateReportModal] = useState(false)
  const [showViewModal, setShowViewModal] = useState(false)
  const [selectedRelatorio, setSelectedRelatorio] = useState(null)
  const [relatorios, setRelatorios] = useState([])
  const [loading, setLoading] = useState(false)

  // Pontos por tipo
  const itemPontos = {
    arroz: 1, feijao: 2, acucar: 3, oleo: 4,
    macarrao: 5, fuba: 6, leite: 7, outro: 8, dinheiro: 9
  }

  // --- Backend: carregar relatórios
  useEffect(() => { fetchRelatorios() }, [])

  const fetchRelatorios = async () => {
    try {
      setLoading(true)
      const res = await axios.get('http://localhost:3001/api/relatorios')
      // aceita res.data ou res.data.data
      const list = Array.isArray(res.data) ? res.data : (res.data?.data || [])
      setRelatorios(list)
    } catch (error) {
      console.error('Erro ao carregar relatórios:', error)
    } finally {
      setLoading(false)
    }
  }

  // --- Cria relatório (recebe o objeto do modal)
  const handleCreateRelatorio = async (formData) => {
    try {
      // Normalizar: o modal pode enviar equipe_id (numérico) ou nome (string em nomeEquipe).
      // Aceitamos ambos: preferimos equipe_id numérico.
      const bodyBase = {
        titulo: formData.nomeEquipe || formData.titulo || 'Relatório de equipe',
        tipo: 'equipe',
        gerado_por: formData.mentor || 'Sistema',
        dados_json: JSON.stringify({
          resumo: formData.resumo,
          resultados: formData.resultados,
          tipoImpacto: formData.tipoImpacto,
          quantidade: formData.quantidade
        })
      }

      // se formData.equipe_id existe e é numérico, usa; se o modal só mandou nomeEquipe (nome),
      // enviamos equipe_id vazio (o backend pode aceitar) mas armazenamos o nome em 'titulo'.
      if (formData.equipe_id && !isNaN(parseInt(formData.equipe_id))) {
        bodyBase.equipe_id = parseInt(formData.equipe_id)
      } else if (formData.nomeEquipe && isNaN(Number(formData.nomeEquipe))) {
        // enviamos titulo com nome (já setado) e não passamos equipe_id numérico
        // Backend receberá titulo (com o nome) — o nosso código de relatório lida com isso.
      }

      if (formData.imagem instanceof File) {
        const fd = new FormData()
        Object.entries(bodyBase).forEach(([k, v]) => fd.append(k, v))
        fd.append('arquivo', formData.imagem)
        await axios.post('http://localhost:3001/api/relatorios', fd, {
          headers: { 'Content-Type': 'multipart/form-data' }
        })
      } else {
        await axios.post('http://localhost:3001/api/relatorios', bodyBase)
      }

      alert('✅ Relatório criado com sucesso!')
      setShowCreateReportModal(false)
      await fetchRelatorios()
    } catch (err) {
      console.error('Erro ao criar relatório:', err)
      alert('❌ Falha ao salvar relatório. Veja o console.')
    }
  }

  const handleDeleteRelatorio = async (id) => {
    if (!confirm('Deseja excluir este relatório?')) return
    try {
      await axios.delete(`http://localhost:3001/api/relatorios/${id}`)
      setRelatorios(prev => prev.filter(r => r.id !== id))
    } catch (err) {
      console.error('Erro ao excluir relatório:', err)
      alert('Falha ao excluir. Veja console.')
    }
  }

  const handleViewRelatorio = (r) => {
    setSelectedRelatorio(r)
    setShowViewModal(true)
  }

  // --- Helpers robustos para extrair tipo/quantidade/pontos
  const safeParseJSON = (val) => {
    if (!val) return {}
    try { return (typeof val === 'string') ? JSON.parse(val) : val } catch { return {} }
  }

  const parseQuantidadeFromRel = (r) => {
    // procura em vários campos possíveis
    if (!r) return 0
    if (r.quantidade != null) return parseFloat(String(r.quantidade).replace(',', '.')) || 0
    if (r.qtd != null) return parseFloat(String(r.qtd).replace(',', '.')) || 0
    // dados_json
    const dj = safeParseJSON(r.dados_json)
    if (dj.quantidade != null) return parseFloat(String(dj.quantidade).replace(',', '.')) || 0
    if (dj.impacto) {
      const m = String(dj.impacto).match(/([\d\.,]+)/)
      if (m) return parseFloat(m[1].replace(',', '.')) || 0
    }
    // campo impacto direto
    if (r.impacto) {
      const m = String(r.impacto).match(/([\d\.,]+)/)
      if (m) return parseFloat(m[1].replace(',', '.')) || 0
    }
    return 0
  }

  const parseTipoFromRel = (r) => {
    if (!r) return 'outro'
    // campos diretos
    if (r.tipoImpacto) return String(r.tipoImpacto).toLowerCase()
    if (r.tipo) return String(r.tipo).toLowerCase()
    // dados_json
    const dj = safeParseJSON(r.dados_json)
    if (dj.tipoImpacto) return String(dj.tipoImpacto).toLowerCase()
    if (dj.tipo) return String(dj.tipo).toLowerCase()
    // impacto text
    const text = (r.impacto || r.titulo || '').toLowerCase()
    if (text.includes('r$') || text.includes('dinheiro')) return 'dinheiro'
    if (text.includes('arroz')) return 'arroz'
    if (text.includes('feijão') || text.includes('feijao') || text.includes('feijao')) return 'feijao'
    if (text.includes('óleo') || text.includes('oleo') || text.includes('l')) return 'oleo'
    return 'outro'
  }

  const pontosDoRelatorio = (r) => {
    const tipo = parseTipoFromRel(r)
    let key = tipo
    if (tipo === 'feijão') key = 'feijao'
    if (!(key in itemPontos)) key = 'outro'
    const qtd = parseQuantidadeFromRel(r) || 0
    const peso = itemPontos[key] || itemPontos['outro'] || 1
    return qtd * peso
  }

  // --- Mapear nome da equipe a partir do relatorio (tenta id numérico, depois trata strings)
  const getEquipeNameFromRel = (r) => {
    if (!r) return '—'
    // 1) se tem equipe_id numérico -> procura no array equipes
    const maybeId = r.equipe_id ?? r.equipeId ?? r.equipe
    if (maybeId != null && String(maybeId).trim() !== '') {
      if (!isNaN(parseInt(maybeId))) {
        const eq = equipes.find(e => String(e.id) === String(maybeId))
        if (eq) return eq.nome
      } else {
        // equipe_id é uma string (provavelmente nome) — tenta achar por nome
        const eq = equipes.find(e => String(e.nome).toLowerCase() === String(maybeId).toLowerCase())
        if (eq) return eq.nome
      }
    }
    // 2) se não há, tenta achar por título contendo nome da equipe
    const title = r.titulo || ''
    const found = equipes.find(e => title && title.toLowerCase().includes(String(e.nome).toLowerCase()))
    if (found) return found.nome
    // 3) fallback -> título ou '—'
    return r.titulo || '—'
  }

  // --- Geração de relatórios exibidos
  const generateGeralReport = () => {
    const pontosPorEquipe = {}
    relatorios.forEach(r => {
      const nome = getEquipeNameFromRel(r)
      const pts = pontosDoRelatorio(r)
      pontosPorEquipe[nome] = (pontosPorEquipe[nome] || 0) + pts
    })
    return { title: 'Relatório Geral', pontosPorEquipe }
  }

  const generateEquipePeriodoReport = () => {
    const hoje = new Date()
    const mesPassado = new Date(hoje.getFullYear(), hoje.getMonth() - 1, hoje.getDate())
    const equipesComPontos = equipes.map(eq => {
      const pontos = relatorios
        .filter(r => {
          // aceita r.equipe_id numérico ou r.titulo contendo nome
          const matchesId = r.equipe_id != null && !isNaN(parseInt(r.equipe_id)) && String(r.equipe_id) === String(eq.id)
          const matchesNome = (r.titulo && String(r.titulo).toLowerCase().includes(String(eq.nome).toLowerCase()))
          // created_at pode vir em created_at ou createdAt
          const created = new Date(r.created_at || r.createdAt || r.createdAt || 0)
          return (matchesId || matchesNome) && created >= mesPassado
        })
        .reduce((acc, r) => acc + pontosDoRelatorio(r), 0)
      return { ...eq, pontos }
    })
    return { title: 'Equipes (Último Mês)', equipes: equipesComPontos }
  }

  // Atualiza reportData quando filter ou dados mudam
  useEffect(() => {
    if (relatorios.length === 0) {
      setReportData({})
      return
    }
    if (reportFilter === 'equipe-periodo') setReportData(generateEquipePeriodoReport())
    else setReportData(generateGeralReport())
  }, [reportFilter, relatorios, equipes, atividades])

  if (!active) return null

  return (
    <section className={`section ${active ? 'active' : ''}`}>
      <div className="container">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2>📊 Relatórios</h2>
          <button className="btn btn-primary" onClick={() => setShowCreateReportModal(true)}>+ Criar Relatório de Equipe</button>
        </div>

        <div style={{ margin: '1rem 0', display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <label><strong>Filtrar gráfico por:</strong></label>
          <select value={reportFilter} onChange={(e) => setReportFilter(e.target.value)} style={{ padding: '0.4rem 0.8rem' }}>
            <option value="geral">Geral</option>
            <option value="equipe-periodo">Equipes (Último Mês)</option>
          </select>
        </div>

        {/* Gráfico Geral (pontos por equipe) */}
        {reportFilter === 'geral' && reportData?.pontosPorEquipe && Object.keys(reportData.pontosPorEquipe).length > 0 ? (
          <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer>
              <BarChart data={Object.entries(reportData.pontosPorEquipe).map(([nome, pts]) => ({ nome, pts }))}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="nome" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="pts" fill="#1abc9c" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        ) : reportFilter === 'geral' ? (
          <p style={{ textAlign: 'center', marginTop: '1rem' }}>Nenhum dado disponível para o gráfico geral.</p>
        ) : null}

        {/* Gráfico Último Mês por equipe */}
        {reportFilter === 'equipe-periodo' && reportData?.equipes?.length > 0 ? (
          <div style={{ width: '100%', height: 320 }}>
            <ResponsiveContainer>
              <BarChart data={reportData.equipes.map(eq => ({ nome: eq.nome, pontos: eq.pontos }))}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="nome" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="pontos" fill="#9b59b6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        ) : reportFilter === 'equipe-periodo' ? (
          <p style={{ textAlign: 'center', marginTop: '1rem' }}>Nenhum dado disponível para o último mês.</p>
        ) : null}

        {/* Lista de relatórios criados */}
        <div style={{ marginTop: '2rem' }}>
          <h3>📁 Relatórios Criados</h3>
          {loading ? <p>Carregando...</p> : (
            relatorios.length === 0 ? <p>Nenhum relatório criado ainda.</p> : (
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Título</th>
                    <th>Equipe</th>
                    <th>Pontos</th>
                    <th>Data</th>
                    <th>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {relatorios.map(r => {
                    const equipeNome = getEquipeNameFromRel(r)
                    const pts = pontosDoRelatorio(r)
                    return (
                      <tr key={r.id}>
                        <td>{r.titulo}</td>
                        <td>{equipeNome}</td>
                        <td>{pts}</td>
                        <td>{new Date(r.created_at || r.createdAt || Date.now()).toLocaleDateString('pt-BR')}</td>
                        <td>
                          <button className="btn btn-sm btn-outline" onClick={() => handleViewRelatorio(r)}>👁️ Ver</button>
                          <button className="btn btn-sm btn-danger" onClick={() => handleDeleteRelatorio(r.id)}>🗑️ Excluir</button>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            )
          )}
        </div>

        {/* Top 5 ranking (fixo) */}
        {relatorios.length > 0 && (
          <div style={{ marginTop: '2.5rem' }}>
            <h3>🏆 Top 5 Equipes com Mais Pontos</h3>
            <div style={{ width: '100%', height: 300 }}>
              <ResponsiveContainer>
                <BarChart
                  data={Object.entries(
                    relatorios.reduce((acc, r) => {
                      const nome = getEquipeNameFromRel(r) || 'Sem equipe'
                      acc[nome] = (acc[nome] || 0) + pontosDoRelatorio(r)
                      return acc
                    }, {})
                  )
                    .map(([nome, pontos]) => ({ nome, pontos }))
                    .sort((a, b) => b.pontos - a.pontos)
                    .slice(0, 5)
                  }
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="nome" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="pontos" fill="#f39c12" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* Modais */}
        <ModalRelatorioEquipe
          show={showCreateReportModal}
          onClose={() => setShowCreateReportModal(false)}
          onSubmit={handleCreateRelatorio}
        />

        <ModalVerRelatorio
          show={showViewModal}
          onClose={() => setShowViewModal(false)}
          relatorio={selectedRelatorio}
          equipes={equipes}
          participantes={participantes}
          pontosDoRelatorio={pontosDoRelatorio}
        />
      </div>
    </section>
  )
}

export default Relatorios
