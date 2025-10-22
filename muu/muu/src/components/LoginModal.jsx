import { useState } from 'react'

function LoginModal({ show, onClose, onLogin }) {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    userType: ''
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    
    // Simulação de login - em um app real, aqui faria a validação no backend
    if (formData.email && formData.password && formData.userType) {
      const userData = {
        nome: formData.email.split('@')[0], // Usa parte do email como nome
        email: formData.email,
        tipo: formData.userType
      }
      onLogin(userData)
      setFormData({ email: '', password: '', userType: '' })
    } else {
      alert('Por favor, preencha todos os campos')
    }
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  if (!show) return null

  return (
    <div className="modal active">
      <div className="modal-content">
        <div className="modal-header">
          <h2>Login</h2>
          <span className="close" onClick={onClose}>&times;</span>
        </div>
        <form onSubmit={handleSubmit}>
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
            <label htmlFor="userType">Tipo de Usuário:</label>
            <select 
              id="userType" 
              name="userType" 
              value={formData.userType}
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
          <button type="submit" className="btn btn-primary">Entrar</button>
        </form>
      </div>
    </div>
  )
}

export default LoginModal

