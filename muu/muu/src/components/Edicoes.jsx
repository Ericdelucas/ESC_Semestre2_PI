import { useState, useEffect } from 'react'
import { edicoesService } from '../services/api'




function Edicoes({ active, edicoes, onEdicoesChange }) {
  const [showModal, setShowModal] = useState(false)
  const [editingEdicao, setEditingEdicao] = useState(null)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    nome: '',
    dataInicio: '',
    dataFim: '',
    descricao: ''
  })

  // Carregar edições do backend ao montar o componente
  useEffect(() => {
    if (active) {
      loadEdicoes()
    }
  }, [active])

  const loadEdicoes = async () => {
    try {
      setLoading(true)
      const response = await edicoesService.getAll()
      if (onEdicoesChange) {
        onEdicoesChange(response.data.data)
      }
    } catch (error) {
      console.error('Erro ao carregar edições:', error)
      alert('Erro ao carregar edições. Verifique se o backend está rodando.')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    try {
      setLoading(true)
      
      if (editingEdicao) {
        // Editar edição existente
        await edicoesService.update(editingEdicao.id, formData)
      } else {
        // Criar nova edição
        await edicoesService.create(formData)
      }
      
      // Recarregar lista após operação
      await loadEdicoes()
      resetForm()
      alert(editingEdicao ? 'Edição atualizada com sucesso!' : 'Edição criada com sucesso!')
      
    } catch (error) {
      console.error('Erro ao salvar edição:', error)
      alert('Erro ao salvar edição. Tente novamente.')
    } finally {
      setLoading(false)
    }
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

  const handleDelete = async (id) => {
    if (confirm('Tem certeza que deseja excluir esta edição?')) {
      try {
        setLoading(true)
        await edicoesService.delete(id)
        await loadEdicoes()
        alert('Edição excluída com sucesso!')
      } catch (error) {
        console.error('Erro ao excluir edição:', error)
        alert('Erro ao excluir edição. Tente novamente.')
      } finally {
        setLoading(false)
      }
    }
  }

  const resetForm = () => {
    setFormData({
      nome: '',
      dataInicio: '',
      dataFim: '',
      descricao: ''
    })
    setEditingEdicao(null)
    setShowModal(false)
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const getStatus = (dataInicio, dataFim) => {
    const hoje = new Date()
    const inicio = new Date(dataInicio)
    const fim = new Date(dataFim)
    
    if (hoje < inicio) return 'Planejada'
    if (hoje > fim) return 'Finalizada'
    return 'Em Andamento'
  }

  const getStatusClass = (status) => {
    switch (status) {
      case 'Planejada': return 'status-planned'
      case 'Em Andamento': return 'status-active'
      case 'Finalizada': return 'status-finished'
      default: return ''
    }
  }

  if (!active) return null
  console.log('showModal:', showModal)
  return (
    <section className="section active">
      <div className="container">
        <div className="section-header">
          <h2>Gerenciamento de Edições</h2>
          <button 
            className="btn btn-primary" 
            onClick={() => setShowModal(true)}
            disabled={loading}
          >
            <i className="fas fa-plus"></i> Nova Edição
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
                <th>Data Início</th>
                <th>Data Fim</th>
                <th>Status</th>
                <th>Descrição</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {edicoes.length === 0 ? (
                <tr>
                  <td colSpan="6" className="no-data">
                    <i className="fas fa-info-circle"></i>
                    Nenhuma edição cadastrada. Clique em "Nova Edição" para começar.
                  </td>
                </tr>
              ) : (
                edicoes.map(edicao => (
                  <tr key={edicao.id}>
                    <td>{edicao.nome}</td>
                    <td>{new Date(edicao.dataInicio).toLocaleDateString('pt-BR')}</td>
                    <td>{new Date(edicao.dataFim).toLocaleDateString('pt-BR')}</td>
                    <td>
                      <span className={`status ${getStatusClass(edicao.status)}`}>
                        {edicao.status}
                      </span>
                    </td>
                    <td>{edicao.descricao}</td>
                    <td>
                      <div className="action-buttons">
                        <button 
                          className="btn btn-sm btn-outline"
                          onClick={() => handleEdit(edicao)}
                          disabled={loading}
                        >
                          <i className="fas fa-edit"></i>
                        </button>
                        <button 
                          className="btn btn-sm btn-danger"
                          onClick={() => handleDelete(edicao.id)}
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

        {/* Modal de Edição/Criação */}
        {showModal && (
          <div className="edicoes-modal-overlay">
            <div className="edicoes-modal" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h3>{editingEdicao ? 'Editar Edição' : 'Nova Edição'}</h3>
                <button className="modal-close" onClick={resetForm}>
                  <i className="fas fa-times"></i>
                </button>
              </div>
              
              <form onSubmit={handleSubmit} className="modal-body">
                <div className="form-group">
                  <label htmlFor="nome">Nome da Edição *</label>
                  <input
                    type="text"
                    id="nome"
                    name="nome"
                    value={formData.nome}
                    onChange={handleInputChange}
                    required
                    disabled={loading}
                  />
                </div>
                
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="dataInicio">Data de Início *</label>
                    <input
                      type="date"
                      id="dataInicio"
                      name="dataInicio"
                      value={formData.dataInicio}
                      onChange={handleInputChange}
                      required
                      disabled={loading}
                    />
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="dataFim">Data de Fim *</label>
                    <input
                      type="date"
                      id="dataFim"
                      name="dataFim"
                      value={formData.dataFim}
                      onChange={handleInputChange}
                      required
                      disabled={loading}
                    />
                  </div>
                </div>
                
                <div className="form-group">
                  <label htmlFor="descricao">Descrição</label>
                  <textarea
                    id="descricao"
                    name="descricao"
                    value={formData.descricao}
                    onChange={handleInputChange}
                    rows="3"
                    disabled={loading}
                  ></textarea>
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
                        <i className="fas fa-save"></i> {editingEdicao ? 'Atualizar' : 'Criar'}
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

export default Edicoes

// import { useState, useEffect } from 'react'
// import { edicoesService } from '../services/api'

// function Edicoes({ active, edicoes, onEdicoesChange }) {
//   const [showModal, setShowModal] = useState(false)
//   const [editingEdicao, setEditingEdicao] = useState(null)
//   const [loading, setLoading] = useState(false)
//   console.log("✅ Edicoes renderizou. Active =", active)
//   const [formData, setFormData] = useState({
//     nome: '',
//     dataInicio: '',
//     dataFim: '',
//     descricao: ''
//   })

//   // Carregar edições do backend ao montar o componente
//   useEffect(() => {
//     if (active) {
//       loadEdicoes()
//     }
//   }, [active])

//   const loadEdicoes = async () => {
//     try {
//       setLoading(true)
//       const response = await edicoesService.getAll()
//       if (onEdicoesChange) {
//         onEdicoesChange(response.data.data)
//       }
//     } catch (error) {
//       console.error('Erro ao carregar edições:', error)
//       alert('Erro ao carregar edições. Verifique se o backend está rodando.')
//     } finally {
//       setLoading(false)
//     }
//   }

//   const handleSubmit = async (e) => {
//     e.preventDefault()
//     try {
//       setLoading(true)
//       if (editingEdicao) {
//         await edicoesService.update(editingEdicao.id, formData)
//       } else {
//         await edicoesService.create(formData)
//       }

//       await loadEdicoes()
//       resetForm()
//       alert(editingEdicao ? 'Edição atualizada com sucesso!' : 'Edição criada com sucesso!')
//     } catch (error) {
//       console.error('Erro ao salvar edição:', error)
//       alert('Erro ao salvar edição. Tente novamente.')
//     } finally {
//       setLoading(false)
//     }
//   }

//   const handleEdit = (edicao) => {
//     setEditingEdicao(edicao)
//     setFormData({
//       nome: edicao.nome,
//       dataInicio: edicao.dataInicio,
//       dataFim: edicao.dataFim,
//       descricao: edicao.descricao
//     })
//     setShowModal(true)
//   }

//   const handleDelete = async (id) => {
//     if (confirm('Tem certeza que deseja excluir esta edição?')) {
//       try {
//         setLoading(true)
//         await edicoesService.delete(id)
//         await loadEdicoes()
//         alert('Edição excluída com sucesso!')
//       } catch (error) {
//         console.error('Erro ao excluir edição:', error)
//         alert('Erro ao excluir edição. Tente novamente.')
//       } finally {
//         setLoading(false)
//       }
//     }
//   }

//   const resetForm = () => {
//     setFormData({
//       nome: '',
//       dataInicio: '',
//       dataFim: '',
//       descricao: ''
//     })
//     setEditingEdicao(null)
//     setShowModal(false)
//   }

//   const handleInputChange = (e) => {
//     const { name, value } = e.target
//     setFormData(prev => ({
//       ...prev,
//       [name]: value
//     }))
//   }

//   const getStatus = (dataInicio, dataFim) => {
//     const hoje = new Date()
//     const inicio = new Date(dataInicio)
//     const fim = new Date(dataFim)

//     if (hoje < inicio) return 'Planejada'
//     if (hoje > fim) return 'Finalizada'
//     return 'Em Andamento'
//   }

//   const getStatusClass = (status) => {
//     switch (status) {
//       case 'Planejada': return 'status-planned'
//       case 'Em Andamento': return 'status-active'
//       case 'Finalizada': return 'status-finished'
//       default: return ''
//     }
//   }

//   if (!active) {
//     return (
//       <section className="section">
//         <div className="container">
//           <div className="section-header">
//             <h2>Gerenciamento de Edições</h2>
//             <p>Esta aba não está ativa.</p>
//           </div>
//         </div>
//       </section>
//     )
//   }
  

//   return (
//     <section className="section active">
//       <div className="container">
//         <div className="section-header">
//           <h1 style={{color: 'red'}}>TESTE EDIÇÕES</h1>
//           <button
//             className="btn btn-primary"
//             onClick={() => setShowModal(true)}
//             disabled={loading}
//           >
//             <i className="fas fa-plus"></i> Nova Edição
//           </button>
//         </div>

//         {loading && (
//           <div className="loading-message">
//             <i className="fas fa-spinner fa-spin"></i> Carregando...
//           </div>
//         )}

//         <div className="table-container">
//           <table className="data-table">
//             <thead>
//               <tr>
//                 <th>Nome</th>
//                 <th>Data Início</th>
//                 <th>Data Fim</th>
//                 <th>Status</th>
//                 <th>Descrição</th>
//                 <th>Ações</th>
//               </tr>
//             </thead>
//             <tbody>
//               {edicoes.length === 0 ? (
//                 <tr>
//                   <td colSpan="6" className="no-data">
//                     <i className="fas fa-info-circle"></i>
//                     Nenhuma edição cadastrada. Clique em "Nova Edição" para começar.
//                   </td>
//                 </tr>
//               ) : (
//                 edicoes.map(edicao => (
//                   <tr key={edicao.id}>
//                     <td>{edicao.nome}</td>
//                     <td>{new Date(edicao.dataInicio).toLocaleDateString('pt-BR')}</td>
//                     <td>{new Date(edicao.dataFim).toLocaleDateString('pt-BR')}</td>
//                     <td>
//                       <span className={`status ${getStatusClass(edicao.status)}`}>
//                         {edicao.status}
//                       </span>
//                     </td>
//                     <td>{edicao.descricao}</td>
//                     <td>
//                       <div className="action-buttons">
//                         <button
//                           className="btn btn-sm btn-outline"
//                           onClick={() => handleEdit(edicao)}
//                           disabled={loading}
//                         >
//                           <i className="fas fa-edit"></i>
//                         </button>
//                         <button
//                           className="btn btn-sm btn-danger"
//                           onClick={() => handleDelete(edicao.id)}
//                           disabled={loading}
//                         >
//                           <i className="fas fa-trash"></i>
//                         </button>
//                       </div>
//                     </td>
//                   </tr>
//                 ))
//               )}
//             </tbody>
//           </table>
//         </div>

//         {showModal && (
//           <div className="modal-overlay" onClick={() => setShowModal(false)}>
//             <div className="modal" onClick={(e) => e.stopPropagation()}>
//               <div className="modal-header">
//                 <h3>{editingEdicao ? 'Editar Edição' : 'Nova Edição'}</h3>
//                 <button className="modal-close" onClick={resetForm}>
//                   <i className="fas fa-times"></i>
//                 </button>
//               </div>

//               <form onSubmit={handleSubmit} className="modal-body">
//                 <div className="form-group">
//                   <label htmlFor="nome">Nome da Edição *</label>
//                   <input
//                     type="text"
//                     id="nome"
//                     name="nome"
//                     value={formData.nome}
//                     onChange={handleInputChange}
//                     required
//                     disabled={loading}
//                   />
//                 </div>

//                 <div className="form-row">
//                   <div className="form-group">
//                     <label htmlFor="dataInicio">Data de Início *</label>
//                     <input
//                       type="date"
//                       id="dataInicio"
//                       name="dataInicio"
//                       value={formData.dataInicio}
//                       onChange={handleInputChange}
//                       required
//                       disabled={loading}
//                     />
//                   </div>

//                   <div className="form-group">
//                     <label htmlFor="dataFim">Data de Fim *</label>
//                     <input
//                       type="date"
//                       id="dataFim"
//                       name="dataFim"
//                       value={formData.dataFim}
//                       onChange={handleInputChange}
//                       required
//                       disabled={loading}
//                     />
//                   </div>
//                 </div>

//                 <div className="form-group">
//                   <label htmlFor="descricao">Descrição</label>
//                   <textarea
//                     id="descricao"
//                     name="descricao"
//                     value={formData.descricao}
//                     onChange={handleInputChange}
//                     rows="3"
//                     disabled={loading}
//                   ></textarea>
//                 </div>

//                 <div className="modal-actions">
//                   <button
//                     type="button"
//                     className="btn btn-outline"
//                     onClick={resetForm}
//                     disabled={loading}
//                   >
//                     Cancelar
//                   </button>
//                   <button
//                     type="submit"
//                     className="btn btn-primary"
//                     disabled={loading}
//                   >
//                     {loading ? (
//                       <>
//                         <i className="fas fa-spinner fa-spin"></i> Salvando...
//                       </>
//                     ) : (
//                       <>
//                         <i className="fas fa-save"></i>{' '}
//                         {editingEdicao ? 'Atualizar' : 'Criar'}
//                       </>
//                     )}
//                   </button>
//                 </div>
//               </form>
//             </div>
//           </div>
//         )}
//       </div>
//     </section>
//   )
// }

// export default Edicoes
