import { useState } from 'react'

function Participantes({ active, participantes, setParticipantes }) {
  const [showModal, setShowModal] = useState(false)
  const [editingParticipante, setEditingParticipante] = useState(null)
  const [tipoFilter, setTipoFilter] = useState('')
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    tipo: '',
    curso: '',
    telefone: ''
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (editingParticipante) {
      // Editar participante existente
      setParticipantes(participantes.map(participante => 
        participante.id === editingParticipante.id 
          ? { ...formData, id: editingParticipante.id }
          : participante
      ))
    } else {
      // Criar novo participante
      const novoParticipante = {
        ...formData,
        id: Date.now()
      }
      setParticipantes([...participantes, novoParticipante])
    }
    
    resetForm()
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

  const handleDelete = (id) => {
    if (confirm('Tem certeza que deseja excluir este participante?')) {
      setParticipantes(participantes.filter(participante => participante.id !== id))
    }
  }

  const resetForm = () => {
    setFormData({ nome: '', email: '', tipo: '', curso: '', telefone: '' })
    setEditingParticipante(null)
    setShowModal(false)
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const filteredParticipantes = tipoFilter 
    ? participantes.filter(p => p.tipo === tipoFilter)
    : participantes

  return (
    <section className={`section ${active ? 'active' : ''}`}>
      <div className="container">
        <div className="section-header">
          <h2>Gerenciar Participantes</h2>
          <button className="btn btn-primary" onClick={() => setShowModal(true)}>
            <i className="fas fa-plus"></i> Novo Participante
          </button>
        </div>
        
        <div className="filters">
          <select 
            value={tipoFilter} 
            onChange={(e) => setTipoFilter(e.target.value)}
          >
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
              {filteredParticipantes.map(participante => (
                <tr key={participante.id}>
                  <td>{participante.nome}</td>
                  <td>{participante.email}</td>
                  <td>
                    <span className={`badge ${participante.tipo}`}>
                      {participante.tipo}
                    </span>
                  </td>
                  <td>{participante.curso}</td>
                  <td className="actions">
                    <button 
                      className="btn btn-primary" 
                      onClick={() => handleEdit(participante)}
                    >
                      Editar
                    </button>
                    <button 
                      className="btn btn-danger" 
                      onClick={() => handleDelete(participante.id)}
                    >
                      Excluir
                    </button>
                  </td>
                </tr>
              ))}
              {filteredParticipantes.length === 0 && (
                <tr>
                  <td colSpan="5" style={{ textAlign: 'center', padding: '2rem' }}>
                    Nenhum participante encontrado
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="modal active">
          <div className="modal-content">
            <div className="modal-header">
              <h2>{editingParticipante ? 'Editar Participante' : 'Novo Participante'}</h2>
              <span className="close" onClick={resetForm}>&times;</span>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="nome">Nome:</label>
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
                <label htmlFor="email">Email:</label>
                <input 
                  type="email" 
                  id="email" 
                  name="email" 
                  value={formData.email}
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
                  <option value="">Selecione...</option>
                  <option value="aluno">Aluno</option>
                  <option value="professor">Professor</option>
                  <option value="mentor">Mentor</option>
                  <option value="administrador">Administrador</option>
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="curso">Curso:</label>
                <input 
                  type="text" 
                  id="curso" 
                  name="curso" 
                  value={formData.curso}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label htmlFor="telefone">Telefone:</label>
                <input 
                  type="tel" 
                  id="telefone" 
                  name="telefone" 
                  value={formData.telefone}
                  onChange={handleChange}
                />
              </div>
              <button type="submit" className="btn btn-primary">Salvar</button>
            </form>
          </div>
        </div>
      )}
    </section>
  )
}

export default Participantes

