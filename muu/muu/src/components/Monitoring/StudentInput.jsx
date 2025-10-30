import { useState, useEffect } from 'react'

function StudentInput({ onAddDonation, participantes = [], equipes = [], doacoes = [], edicoes = [] }) {
  const [formData, setFormData] = useState({
    dataDoacao: new Date().toISOString().split('T')[0],
    alunoResponsavel: '',
    itemDoacao: '',
    campanha: '',
    doador: '',
    quantidade: '',
    pontuacao: 0,
    edicao: ''
  })

  const [showModal, setShowModal] = useState(false)
  const [alunos, setAlunos] = useState([])

  // 🧠 Carregar alunos do backend
  useEffect(() => {
    const carregarAlunos = async () => {
      try {
        const response = await fetch('http://localhost:3001/api/participantes')
        const data = await response.json()

        if (data.data && Array.isArray(data.data)) {
          const apenasAlunos = data.data.filter(
            (p) => p.tipo?.toLowerCase() === 'aluno'
          )
          setAlunos(apenasAlunos)
        }
      } catch (error) {
        console.error('Erro ao carregar alunos:', error)
      }
    }

    carregarAlunos()
  }, [])

  // Itens de doação
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

  const campanhas = [
    'Rifa - Camisa time...',
    'Caixa FECAP',
    'Campanha Natal',
    'Ação Solidária'
  ]

  const tiposDoador = [
    'Professor',
    'Aluno FECAP',
    'Funcionário',
    'Comunidade Externa'
  ]

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => {
      const newData = { ...prev, [name]: value }

      // Calcular pontuação automaticamente
      if (name === 'itemDoacao') {
        const item = itensDoacao.find((item) => item.nome === value)
        newData.pontuacao = item ? item.pontos * (parseFloat(newData.quantidade) || 1) : 0
      }

      if (name === 'quantidade') {
        const item = itensDoacao.find((item) => item.nome === newData.itemDoacao)
        newData.pontuacao = item ? item.pontos * (parseFloat(value) || 1) : 0
      }

      return newData
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!formData.alunoResponsavel || !formData.itemDoacao || !formData.quantidade || !formData.edicao) {
      alert('Por favor, preencha todos os campos obrigatórios.')
      return
    }

    try {
      const response = await fetch('http://localhost:3001/api/doacoes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      if (!response.ok) throw new Error('Erro ao registrar doação.')

      const data = await response.json()
      if (onAddDonation) onAddDonation(data.data || formData)

      setFormData({
        dataDoacao: new Date().toISOString().split('T')[0],
        alunoResponsavel: '',
        itemDoacao: '',
        campanha: '',
        doador: '',
        quantidade: '',
        pontuacao: 0,
        edicao: ''
      })

      setShowModal(false)
      alert('✅ Doação registrada com sucesso!')
    } catch (error) {
      console.error('Erro ao registrar doação:', error)
      alert('❌ Ocorreu um erro ao salvar a doação.')
    }
  }

  return (
    <div className="student-input-container">
      <div className="input-header">
        <h3>
          <i className="fas fa-hand-holding-heart"></i> Registro de Doações
        </h3>
        {!showModal && (
          <button className="btn btn-primary" onClick={() => setShowModal(true)}>
            <i className="fas fa-plus"></i> Nova Doação
          </button>
        )}
      </div>

      {/* 🧾 Tabela de Doações */}
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
                  <td colSpan="7" style={{ textAlign: 'center', padding: '20px', color: '#666' }}>
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

      {/* 🪟 Modal de Nova Doação */}
      {showModal && (
        <div className="modal active">
          <div className="modal-content">
            <div className="modal-header">
              <h2>Nova Doação</h2>
              <span className="close" onClick={() => setShowModal(false)}>&times;</span>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Data da Doação *</label>
                <input type="date" name="dataDoacao" value={formData.dataDoacao} onChange={handleInputChange} required />
              </div>

              <div className="form-group">
                <label>Aluno Responsável *</label>
                <select name="alunoResponsavel" value={formData.alunoResponsavel} onChange={handleInputChange} required>
                  <option value="">Selecione o aluno</option>
                  {alunos.length > 0 ? (
                    alunos.map((aluno) => (
                      <option key={aluno.id} value={aluno.nome}>
                        {aluno.nome}
                      </option>
                    ))
                  ) : (
                    <option disabled>⚠ Nenhum aluno encontrado</option>
                  )}
                </select>
              </div>

              <div className="form-group">
                <label>Edição Relacionada *</label>
                <select name="edicao" value={formData.edicao} onChange={handleInputChange} required>
                  <option value="">Selecione a Edição</option>
                  {edicoes.map((edicao) => (
                    <option key={edicao.id} value={edicao.nome}>
                      {edicao.nome}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Item de Doação *</label>
                <select name="itemDoacao" value={formData.itemDoacao} onChange={handleInputChange} required>
                  <option value="">Selecione o item</option>
                  {itensDoacao.map((item) => (
                    <option key={item.nome} value={item.nome}>
                      {item.nome} ({item.pontos} pts)
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Campanha</label>
                <select name="campanha" value={formData.campanha} onChange={handleInputChange}>
                  <option value="">Selecione a campanha</option>
                  {campanhas.map((campanha) => (
                    <option key={campanha} value={campanha}>
                      {campanha}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Tipo de Doador</label>
                <select name="doador" value={formData.doador} onChange={handleInputChange}>
                  <option value="">Selecione o tipo</option>
                  {tiposDoador.map((tipo) => (
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

              <div className="form-group">
                <label>Pontuação Calculada</label>
                <div className="pontuacao-display">
                  <i className="fas fa-star"></i> <span>{formData.pontuacao} pontos</span>
                </div>
              </div>

              <div className="form-actions">
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>
                  Cancelar
                </button>
                <button type="submit" className="btn btn-primary">
                  <i className="fas fa-save"></i> Registrar Doação
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
