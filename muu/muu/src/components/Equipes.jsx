import { useState } from 'react'

function Equipes({ active, equipes, setEquipes, participantes, edicoes }) {
  const [showModal, setShowModal] = useState(false)
  const [editingEquipe, setEditingEquipe] = useState(null)
  const [formData, setFormData] = useState({
    nome: '',
    mentorId: '',
    membrosIds: [],
    edicaoId: '',
    descricao: ''
  })

  const mentores = participantes.filter(p => p.tipo === 'mentor')
  const alunos = participantes.filter(p => p.tipo === 'aluno')

  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (editingEquipe) {
      // Editar equipe existente
      setEquipes(equipes.map(equipe => 
        equipe.id === editingEquipe.id 
          ? { ...formData, id: editingEquipe.id }
          : equipe
      ))
    } else {
      // Criar nova equipe
      const novaEquipe = {
        ...formData,
        id: Date.now()
      }
      setEquipes([...equipes, novaEquipe])
    }
    
    resetForm()
  }

  const handleEdit = (equipe) => {
    setEditingEquipe(equipe)
    setFormData({
      nome: equipe.nome,
      mentorId: equipe.mentorId,
      membrosIds: equipe.membrosIds,
      edicaoId: equipe.edicaoId,
      descricao: equipe.descricao
    })
    setShowModal(true)
  }

  const handleDelete = (id) => {
    if (confirm('Tem certeza que deseja excluir esta equipe?')) {
      setEquipes(equipes.filter(equipe => equipe.id !== id))
    }
  }

  const resetForm = () => {
    setFormData({ nome: '', mentorId: '', membrosIds: [], edicaoId: '', descricao: '' })
    setEditingEquipe(null)
    setShowModal(false)
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleMembrosChange = (e) => {
    const selectedOptions = Array.from(e.target.selectedOptions, option => option.value)
    setFormData({
      ...formData,
      membrosIds: selectedOptions
    })
  }

  const getMentorNome = (mentorId) => {
    const mentor = participantes.find(p => p.id === parseInt(mentorId))
    return mentor ? mentor.nome : 'N/A'
  }

  const getEdicaoNome = (edicaoId) => {
    const edicao = edicoes.find(e => e.id === parseInt(edicaoId))
    return edicao ? edicao.nome : 'N/A'
  }

  const getMembrosNomes = (membrosIds) => {
    return membrosIds.map(id => {
      const membro = participantes.find(p => p.id === parseInt(id))
      return membro ? membro.nome : 'N/A'
    }).join(', ')
  }

  return (
    <section className={`section ${active ? 'active' : ''}`}>
      <div className="container">
        <div className="section-header">
          <h2>Gerenciar Equipes</h2>
          <button className="btn btn-primary" onClick={() => setShowModal(true)}>
            <i className="fas fa-plus"></i> Nova Equipe
          </button>
        </div>
        
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Nome</th>
                <th>Mentor</th>
                <th>Membros</th>
                <th>Edição</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {equipes.map(equipe => (
                <tr key={equipe.id}>
                  <td>{equipe.nome}</td>
                  <td>{getMentorNome(equipe.mentorId)}</td>
                  <td>{getMembrosNomes(equipe.membrosIds)}</td>
                  <td>{getEdicaoNome(equipe.edicaoId)}</td>
                  <td className="actions">
                    <button 
                      className="btn btn-primary" 
                      onClick={() => handleEdit(equipe)}
                    >
                      Editar
                    </button>
                    <button 
                      className="btn btn-danger" 
                      onClick={() => handleDelete(equipe.id)}
                    >
                      Excluir
                    </button>
                  </td>
                </tr>
              ))}
              {equipes.length === 0 && (
                <tr>
                  <td colSpan="5" style={{ textAlign: 'center', padding: '2rem' }}>
                    Nenhuma equipe cadastrada
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
              <h2>{editingEquipe ? 'Editar Equipe' : 'Nova Equipe'}</h2>
              <span className="close" onClick={resetForm}>&times;</span>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="nome">Nome da Equipe:</label>
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
                <label htmlFor="mentorId">Mentor:</label>
                <select 
                  id="mentorId" 
                  name="mentorId" 
                  value={formData.mentorId}
                  onChange={handleChange}
                  required
                >
                  <option value="">Selecione um mentor...</option>
                  {mentores.map(mentor => (
                    <option key={mentor.id} value={mentor.id}>
                      {mentor.nome}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="membrosIds">Membros (Alunos):</label>
                <select 
                  id="membrosIds" 
                  name="membrosIds" 
                  multiple
                  value={formData.membrosIds}
                  onChange={handleMembrosChange}
                  className="checkbox-group"
                  style={{ height: '150px' }}
                >
                  {alunos.map(aluno => (
                    <option key={aluno.id} value={aluno.id}>
                      {aluno.nome} - {aluno.curso}
                    </option>
                  ))}
                </select>
                <small>Segure Ctrl (ou Cmd) para selecionar múltiplos alunos</small>
              </div>
              <div className="form-group">
                <label htmlFor="edicaoId">Edição:</label>
                <select 
                  id="edicaoId" 
                  name="edicaoId" 
                  value={formData.edicaoId}
                  onChange={handleChange}
                  required
                >
                  <option value="">Selecione uma edição...</option>
                  {edicoes.map(edicao => (
                    <option key={edicao.id} value={edicao.id}>
                      {edicao.nome}
                    </option>
                  ))}
                </select>
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
              <button type="submit" className="btn btn-primary">Salvar</button>
            </form>
          </div>
        </div>
      )}
    </section>
  )
}

export default Equipes

