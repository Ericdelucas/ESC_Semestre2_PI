import { useState, useEffect } from 'react'
import axios from 'axios'
import ModalRelatorioEquipe from '../modal/ModalRelatorioEquipe'
import ModalVerRelatorio from '../modal/ModalVerRelatorio'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer, LineChart, Line
} from 'recharts'

function Relatorios({ active, edicoes = [], participantes = [], equipes = [], atividades = [] }) {
  const [reportFilter, setReportFilter] = useState('geral')
  const [reportData, setReportData] = useState({})
  const [showCreateReportModal, setShowCreateReportModal] = useState(false)
  const [showViewModal, setShowViewModal] = useState(false)
  const [selectedRelatorio, setSelectedRelatorio] = useState(null)
  const [relatorios, setRelatorios] = useState([])
  const [loading, setLoading] = useState(false)
  const [backendStats, setBackendStats] = useState(null)
  const [mensalData, setMensalData] = useState([])
  const [selectedEquipe, setSelectedEquipe] = useState('')

  // === Carrega dados iniciais ===
  useEffect(() => {
    fetchRelatorios()
    fetchBackendStats()
    fetchMensalStats()
  }, [])

  // === 🧮 Carrega relatórios ===
  const fetchRelatorios = async () => {
    try {
      setLoading(true)
      const res = await axios.get('http://localhost:3001/api/relatorios')
      const list = Array.isArray(res.data) ? res.data : (res.data?.data || [])
      setRelatorios(list)
    } catch (error) {
      console.error('Erro ao carregar relatórios:', error)
    } finally {
      setLoading(false)
    }
  }

  // === 📊 Estatísticas de pontuação total por equipe ===
  const fetchBackendStats = async () => {
    try {
      const res = await axios.get('http://localhost:3001/api/relatorios/stats/equipes')
      setBackendStats({ total_por_equipe: res.data.data })
    } catch (error) {
      console.error('Erro ao buscar estatísticas de equipes:', error)
    }
  }

  // === 📅 Estatísticas mensais ===
  const fetchMensalStats = async () => {
    try {
      const res = await axios.get('http://localhost:3001/api/doacoes/stats/mensal')
      setMensalData(res.data.data)
    } catch (error) {
      console.error('Erro ao buscar dados mensais:', error)
    }
  }

  // === 📝 Criação de relatório ===
  const handleCreateRelatorio = async (formData) => {
    try {
      const bodyBase = {
        titulo: formData.nomeEquipe || formData.titulo || 'Relatório de equipe',
        tipo: 'equipe',
        gerado_por: formData.mentor || 'Sistema',
        dados_json: JSON.stringify({
          resumo: formData.resumo,
          resultados: formData.resultados,
          tipoImpacto: formData.tipoImpacto,
          quantidade: formData.quantidade
        }),
        equipe_id: formData.equipe_id || null
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

  // === 🗑️ Excluir relatório ===
  const handleDeleteRelatorio = async (id) => {
    if (!confirm('Deseja excluir este relatório?')) return
    try {
      await axios.delete(`http://localhost:3001/api/relatorios/${id}`)
      setRelatorios(prev => prev.filter(r => r.id !== id))
      alert('🗑️ Relatório excluído com sucesso!')
    } catch (err) {
      console.error('Erro ao excluir relatório:', err)
      alert('Falha ao excluir relatório.')
    }
  }

  // === 👁️ Ver relatório ===
  const handleViewRelatorio = (r) => {
    setSelectedRelatorio(r)
    setShowViewModal(true)
  }

  // === Filtragem de dados para o gráfico mensal ===
  const filteredMensal = mensalData
    .filter(d => selectedEquipe ? d.equipe_nome === selectedEquipe : true)
    .map(d => ({
      ...d,
      mesAno: `${String(d.mes).padStart(2, '0')}/${d.ano}`
    }))

  if (!active) return null

  return (
    <section className={`section ${active ? 'active' : ''}`}>
      <div className="container">
        {/* Cabeçalho */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2>📊 Relatórios</h2>
          <button className="btn btn-primary" onClick={() => setShowCreateReportModal(true)}>
            + Criar Relatório de Equipe
          </button>
        </div>

        {/* Filtros */}
        <div style={{ margin: '1rem 0', display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <label><strong>Filtrar gráfico por:</strong></label>
          <select value={reportFilter} onChange={(e) => setReportFilter(e.target.value)}>
            <option value="geral">Geral</option>
            <option value="mensal">Doações por Mês</option>
          </select>
        </div>

        {/* === Gráfico Geral === */}
        {reportFilter === 'geral' && backendStats?.total_por_equipe?.length > 0 && (
          <div style={{ marginBottom: '2rem' }}>
            <h3>💪 Pontuação Total das Equipes</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={backendStats.total_por_equipe}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="equipe_nome" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="total_pontos" fill="#27ae60" name="Pontos" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* === Gráfico Mensal === */}
        {reportFilter === 'mensal' && (
          <div style={{ margin: '2rem 0' }}>
            <h3>📅 Doações Recebidas por Mês</h3>
            <div style={{ marginBottom: '1rem' }}>
              <label>Filtrar por equipe: </label>
              <select value={selectedEquipe} onChange={(e) => setSelectedEquipe(e.target.value)}>
                <option value="">Todas</option>
                {equipes.map(eq => (
                  <option key={eq.id} value={eq.nome}>{eq.nome}</option>
                ))}
              </select>
            </div>

            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={filteredMensal}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="mesAno" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="total_doacoes" stroke="#3498db" name="Doações" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* === Top 5 === */}
        {backendStats?.total_por_equipe?.length > 0 && (
          <div style={{ marginTop: '2.5rem' }}>
            <h3>🏆 Top 5 Equipes com Mais Pontos</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={backendStats.total_por_equipe.slice(0, 5)}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="equipe_nome" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="total_pontos" fill="#f39c12" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* === Tabela de Relatórios Criados === */}
        <div style={{ marginTop: '3rem' }}>
          <h3>📁 Relatórios Criados</h3>
          {loading ? (
            <p>Carregando...</p>
          ) : relatorios.length === 0 ? (
            <p>Nenhum relatório criado ainda.</p>
          ) : (
            <table className="data-table">
              <thead>
                <tr>
                  <th>Título</th>
                  <th>Equipe</th>
                  <th>Tipo</th>
                  <th>Data</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {relatorios.map(r => {
                  const equipeNome = equipes.find(e => e.id === r.equipe_id)?.nome || '—'
                  return (
                    <tr key={r.id}>
                      <td>{r.titulo}</td>
                      <td>{equipeNome}</td>
                      <td>{r.tipo}</td>
                      <td>{new Date(r.created_at).toLocaleDateString('pt-BR')}</td>
                      <td>
                        <button
                          className="btn btn-sm btn-outline"
                          onClick={() => handleViewRelatorio(r)}
                        >👁️ Ver</button>
                        <button
                          className="btn btn-sm btn-danger"
                          onClick={() => handleDeleteRelatorio(r.id)}
                          style={{ marginLeft: '0.5rem' }}
                        >🗑️ Excluir</button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          )}
        </div>

        {/* === Modais === */}
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
        />
      </div>
    </section>
  )
}

export default Relatorios
