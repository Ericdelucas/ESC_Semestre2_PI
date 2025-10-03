import React, { useState } from 'react';
import './Auth.css'; // Estilo para login e cadastro

function Register({ onRegister, onNavigateToLogin }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (password !== confirmPassword) {
      setError('As senhas não coincidem.');
      setLoading(false);
      return;
    }

    try {
      // Simulação de chamada de API para registro
      // Em um cenário real, você faria uma requisição POST para o backend
      // const response = await api.post('/auth/register', { name, email, password });
      // onRegister(response.data.user);

      // Simulação de sucesso
      setTimeout(() => {
        console.log('Usuário registrado:', { name, email });
        onRegister({ name, email });
        setLoading(false);
      }, 1000);
    } catch (err) {
      setError('Erro ao registrar. Tente novamente.');
      setLoading(false);
      console.error('Register error:', err);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Cadastro</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Nome Completo</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              disabled={loading}
            />
          </div>
          <div className="form-group">
            <label htmlFor="email">E-mail</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Senha</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
            />
          </div>
          <div className="form-group">
            <label htmlFor="confirmPassword">Confirmar Senha</label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              disabled={loading}
            />
          </div>
          {error && <p className="error-message">{error}</p>}
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Cadastrando...' : 'Cadastrar'}
          </button>
        </form>
        <p className="auth-switch-text">
          Já tem uma conta? <span onClick={onNavigateToLogin}>Faça Login</span>
        </p>
      </div>
    </div>
  );
}

export default Register;