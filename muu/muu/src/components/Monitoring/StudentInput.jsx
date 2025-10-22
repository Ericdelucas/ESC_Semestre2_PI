import { useState } from 'react'

function StudentInput({ onAddDonation, participantes = [], equipes = [], doacoes = [] }) {
  const [formData, setFormData] = useState({
    dataDoacao: new Date().toISOString().split('T')[0],
    alunoResponsavel: '',
    itemDoacao: '',
    campanha: '',
    doador: '',
    quantidade: '',
    pontuacao: 0
  })

  const [showModal, setShowModal] = useState(false)

  // Itens de doação com suas respectivas pontuações
  const itensDoacao = [
    { nome: 'Arroz', pontos: 1 },
    { nome: 'Feijão', pontos: 2 },
    { nome: 'Açúcar', pontos: 3 },
    { nome: 'Óleo', pontos: 4 },
    { nome: 'Macarrão', pontos: 5 },
    { nome: 'Fubá', pontos: 6 },
    { nome: 'Leite em pó', pontos: 7 },
    { nome: 'Item não listado', pontos: 8 },
    { nome: 'Dinheiro | Moeda', pontos: 9 }
  ]

  // Campanhas disponíveis
  const campanhas = [
    'Rifa - Camisa time...',
    'Caixa FECAP',
    'Campanha Natal',
    'Ação Solidária'
  ]

  // Tipos de doador
  const tiposDoador = [
    'Professor',
    'Aluno FECAP',
    'Funcionário',
    'Comunidade Externa'
  ]

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => {
      const newData = { ...prev, [name]: value }
      
      // Calcular pontuação automaticamente quando o item é selecionado
      if (name === 'itemDoacao') {
        const item = itensDoacao.find(item => item.nome === value)
        newData.pontuacao = item ? item.pontos * (parseFloat(newData.quantidade) || 1) : 0
      }
      
      // Recalcular pontuação quando a quantidade muda
      if (name === 'quantidade') {
        const item = itensDoacao.find(item => item.nome === newData.itemDoacao)
        newData.pontuacao = item ? item.pontos * (parseFloat(value) || 1) : 0
      }
      
      return newData
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (!formData.alunoResponsavel || !formData.itemDoacao || !formData.quantidade) {
      alert('Por favor, preencha todos os campos obrigatórios.')
      return
    }

    const novaDonacao = {
      id: Date.now(),
      ...formData,
      quantidade: parseFloat(formData.quantidade),
      dataRegistro: new Date().toISOString()
    }

    if (onAddDonation) {
      onAddDonation(novaDonacao)
    }

    // Limpar formulário
    setFormData({
      dataDoacao: new Date().toISOString().split('T')[0],
      alunoResponsavel: '',
      itemDoacao: '',
      campanha: '',
      doador: '',
      quantidade: '',
      pontuacao: 0
    })

    setShowModal(false)
    alert('Doação registrada com sucesso!')
  }

  return (
    <div className="student-input-container">
      <div className="input-header">
        <h3>
          <i className="fas fa-hand-holding-heart"></i>
          Registro de Doações
        </h3>
        <button 
          className="btn btn-primary"
          onClick={() => setShowModal(true)}
        >
          <i className="fas fa-plus"></i>
          Nova Doação
        </button>
      </div>

      {/* Tabela de Doações Recentes */}
      <div className="donations-table">
        <h4>Doações Registradas Recentemente</h4>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Data da Doação</th>
                <th>Aluno Responsável</th>
                <th>Item de Doação</th>
                <th>Campanha</th>
                <th>Doador</th>
                <th>Quantidade</th>
                <th>Pontuação</th>
              </tr>
            </thead>
            <tbody>
              {doacoes.length === 0 ? (
                <tr>
                  <td colSpan="7" style={{textAlign: 'center', padding: '20px', color: '#666'}}>
                    <i className="fas fa-info-circle"></i>
                    <br />
                    Nenhuma doação registrada ainda. Registre a primeira doação!
                  </td>
                </tr>
              ) : (
                doacoes.slice(0, 10).map((doacao, index) => (
                  <tr key={index}>
                    <td>{new Date(doacao.dataDoacao).toLocaleDateString('pt-BR')}</td>
                    <td>{doacao.alunoResponsavel || '-'}</td>
                    <td>{doacao.itemDoacao}</td>
                    <td>{doacao.campanha}</td>
                    <td>{doacao.doador}</td>
                    <td>{doacao.quantidade}</td>
                    <td>{doacao.pontuacao}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal de Registro */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal donation-modal">
            <div className="modal-header">
              <h3>Registrar Nova Doação</h3>
              <button 
                className="modal-close"
                onClick={() => setShowModal(false)}
              >
                <i className="fas fa-times"></i>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="donation-form">
              <div className="form-row">
                <div className="form-group">
                  <label>Data da Doação *</label>
                  <input
                    type="date"
                    name="dataDoacao"
                    value={formData.dataDoacao}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Aluno Responsável *</label>
                  <select
                    name="alunoResponsavel"
                    value={formData.alunoResponsavel}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Selecione o aluno</option>
                    <option value="Thiago Castro">Thiago Castro</option>
                    <option value="Laura Nicolleti">Laura Nicolleti</option>
                    <option value="Pedro Azevedo Bastos">Pedro Azevedo Bastos</option>
                    <option value="Maria Silva">Maria Silva</option>
                    <option value="João Santos">João Santos</option>
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Item de Doação *</label>
                  <select
                    name="itemDoacao"
                    value={formData.itemDoacao}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Selecione o item</option>
                    {itensDoacao.map(item => (
                      <option key={item.nome} value={item.nome}>
                        {item.nome} ({item.pontos} pts)
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>Campanha</label>
                  <select
                    name="campanha"
                    value={formData.campanha}
                    onChange={handleInputChange}
                  >
                    <option value="">Selecione a campanha</option>
                    {campanhas.map(campanha => (
                      <option key={campanha} value={campanha}>
                        {campanha}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Tipo de Doador</label>
                  <select
                    name="doador"
                    value={formData.doador}
                    onChange={handleInputChange}
                  >
                    <option value="">Selecione o tipo</option>
                    {tiposDoador.map(tipo => (
                      <option key={tipo} value={tipo}>
                        {tipo}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>Quantidade *</label>
                  <input
                    type="number"
                    name="quantidade"
                    value={formData.quantidade}
                    onChange={handleInputChange}
                    placeholder="Ex: 10.00"
                    step="0.01"
                    min="0"
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Pontuação Calculada</label>
                <div className="pontuacao-display">
                  <i className="fas fa-star"></i>
                  <span>{formData.pontuacao} pontos</span>
                </div>
              </div>

              <div className="form-actions">
                <button 
                  type="button" 
                  className="btn btn-secondary"
                  onClick={() => setShowModal(false)}
                >
                  Cancelar
                </button>
                <button type="submit" className="btn btn-primary">
                  <i className="fas fa-save"></i>
                  Registrar Doação
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default StudentInput

