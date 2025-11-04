import { useState } from 'react'

function LoginModal({ show, onClose, onLogin, onShowRegister }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  if (!show) return null

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!email || !password) {
      alert('Por favor, preencha todos os campos.')
      return
    }

    setLoading(true)
    try {
      const response = await fetch('http://localhost:3001/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      })

      const data = await response.json()
      if (!response.ok) {
        throw new Error(data.error || 'Credenciais inválidas.')
      }

      alert('✅ Login realizado com sucesso!')
      setEmail('')
      setPassword('')
      onLogin(data) // Envia os dados do usuário para o App
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
          <h2>Login</h2>
          <span className="close" onClick={onClose}>
            &times;
          </span>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Senha:</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>

        <div className="modal-footer" style={{ marginTop: '15px', textAlign: 'center' }}>
          <p>
            Ainda não tem conta?{' '}
            <button
              type="button"
              onClick={onShowRegister}
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
              Registre-se
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}

export default LoginModal
