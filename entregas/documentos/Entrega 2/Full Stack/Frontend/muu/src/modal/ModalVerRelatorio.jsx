import React, { useState } from 'react'
import ReactDOM from 'react-dom'

function ModalRelatorioEquipe({ show, onClose, onSubmit, equipes = [] }) {
  const [formData, setFormData] = useState({
    nomeEquipe: '',
    resumo: '',
    resultados: '',
    quantidade: '',
    imagem: null,
  })

  if (!show) return null

  const handleChange = (e) => {
    const { name, value, files } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: files ? files[0] : value
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit(formData)
  }

  return ReactDOM.createPortal(
    <div className="modal active" style={{ zIndex: 4000 }}>
      <div className="modal-content" style={{ maxWidth: 600 }}>
        <div className="modal-header">
          <h2>Criar Relatório de Equipe</h2>
          <span className="close" onClick={onClose} style={{ cursor: 'pointer' }}>&times;</span>
        </div>

        <form onSubmit={handleSubmit} style={{ padding: '1.5rem' }}>
          {/* Nome da Equipe (select puxando do banco) */}
          <div className="form-group" style={{ marginBottom: '1rem' }}>
            <label>Equipe</label>
            <select
              name="nomeEquipe"
              value={formData.nomeEquipe}
              onChange={handleChange}
              required
            >
              <option value="">Selecione uma equipe</option>
              {equipes.map(eq => (
                <option key={eq.id} value={eq.nome}>{eq.nome}</option>
              ))}
            </select>
          </div>

          {/* Resumo */}
          <div className="form-group" style={{ marginBottom: '1rem' }}>
            <label>Resumo</label>
            <textarea
              name="resumo"
              value={formData.resumo}
              onChange={handleChange}
              placeholder="Descreva o resumo do relatório..."
              rows={3}
            ></textarea>
          </div>

          {/* Resultados */}
          <div className="form-group" style={{ marginBottom: '1rem' }}>
            <label>Resultados</label>
            <textarea
              name="resultados"
              value={formData.resultados}
              onChange={handleChange}
              placeholder="Descreva os resultados alcançados..."
              rows={3}
            ></textarea>
          </div>

          {/* Quantidade */}
          <div className="form-group" style={{ marginBottom: '1rem' }}>
            <label>Quantidade / Valor do Impacto</label>
            <input
              type="number"
              name="quantidade"
              value={formData.quantidade}
              onChange={handleChange}
              placeholder="Exemplo: 50 (kg), 200 (R$), 10 (ações)"
              min="0"
              step="any"
            />
          </div>

          {/* Imagem */}
          <div className="form-group" style={{ marginBottom: '1rem' }}>
            <label>Imagem (opcional)</label>
            <input type="file" name="imagem" accept="image/*" onChange={handleChange} />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
            <button type="button" className="btn btn-outline" onClick={onClose} style={{ marginRight: '1rem' }}>Cancelar</button>
            <button type="submit" className="btn btn-primary">Salvar Relatório</button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  )
}

export default ModalRelatorioEquipe
