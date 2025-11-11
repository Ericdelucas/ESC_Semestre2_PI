import { useState } from 'react'

function Registro({ show, onClose, onRegister, onShowLogin }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    tipo: ''
  })
  const [loading, setLoading] = useState(false)

  if (!show) return null

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!formData.name || !formData.email || !formData.password || !formData.tipo) {
      alert('Por favor, preencha todos os campos.')
      return
    }

    setLoading(true)
    try {
      const response = await fetch('http://localhost:3001/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      const data = await response.json()
      if (!response.ok) {
        throw new Error(data.error || 'Erro ao registrar usuário.')
      }

      alert('✅ Registro realizado com sucesso!')
      setFormData({ name: '', email: '', password: '', tipo: '' })
      if (onRegister) onRegister(data) // ✅ chamando a função correta
    } catch (error) {
      alert(`❌ ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="modal active">
      <div className="modal-content">
        <div className="modal-header">
          <h2>Registro</h2>
          <span className="close" onClick={onClose}>
            &times;
          </span>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Nome:</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
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
            <label htmlFor="password">Senha:</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="tipo">Tipo de Usuário:</label>
            <select
              id="tipo"
              name="tipo"
              value={formData.tipo}
              onChange={handleChange}
              required
            >
              <option value="">Selecione...</option>
              <option value="administrador">Administrador</option>
              <option value="professor">Professor</option>
              <option value="mentor">Mentor</option>
              <option value="aluno">Aluno</option>
            </select>
          </div>

          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Registrando...' : 'Registrar'}
          </button>
        </form>

        <div className="modal-footer" style={{ marginTop: '15px', textAlign: 'center' }}>
          <p>
            Já tem uma conta?{' '}
            <button
              type="button"
              onClick={onShowLogin}
              className="btn-link"
              style={{
                background: 'none',
                border: 'none',
                color: '#007bff',
                textDecoration: 'underline',
                cursor: 'pointer',
                fontSize: '1em'
              }}
            >
              Faça login
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Registro
