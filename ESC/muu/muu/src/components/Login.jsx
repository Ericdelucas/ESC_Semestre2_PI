import React, { useState } from 'react';
import './Auth.css'; // Estilo para login e cadastro

function Login({ onLogin, onNavigateToRegister }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Simulação de chamada de API para login
      // Em um cenário real, você faria uma requisição POST para o backend
      // const response = await api.post('/auth/login', { email, password });
      // onLogin(response.data.user);

      // Simulação de sucesso
      if (email === 'test@example.com' && password === 'password') {
        setTimeout(() => {
          onLogin({ email: email, name: 'Usuário Teste' });
          setLoading(false);
        }, 1000);
      } else {
        setTimeout(() => {
          setError('Credenciais inválidas. Tente novamente.');
          setLoading(false);
        }, 1000);
      }
    } catch (err) {
      setError('Erro ao fazer login. Verifique sua conexão ou tente novamente.');
      setLoading(false);
      console.error('Login error:', err);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Login</h2>
        <form onSubmit={handleSubmit}>
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
          {error && <p className="error-message">{error}</p>}
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>
        <p className="auth-switch-text">
          Não tem uma conta? <span onClick={onNavigateToRegister}>Cadastre-se</span>
        </p>
      </div>
    </div>
  );
}

export default Login;
