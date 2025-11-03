import { useState } from 'react'

function Atividades({ active, atividades, setAtividades, equipes }) {
  const [showModal, setShowModal] = useState(false)
  const [editingAtividade, setEditingAtividade] = useState(null)
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

  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (editingAtividade) {
      // Editar atividade existente
      setAtividades(atividades.map(atividade => 
        atividade.id === editingAtividade.id 
          ? { ...formData, id: editingAtividade.id }
          : atividade
      ))
    } else {
      // Criar nova atividade
      const novaAtividade = {
        ...formData,
        id: Date.now()
      }
      setAtividades([...atividades, novaAtividade])
    }
    
    resetForm()
  }

  const handleEdit = (atividade) => {
    setEditingAtividade(atividade)
    setFormData({
      nome: atividade.nome,
      tipo: atividade.tipo,
      equipeId: atividade.equipeId,
      dataInicio: atividade.dataInicio,
      dataFim: atividade.dataFim,
      meta: atividade.meta,
      arrecadado: atividade.arrecadado,
      descricao: atividade.descricao
    })
    setShowModal(true)
  }

  const handleDelete = (id) => {
    if (confirm('Tem certeza que deseja excluir esta atividade?')) {
      setAtividades(atividades.filter(atividade => atividade.id !== id))
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
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
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

  // Função para calcular o total arrecadado (pontuação) para uma atividade
  const calculateArrecadado = (atividade) => {
    // Filtra as doações que correspondem à equipe e à edição da atividade
    const doacoesFiltradas = doacoes.filter(doacao => {
      const equipeDoacao = equipes.find(e => e.nome === doacao.equipe)
      const equipeAtividade = equipes.find(e => e.id === parseInt(atividade.equipeId))

      // Verifica se a doação está dentro do período da atividade (opcional, mas bom para precisão)
      const dataDoacao = new Date(doacao.dataDoacao)
      const dataInicio = new Date(atividade.dataInicio)
      const dataFim = new Date(atividade.dataFim)

      const isDataValid = dataDoacao >= dataInicio && dataDoacao <= dataFim
      
      // Verifica se a doação está associada à mesma Edição e Equipe
      const isEquipeMatch = equipeDoacao && equipeAtividade && equipeDoacao.id === equipeAtividade.id
      const isEdicaoMatch = doacao.edicao === atividade.nome // Assumindo que o nome da atividade é a Edição, o que pode ser um erro de modelagem, mas vamos usar a Edição da doação. Vou assumir que o nome da atividade é o nome da Edição.

      // A doação deve ser associada à Edição (doação.edicao) e à Equipe (doacao.equipe)
      // Como a atividade não tem campo 'edicao', vamos assumir que a atividade está ligada
      // à Edição que foi selecionada na doação. Isso é um pouco confuso.
      // Vou usar a lógica mais simples: a pontuação total das doações que pertencem à Edição selecionada.
      // Se a atividade for do tipo 'Arrecadação de Alimentos', por exemplo,
      // ela deve somar a pontuação de todas as doações de alimentos.

      // **Melhor Abordagem (Baseado no seu modelo):**
      // 1. A doação está ligada a uma **Edição** (campo `edicao` na doação).
      // 2. A atividade está ligada a uma **Equipe** (campo `equipeId` na atividade).
      // 3. A atividade tem um **Tipo** (ex: 'Arrecadação de Alimentos').

      // Vamos assumir que as doações contribuem para a **Atividade** se:
      // a) A doação foi feita para a mesma **Edição** (doacao.edicao == Edicao da Atividade) - **PROBLEMA: Atividade não tem Edição**
      // b) A doação está ligada à **Equipe** da Atividade.
      // c) O **Tipo** da doação (implícito no item) corresponde ao **Tipo** da Atividade.

      // **Simplificação:** A doação está ligada a uma **Edição** e a pontuação total de todas as doações
      // para aquela **Edição** é o `arrecadado` da atividade.
      // Isso não faz sentido. A atividade é por equipe.

      // **ASSUMINDO O MODELO MAIS PROVÁVEL:**
      // A doação contribui para o progresso da **Atividade** se:
      // 1. A doação pertence à **Edição** que a atividade está relacionada (vamos assumir que a atividade está relacionada à Edição do seu nome, ou a todas as edições).
      // 2. A doação pertence à **Equipe** da atividade.
      // 3. O **Tipo** da doação (implícito no item) é relevante para o **Tipo** da Atividade.

      // Para simplificar e resolver o problema do usuário:
      // **A pontuação total de todas as doações (doacoes.pontuacao) que pertencem à Edição selecionada (doacao.edicao) será o valor `arrecadado` da Atividade.**
      // **E a Atividade deve ter o mesmo nome da Edição.** (Isso é uma simplificação forte, mas a única maneira de ligar as duas coisas com o modelo atual).

      // **Nova Lógica:** A doação contribui para a Atividade se o nome da Edição da doação for igual ao nome da Atividade.
      return doacao.edicao === atividade.nome
    })

    return doacoesFiltradas.reduce((total, doacao) => total + doacao.pontuacao, 0)
  }
  
  const getProgressPercentage = (arrecadado, meta) => {
    if (!meta || meta === 0) return 0
    return Math.min((arrecadado / meta) * 100, 100)
  }

  return (
    <section className={`section ${active ? 'active' : ''}`}>
      <div className="container">
        <div className="section-header">
          <h2>Gerenciar Atividades</h2>
          <button className="btn btn-primary" onClick={() => setShowModal(true)}>
            <i className="fas fa-plus"></i> Nova Atividade
          </button>
        </div>
        
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Nome</th>
                <th>Tipo</th>
                <th>Equipe</th>
                <th>Data Início</th>
                <th>Data Fim</th>
                <th>Meta</th>
                <th>Arrecadado</th>
                <th>Progresso</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {atividades.map(atividade => (
                <tr key={atividade.id}>
                  <td>{atividade.nome}</td>
                  <td>{atividade.tipo}</td>
                  <td>{getEquipeNome(atividade.equipeId)}</td>
                  <td>{new Date(atividade.dataInicio).toLocaleDateString('pt-BR')}</td>
                  <td>{new Date(atividade.dataFim).toLocaleDateString('pt-BR')}</td>
                  <td>{formatCurrency(atividade.meta)}</td>
                  <td>{formatCurrency(atividade.arrecadado)}</td>
                  <td>
                    <div style={{ 
                      width: '100px', 
                      height: '10px', 
                      backgroundColor: '#eee', 
                      borderRadius: '5px',
                      overflow: 'hidden'
                    }}>
                      <div style={{
                        width: `${getProgressPercentage(atividade.arrecadado, atividade.meta)}%`,
                        height: '100%',
                        backgroundColor: '#28a745',
                        transition: 'width 0.3s ease'
                      }}></div>
                    </div>
                    <small>{getProgressPercentage(atividade.arrecadado, atividade.meta).toFixed(1)}%</small>
                  </td>
                  <td className="actions">
                    <button 
                      className="btn btn-primary" 
                      onClick={() => handleEdit(atividade)}
                    >
                      Editar
                    </button>
                    <button 
                      className="btn btn-danger" 
                      onClick={() => handleDelete(atividade.id)}
                    >
                      Excluir
                    </button>
                  </td>
                </tr>
              ))}
              {atividades.length === 0 && (
                <tr>
                  <td colSpan="9" style={{ textAlign: 'center', padding: '2rem' }}>
                    Nenhuma atividade cadastrada
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
                    <option key={tipo} value={tipo}>
                      {tipo}
                    </option>
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
                    <option key={equipe.id} value={equipe.id}>
                      {equipe.nome}
                    </option>
                  ))}
                </select>
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
              <button type="submit" className="btn btn-primary">Salvar</button>
            </form>
          </div>
        </div>
      )}
    </section>
  )
}

export default Atividades

