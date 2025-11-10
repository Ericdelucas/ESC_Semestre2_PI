import { useState, useEffect } from 'react'
import { atividadesService } from '../services/api'

function Atividades({ active, atividades, setAtividades, equipes }) {
  const [showModal, setShowModal] = useState(false)
  const [editingAtividade, setEditingAtividade] = useState(null)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    nome: '',
    tipo: '',
    equipeId: '',
    dataInicio: '',
    dataFim: '',
    meta: '',
    arrecadado: '',
    descricao: ''
  })

  const tiposAtividade = [
    'Arrecadação de Alimentos',
    'Arrecadação de Roupas',
    'Arrecadação de Dinheiro',
    'Workshop',
    'Palestra',
    'Visita Social',
    'Campanha de Conscientização',
    'Outro'
  ]

  // 🔹 Carregar atividades do backend
  useEffect(() => {
    if (active) {
      loadAtividades()
    }
  }, [active])

  const loadAtividades = async () => {
    try {
      setLoading(true)
      const response = await atividadesService.getAll()
      setAtividades(response.data.data || [])
    } catch (error) {
      console.error('Erro ao carregar atividades:', error)
      alert('Erro ao carregar atividades. Verifique se o backend está rodando.')
    } finally {
      setLoading(false)
    }
  }

  // 🔹 Criar ou atualizar atividade
  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      setLoading(true)
      if (editingAtividade) {
        await atividadesService.update(editingAtividade.id, formData)
      } else {
        await atividadesService.create(formData)
      }

      await loadAtividades()
      resetForm()
      alert(editingAtividade ? 'Atividade atualizada com sucesso!' : 'Atividade criada com sucesso!')
    } catch (error) {
      console.error('Erro ao salvar atividade:', error)
      alert('Erro ao salvar atividade. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  // 🔹 Editar atividade existente
  const handleEdit = (atividade) => {
    setEditingAtividade(atividade)
    setFormData({
      nome: atividade.nome,
      tipo: atividade.tipo,
      equipeId: atividade.equipe_id || atividade.equipeId,
      dataInicio: atividade.dataInicio || '',
      dataFim: atividade.dataFim || '',
      meta: atividade.meta_financeira || atividade.meta || '',
      arrecadado: atividade.valor_arrecadado || atividade.arrecadado || '',
      descricao: atividade.descricao || ''
    })
    setShowModal(true)
  }

  // 🔹 Excluir atividade
  const handleDelete = async (id) => {
    if (confirm('Tem certeza que deseja excluir esta atividade?')) {
      try {
        setLoading(true)
        await atividadesService.delete(id)
        await loadAtividades()
        alert('Atividade excluída com sucesso!')
      } catch (error) {
        console.error('Erro ao excluir atividade:', error)
        alert('Erro ao excluir atividade. Tente novamente.')
      } finally {
        setLoading(false)
      }
    }
  }

  const resetForm = () => {
    setFormData({
      nome: '',
      tipo: '',
      equipeId: '',
      dataInicio: '',
      dataFim: '',
      meta: '',
      arrecadado: '',
      descricao: ''
    })
    setEditingAtividade(null)
    setShowModal(false)
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const getEquipeNome = (equipeId) => {
    const equipe = equipes.find(e => e.id === parseInt(equipeId))
    return equipe ? equipe.nome : 'N/A'
  }

  const formatCurrency = (value) => {
    if (!value) return 'R$ 0,00'
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value)
  }

  const getProgressPercentage = (arrecadado, meta) => {
    if (!meta || meta === 0) return 0
    return Math.min((arrecadado / meta) * 100, 100)
  }

  if (!active) return null

  return (
    <section className="section active">
      <div className="container">
        <div className="section-header">
          <h2>Gerenciamento de Atividades</h2>
          <button 
            className="btn btn-primary" 
            onClick={() => setShowModal(true)} 
            disabled={loading}
          >
            <i className="fas fa-plus"></i> Nova Atividade
          </button>
        </div>

        {loading && (
          <div className="loading-message">
            <i className="fas fa-spinner fa-spin"></i> Carregando...
          </div>
        )}

        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Nome</th>
                <th>Tipo</th>
                <th>Equipe</th>
                <th>Meta</th>
                <th>Arrecadado</th>
                <th>Progresso</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {atividades.length === 0 ? (
                <tr>
                  <td colSpan="7" className="no-data">
                    <i className="fas fa-info-circle"></i>
                    Nenhuma atividade cadastrada. Clique em "Nova Atividade" para começar.
                  </td>
                </tr>
              ) : (
                atividades.map(atividade => (
                  <tr key={atividade.id}>
                    <td>{atividade.nome}</td>
                    <td>{atividade.tipo}</td>
                    <td>{getEquipeNome(atividade.equipe_id || atividade.equipeId)}</td>
                    <td>{formatCurrency(atividade.meta_financeira || atividade.meta)}</td>
                    <td>{formatCurrency(atividade.valor_arrecadado || atividade.arrecadado)}</td>
                    <td>
                      <div style={{
                        width: '100px',
                        height: '10px',
                        backgroundColor: '#eee',
                        borderRadius: '5px',
                        overflow: 'hidden'
                      }}>
                        <div style={{
                          width: `${getProgressPercentage(
                            atividade.valor_arrecadado || atividade.arrecadado,
                            atividade.meta_financeira || atividade.meta
                          )}%`,
                          height: '100%',
                          backgroundColor: '#28a745',
                          transition: 'width 0.3s ease'
                        }}></div>
                      </div>
                      <small>
                        {getProgressPercentage(
                          atividade.valor_arrecadado || atividade.arrecadado,
                          atividade.meta_financeira || atividade.meta
                        ).toFixed(1)}%
                      </small>
                    </td>
                    <td>
                      <div className="action-buttons">
                        <button
                          className="btn btn-sm btn-outline"
                          onClick={() => handleEdit(atividade)}
                          disabled={loading}
                        >
                          <i className="fas fa-edit"></i>
                        </button>
                        <button
                          className="btn btn-sm btn-danger"
                          onClick={() => handleDelete(atividade.id)}
                          disabled={loading}
                        >
                          <i className="fas fa-trash"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Modal */}
        {showModal && (
          <div className="modal active">
            <div className="modal-content">
              <div className="modal-header">
                <h2>{editingAtividade ? 'Editar Atividade' : 'Nova Atividade'}</h2>
                <span className="close" onClick={resetForm}>&times;</span>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label htmlFor="nome">Nome da Atividade:</label>
                  <input
                    type="text"
                    id="nome"
                    name="nome"
                    value={formData.nome}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="tipo">Tipo:</label>
                  <select
                    id="tipo"
                    name="tipo"
                    value={formData.tipo}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Selecione o tipo...</option>
                    {tiposAtividade.map(tipo => (
                      <option key={tipo} value={tipo}>{tipo}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="equipeId">Equipe:</label>
                  <select
                    id="equipeId"
                    name="equipeId"
                    value={formData.equipeId}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Selecione uma equipe...</option>
                    {equipes.map(equipe => (
                      <option key={equipe.id} value={equipe.id}>{equipe.nome}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="meta">Meta (R$):</label>
                  <input
                    type="number"
                    id="meta"
                    name="meta"
                    step="0.01"
                    value={formData.meta}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="arrecadado">Arrecadado (R$):</label>
                  <input
                    type="number"
                    id="arrecadado"
                    name="arrecadado"
                    step="0.01"
                    value={formData.arrecadado}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="descricao">Descrição:</label>
                  <textarea
                    id="descricao"
                    name="descricao"
                    rows="3"
                    value={formData.descricao}
                    onChange={handleChange}
                  />
                </div>

                <div className="modal-actions">
                  <button 
                    type="button" 
                    className="btn btn-outline" 
                    onClick={resetForm}
                    disabled={loading}
                  >
                    Cancelar
                  </button>
                  <button 
                    type="submit" 
                    className="btn btn-primary"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <i className="fas fa-spinner fa-spin"></i> Salvando...
                      </>
                    ) : (
                      <>
                        <i className="fas fa-save"></i> {editingAtividade ? 'Atualizar' : 'Criar'}
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}

export default Atividades
