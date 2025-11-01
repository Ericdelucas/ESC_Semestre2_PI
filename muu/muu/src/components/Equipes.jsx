import { useState, useEffect } from 'react'
import { equipesService } from '../services/api'

function Equipes({ active, equipes, setEquipes, participantes, edicoes }) {
  const [showModal, setShowModal] = useState(false)
  const [editingEquipe, setEditingEquipe] = useState(null)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    nome: '',
    mentorId: '',
    membrosIds: [],
    edicaoId: '',
    descricao: ''
  })

  const mentores = participantes.filter(p => p.tipo === 'mentor')
  const alunos = participantes.filter(p => p.tipo === 'aluno')

  useEffect(() => {
    if (active) loadEquipes()
  }, [active])

  const loadEquipes = async () => {
    try {
      setLoading(true)
      const response = await equipesService.getAll()
      setEquipes(response.data.data || [])
    } catch (error) {
      console.error('Erro ao carregar equipes:', error)
      alert('Erro ao carregar equipes. Verifique se o backend está rodando.')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      setLoading(true)
      const payload = { ...formData, membros: formData.membrosIds.join(',') }
      if (editingEquipe) {
        await equipesService.update(editingEquipe.id, payload)
      } else {
        await equipesService.create(payload)
      }
      await loadEquipes()
      resetForm()
      alert(editingEquipe ? 'Equipe atualizada!' : 'Equipe criada!')
    } catch (error) {
      console.error('Erro ao salvar equipe:', error)
      alert('Erro ao salvar equipe. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (equipe) => {
    setEditingEquipe(equipe)
    setFormData({
      nome: equipe.nome,
      mentorId: equipe.mentorId || '',
      membrosIds: equipe.membros?.split(',') || [],
      edicaoId: equipe.edicaoId || '',
      descricao: equipe.descricao || ''
    })
    setShowModal(true)
  }

  const handleDelete = async (id) => {
    if (confirm('Tem certeza que deseja excluir esta equipe?')) {
      try {
        setLoading(true)
        await equipesService.delete(id)
        await loadEquipes()
        alert('Equipe excluída com sucesso!')
      } catch (error) {
        console.error('Erro ao excluir equipe:', error)
        alert('Erro ao excluir equipe. Tente novamente.')
      } finally {
        setLoading(false)
      }
    }
  }

  const resetForm = () => {
    setFormData({ nome: '', mentorId: '', membrosIds: [], edicaoId: '', descricao: '' })
    setEditingEquipe(null)
    setShowModal(false)
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleMembrosChange = (e) => {
    const selected = Array.from(e.target.selectedOptions, opt => opt.value)
    setFormData(prev => ({ ...prev, membrosIds: selected }))
  }

  const getMentorNome = (id) => participantes.find(p => p.id === parseInt(id))?.nome || 'N/A'
  const getEdicaoNome = (id) => edicoes.find(e => e.id === parseInt(id))?.nome || 'N/A'
  const getMembrosNomes = (ids) => ids.map(id => participantes.find(p => p.id === parseInt(id))?.nome || '').join(', ')

  if (!active) return null

  return (
    <section className="section active">
      <div className="container">
        <div className="section-header">
          <h2>Gerenciamento de Equipes</h2>
          <button className="btn btn-primary" onClick={() => setShowModal(true)} disabled={loading}>
            <i className="fas fa-plus"></i> Nova Equipe
          </button>
        </div>

        {loading && <div className="loading-message"><i className="fas fa-spinner fa-spin"></i> Carregando...</div>}

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
              {equipes.length === 0 ? (
                <tr><td colSpan="5" className="no-data">Nenhuma equipe cadastrada.</td></tr>
              ) : (
                equipes.map(equipe => (
                  <tr key={equipe.id}>
                    <td>{equipe.nome}</td>
                    <td>{getMentorNome(equipe.mentorId)}</td>
                    <td>{getMembrosNomes(equipe.membros?.split(',') || [])}</td>
                    <td>{getEdicaoNome(equipe.edicaoId)}</td>
                    <td>
                      <button className="btn btn-sm btn-outline" onClick={() => handleEdit(equipe)}>Editar</button>
                      <button className="btn btn-sm btn-danger" onClick={() => handleDelete(equipe.id)}>Excluir</button>
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
                <h2>{editingEquipe ? 'Editar Equipe' : 'Nova Equipe'}</h2>
                <span className="close" onClick={resetForm}>&times;</span>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label>Nome da Equipe:</label>
                  <input name="nome" value={formData.nome} onChange={handleChange} required />
                </div>

                <div className="form-group">
                  <label>Mentor:</label>
                  <select name="mentorId" value={formData.mentorId} onChange={handleChange} required>
                    <option value="">Selecione um mentor...</option>
                    {mentores.map(m => <option key={m.id} value={m.id}>{m.nome}</option>)}
                  </select>
                </div>

                <div className="form-group">
                  <label>Membros (Alunos):</label>
                  <select multiple name="membrosIds" value={formData.membrosIds} onChange={handleMembrosChange} style={{ height: '150px' }}>
                    {alunos.map(a => <option key={a.id} value={a.id}>{a.nome}</option>)}
                  </select>
                </div>

                <div className="form-group">
                  <label>Edição:</label>
                  <select name="edicaoId" value={formData.edicaoId} onChange={handleChange} required>
                    <option value="">Selecione...</option>
                    {edicoes.map(e => <option key={e.id} value={e.id}>{e.nome}</option>)}
                  </select>
                </div>

                <div className="form-group">
                  <label>Descrição:</label>
                  <textarea name="descricao" rows="3" value={formData.descricao} onChange={handleChange}></textarea>
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

export default Equipes
