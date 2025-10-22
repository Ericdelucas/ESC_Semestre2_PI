import { useState } from 'react'

function Edicoes({ active, edicoes, setEdicoes }) {
  const [showModal, setShowModal] = useState(false)
  const [editingEdicao, setEditingEdicao] = useState(null)
  const [formData, setFormData] = useState({
    nome: '',
    dataInicio: '',
    dataFim: '',
    descricao: ''
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (editingEdicao) {
      // Editar edição existente
      setEdicoes(edicoes.map(edicao => 
        edicao.id === editingEdicao.id 
          ? { ...formData, id: editingEdicao.id, status: getStatus(formData.dataInicio, formData.dataFim) }
          : edicao
      ))
    } else {
      // Criar nova edição
      const novaEdicao = {
        ...formData,
        id: Date.now(),
        status: getStatus(formData.dataInicio, formData.dataFim)
      }
      setEdicoes([...edicoes, novaEdicao])
    }
    
    resetForm()
  }

  const getStatus = (dataInicio, dataFim) => {
    const hoje = new Date()
    const inicio = new Date(dataInicio)
    const fim = new Date(dataFim)
    
    if (hoje < inicio) return 'Planejada'
    if (hoje > fim) return 'Finalizada'
    return 'Ativa'
  }

  const handleEdit = (edicao) => {
    setEditingEdicao(edicao)
    setFormData({
      nome: edicao.nome,
      dataInicio: edicao.dataInicio,
      dataFim: edicao.dataFim,
      descricao: edicao.descricao
    })
    setShowModal(true)
  }

  const handleDelete = (id) => {
    if (confirm('Tem certeza que deseja excluir esta edição?')) {
      setEdicoes(edicoes.filter(edicao => edicao.id !== id))
    }
  }

  const resetForm = () => {
    setFormData({ nome: '', dataInicio: '', dataFim: '', descricao: '' })
    setEditingEdicao(null)
    setShowModal(false)
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  return (
    <section className={`section ${active ? 'active' : ''}`}>
      <div className="container">
        <div className="section-header">
          <h2>Gerenciar Edições</h2>
          <button className="btn btn-primary" onClick={() => setShowModal(true)}>
            <i className="fas fa-plus"></i> Nova Edição
          </button>
        </div>
        
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Nome</th>
                <th>Data Início</th>
                <th>Data Fim</th>
                <th>Status</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {edicoes.map(edicao => (
                <tr key={edicao.id}>
                  <td>{edicao.nome}</td>
                  <td>{new Date(edicao.dataInicio).toLocaleDateString('pt-BR')}</td>
                  <td>{new Date(edicao.dataFim).toLocaleDateString('pt-BR')}</td>
                  <td>
                    <span className={`status ${edicao.status.toLowerCase()}`}>
                      {edicao.status}
                    </span>
                  </td>
                  <td className="actions">
                    <button 
                      className="btn btn-primary" 
                      onClick={() => handleEdit(edicao)}
                    >
                      Editar
                    </button>
                    <button 
                      className="btn btn-danger" 
                      onClick={() => handleDelete(edicao.id)}
                    >
                      Excluir
                    </button>
                  </td>
                </tr>
              ))}
              {edicoes.length === 0 && (
                <tr>
                  <td colSpan="5" style={{ textAlign: 'center', padding: '2rem' }}>
                    Nenhuma edição cadastrada
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
              <h2>{editingEdicao ? 'Editar Edição' : 'Nova Edição'}</h2>
              <span className="close" onClick={resetForm}>&times;</span>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="nome">Nome da Edição:</label>
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
                <label htmlFor="dataInicio">Data de Início:</label>
                <input 
                  type="date" 
                  id="dataInicio" 
                  name="dataInicio" 
                  value={formData.dataInicio}
                  onChange={handleChange}
                  required 
                />
              </div>
              <div className="form-group">
                <label htmlFor="dataFim">Data de Fim:</label>
                <input 
                  type="date" 
                  id="dataFim" 
                  name="dataFim" 
                  value={formData.dataFim}
                  onChange={handleChange}
                  required 
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
              <button type="submit" className="btn btn-primary">Salvar</button>
            </form>
          </div>
        </div>
      )}
    </section>
  )
}

export default Edicoes

