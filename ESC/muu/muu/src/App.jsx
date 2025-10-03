import { useState, useEffect } from 'react';
import Header from './components/Header';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import Edicoes from './components/Edicoes';
import Participantes from './components/Participantes';
import Equipes from './components/Equipes';
import Atividades from './components/Atividades';
import Relatorios from './components/Relatorios';
import Monitoramento from './components/Monitoramento';
import Doacoes from './components/Doacoes';
import Metas from './components/Metas';

import './App.css'; // Estilos globais
import './components/Auth.css'; // Estilos de autenticação

function App() {
  const [currentView, setCurrentView] = useState('login'); // 'login', 'register', 'dashboard', 'edicoes', etc.
  const [user, setUser] = useState(null);
  
  // Estados para dados do sistema
  const [edicoes, setEdicoes] = useState([]);
  const [participantes, setParticipantes] = useState([]);
  const [equipes, setEquipes] = useState([]);
  const [atividades, setAtividades] = useState([]);
  const [metas, setMetas] = useState([]);
  const [doacoes, setDoacoes] = useState([]);

  useEffect(() => {
    // Verifica se há um usuário logado no localStorage (simulação)
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
      setCurrentView('dashboard');
    }
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData)); // Salva o usuário no localStorage
    setCurrentView('dashboard');
  };

  const handleRegister = (userData) => {
    // Após o registro, pode-se logar o usuário ou redirecionar para a tela de login
    console.log('Usuário registrado:', userData);
    setCurrentView('login'); // Volta para a tela de login após o registro
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('user'); // Remove o usuário do localStorage
    setCurrentView('login');
  };

  const showSection = (section) => {
    setCurrentView(section);
  };

  return (
    <div className="App">
      {user ? (
        <Header 
          user={user}
          onLogout={handleLogout}
          onNavigate={showSection}
          currentSection={currentView}
        />
      ) : null}
      
      <main className="main">
        {currentView === 'login' && (
          <Login 
            onLogin={handleLogin}
            onNavigateToRegister={() => setCurrentView('register')}
          />
        )}

        {currentView === 'register' && (
          <Register 
            onRegister={handleRegister}
            onNavigateToLogin={() => setCurrentView('login')}
          />
        )}

        {user && currentView === 'dashboard' && (
          <Dashboard 
            active={true}
            edicoes={edicoes}
            participantes={participantes}
            equipes={equipes}
            atividades={atividades}
          />
        )}
        
        {user && currentView === 'edicoes' && (
          <Edicoes 
            active={true}
            edicoes={edicoes}
            onEdicoesChange={setEdicoes}
          />
        )}
        
        {user && currentView === 'participantes' && (
          <Participantes 
            active={true}
            participantes={participantes}
            setParticipantes={setParticipantes}
          />
        )}
        
        {user && currentView === 'equipes' && (
          <Equipes 
            active={true}
            equipes={equipes}
            setEquipes={setEquipes}
            participantes={participantes}
            edicoes={edicoes}
          />
        )}
        
        {user && currentView === 'atividades' && (
          <Atividades 
            active={true}
            atividades={atividades}
            setAtividades={setAtividades}
            equipes={equipes}
          />
        )}
        
        {user && currentView === 'relatorios' && (
          <Relatorios 
            active={true}
            edicoes={edicoes}
            participantes={participantes}
            equipes={equipes}
            atividades={atividades}
            metas={metas}
            doacoes={doacoes}
          />
        )}
        
        {user && currentView === 'monitoramento' && (
          <Monitoramento 
            active={true}
            edicoes={edicoes}
            participantes={participantes}
            equipes={equipes}
            atividades={atividades}
            metas={metas}
            doacoes={doacoes}
            onNavigate={setCurrentView}
          />
        )}
        
        {user && currentView === 'doacoes' && (
          <Doacoes 
            active={true}
            participantes={participantes}
            equipes={equipes}
            doacoes={doacoes}
            onDoacoesChange={setDoacoes}
          />
        )}
        
        {user && currentView === 'metas' && (
          <Metas 
            active={true}
            user={user}
            metas={metas}
            onMetasChange={setMetas}
          />
        )}
      </main>
    </div>
  );
}

export default App;
