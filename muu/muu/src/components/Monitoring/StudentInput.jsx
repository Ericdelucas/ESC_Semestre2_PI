import { useState, useEffect } from 'react'

function StudentInput({ onAddDonation, participantes = [], equipes = [], doacoes = [] }) {
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
  const [edicoes, setEdicoes] = useState([])

  // 🧠 Carregar alunos e edições do backend
  useEffect(() => {
    const carregarDados = async () => {
      try {
        const [alunosRes, edicoesRes] = await Promise.all([
          fetch('http://localhost:3001/api/participantes'),
          fetch('http://localhost:3001/api/edicoes')
        ])

        const alunosData = await alunosRes.json()
        const edicoesData = await edicoesRes.json()

        if (alunosData.data && Array.isArray(alunosData.data)) {
          const apenasAlunos = alunosData.data.filter(
            (p) => p.tipo?.toLowerCase() === 'aluno'
          )
          setAlunos(apenasAlunos)
        }

        if (edicoesData.data && Array.isArray(edicoesData.data)) {
          setEdicoes(edicoesData.data)
        }
      } catch (error) {
        console.error('Erro ao carregar alunos/edições:', error)
      }
    }

    carregarDados()
  }, [])

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

  const campanhas = ['Rifa - Camisa time...', 'Caixa FECAP', 'Campanha Natal', 'Ação Solidária']
  const tiposDoador = ['Professor', 'Aluno FECAP', 'Funcionário', 'Comunidade Externa']

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => {
      const newData = { ...prev, [name]: value }
      const item = itensDoacao.find((i) => i.nome === newData.itemDoacao)
      const pontosBase = item ? item.pontos : 0
      const quantidadeNum = parseFloat(newData.quantidade) || 0
      newData.pontuacao = pontosBase * quantidadeNum
      return newData
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!formData.alunoResponsavel || !formData.itemDoacao || !formData.quantidade || !formData.edicao) {
      alert('⚠️ Por favor, preencha todos os campos obrigatórios.')
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
        <h3><i className="fas fa-hand-holding-heart"></i> Registro de Doações</h3>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
          <i className="fas fa-plus"></i> Nova Doação
        </button>
      </div>

      <div className="donations-table">
        <h4>Doações Recentes</h4>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Data</th>
                <th>Aluno</th>
                <th>Item</th>
                <th>Campanha</th>
                <th>Doador</th>
                <th>Qtd</th>
                <th>Pontos</th>
              </tr>
            </thead>
            <tbody>
              {doacoes.length === 0 ? (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', color: '#666', padding: '16px' }}>
                    <i className="fas fa-info-circle"></i> Nenhuma doação registrada ainda.
                  </td>
                </tr>
              ) : (
                doacoes.slice(0, 10).map((d, i) => (
                  <tr key={i}>
                    <td>{new Date(d.dataDoacao).toLocaleDateString('pt-BR')}</td>
                    <td>{d.alunoResponsavel}</td>
                    <td>{d.itemDoacao}</td>
                    <td>{d.campanha}</td>
                    <td>{d.doador}</td>
                    <td>{d.quantidade}</td>
                    <td>{d.pontuacao}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="modal active">
          <div className="modal-content">
            <div className="modal-header">
              <h2>Nova Doação</h2>
              <span className="close" onClick={() => setShowModal(false)}>&times;</span>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Data *</label>
                <input type="date" name="dataDoacao" value={formData.dataDoacao} onChange={handleInputChange} required />
              </div>

              <div className="form-group">
                <label>Aluno *</label>
                <select name="alunoResponsavel" value={formData.alunoResponsavel} onChange={handleInputChange} required>
                  <option value="">Selecione o aluno</option>
                  {alunos.map(a => <option key={a.id} value={a.nome}>{a.nome}</option>)}
                </select>
              </div>

              <div className="form-group">
                <label>Edição *</label>
                <select name="edicao" value={formData.edicao} onChange={handleInputChange} required>
                  <option value="">Selecione a edição</option>
                  {edicoes.map(e => <option key={e.id} value={e.nome}>{e.nome}</option>)}
                </select>
              </div>

              <div className="form-group">
                <label>Item *</label>
                <select name="itemDoacao" value={formData.itemDoacao} onChange={handleInputChange} required>
                  <option value="">Selecione</option>
                  {itensDoacao.map(i => <option key={i.nome} value={i.nome}>{i.nome} ({i.pontos} pts)</option>)}
                </select>
              </div>

              <div className="form-group">
                <label>Quantidade *</label>
                <input type="number" name="quantidade" value={formData.quantidade} onChange={handleInputChange} step="0.01" required />
              </div>

              <div className="form-group">
                <label>Pontuação Calculada</label>
                <div className="pontuacao-display"><i className="fas fa-star"></i> {formData.pontuacao} pontos</div>
              </div>

              <div className="form-actions">
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancelar</button>
                <button type="submit" className="btn btn-primary"><i className="fas fa-save"></i> Salvar</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default StudentInput
