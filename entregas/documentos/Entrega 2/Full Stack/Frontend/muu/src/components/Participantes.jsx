import { useState, useEffect } from 'react'
import { participantesService } from '../services/api'

function Participantes({ active, participantes, setParticipantes }) {
  const [showModal, setShowModal] = useState(false)
  const [editingParticipante, setEditingParticipante] = useState(null)
  const [tipoFilter, setTipoFilter] = useState('')
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    tipo: '',
    curso: '',
    telefone: ''
  })

  useEffect(() => {
    if (active) loadParticipantes()
  }, [active])

  const loadParticipantes = async () => {
    try {
      setLoading(true)
      const response = await participantesService.getAll()
      setParticipantes(response.data.data || [])
    } catch (error) {
      console.error('Erro ao carregar participantes:', error)
      alert('Erro ao carregar participantes. Verifique se o backend está rodando.')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      setLoading(true)
      if (editingParticipante) {
        await participantesService.update(editingParticipante.id, formData)
      } else {
        await participantesService.create(formData)
      }
      await loadParticipantes()
      resetForm()
      alert(editingParticipante ? 'Participante atualizado!' : 'Participante criado!')
    } catch (error) {
      console.error('Erro ao salvar participante:', error)
      alert('Erro ao salvar participante. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (participante) => {
    setEditingParticipante(participante)
    setFormData({
      nome: participante.nome,
      email: participante.email,
      tipo: participante.tipo,
      curso: participante.curso,
      telefone: participante.telefone
    })
    setShowModal(true)
  }

  const handleDelete = async (id) => {
    if (confirm('Tem certeza que deseja excluir este participante?')) {
      try {
        setLoading(true)
        await participantesService.delete(id)
        await loadParticipantes()
        alert('Participante excluído com sucesso!')
      } catch (error) {
        console.error('Erro ao excluir participante:', error)
        alert('Erro ao excluir participante. Tente novamente.')
      } finally {
        setLoading(false)
      }
    }
  }

  const resetForm = () => {
    setFormData({ nome: '', email: '', tipo: '', curso: '', telefone: '' })
    setEditingParticipante(null)
    setShowModal(false)
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const filteredParticipantes = tipoFilter
    ? participantes.filter(p => p.tipo === tipoFilter)
    : participantes

  if (!active) return null

  return (
    <section className="section active">
      <div className="container">
        <div className="section-header">
          <h2>Gerenciamento de Participantes</h2>
          <button 
            className="btn btn-primary" 
            onClick={() => setShowModal(true)}
            disabled={loading}
          >
            <i className="fas fa-plus"></i> Novo Participante
          </button>
        </div>

        {loading && <div className="loading-message"><i className="fas fa-spinner fa-spin"></i> Carregando...</div>}

        <div className="filters">
          <select value={tipoFilter} onChange={(e) => setTipoFilter(e.target.value)}>
            <option value="">Todos os tipos</option>
            <option value="aluno">Alunos</option>
            <option value="professor">Professores</option>
            <option value="mentor">Mentores</option>
            <option value="administrador">Administradores</option>
          </select>
        </div>

        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Nome</th>
                <th>Email</th>
                <th>Tipo</th>
                <th>Curso</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {filteredParticipantes.length === 0 ? (
                <tr>
                  <td colSpan="5" className="no-data">Nenhum participante encontrado.</td>
                </tr>
              ) : (
                filteredParticipantes.map(participante => (
                  <tr key={participante.id}>
                    <td>{participante.nome}</td>
                    <td>{participante.email}</td>
                    <td><span className={`badge ${participante.tipo}`}>{participante.tipo}</span></td>
                    <td>{participante.curso}</td>
                    <td>
                      <button className="btn btn-sm btn-outline" onClick={() => handleEdit(participante)}>Editar</button>
                      <button className="btn btn-sm btn-danger" onClick={() => handleDelete(participante.id)}>Excluir</button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {showModal && (
          <div className="modal active">
            <div className="modal-content">
              <div className="modal-header">
                <h2>{editingParticipante ? 'Editar Participante' : 'Novo Participante'}</h2>
                <span className="close" onClick={resetForm}>&times;</span>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label>Nome:</label>
                  <input name="nome" value={formData.nome} onChange={handleChange} required />
                </div>
                <div className="form-group">
                  <label>Email:</label>
                  <input name="email" type="email" value={formData.email} onChange={handleChange} required />
                </div>
                <div className="form-group">
                  <label>Tipo:</label>
                  <select name="tipo" value={formData.tipo} onChange={handleChange} required>
                    <option value="">Selecione...</option>
                    <option value="aluno">Aluno</option>
                    <option value="professor">Professor</option>
                    <option value="mentor">Mentor</option>
                    <option value="administrador">Administrador</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Curso:</label>
                  <input name="curso" value={formData.curso} onChange={handleChange} />
                </div>
                <div className="form-group">
                  <label>Telefone:</label>
                  <input name="telefone" value={formData.telefone} onChange={handleChange} />
                </div>
                <button type="submit" className="btn btn-primary" disabled={loading}>
                  {loading ? <i className="fas fa-spinner fa-spin"></i> : 'Salvar'}
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}

export default Participantes
