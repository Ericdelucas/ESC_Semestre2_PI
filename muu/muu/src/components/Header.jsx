function Header({ user, onLogin, onLogout, onNavigate, currentSection }) {
  return (
    <header className="header">
      <div className="container_header">
        <div className="logo">
          <i className="fas fa-heart"></i>
          <span>Lideranças</span><span>Empáticas</span>
        </div>
        
        <nav className="nav">
          <ul id="navMenu">
            <li>
              <a 
                className={currentSection === 'dashboard' ? 'active' : ''}
                onClick={() => onNavigate('dashboard')}
              >
                Dashboard
              </a>
            </li>
            <li>
              <a 
                className={currentSection === 'edicoes' ? 'active' : ''}
                onClick={() => onNavigate('edicoes')}
              >
                Edições
              </a>
            </li>
            <li>
              <a 
                className={currentSection === 'participantes' ? 'active' : ''}
                onClick={() => onNavigate('participantes')}
              >
                Participantes
              </a>
            </li>
            <li>
              <a 
                className={currentSection === 'equipes' ? 'active' : ''}
                onClick={() => onNavigate('equipes')}
              >
                Equipes
              </a>
            </li>
            <li>
              <a 
                className={currentSection === 'atividades' ? 'active' : ''}
                onClick={() => onNavigate('atividades')}
              >
                Atividades
              </a>
            </li>
            <li>
              <a 
                className={currentSection === 'relatorios' ? 'active' : ''}
                onClick={() => onNavigate('relatorios')}
              >
                Relatórios
              </a>
            </li>
            <li>
              <a 
                className={currentSection === 'monitoramento' ? 'active' : ''}
                onClick={() => onNavigate('monitoramento')}
              >
                Monitoramento
              </a>
            </li>
            <li>
              <a 
                className={currentSection === 'doacoes' ? 'active' : ''}
                onClick={() => onNavigate('doacoes')}
              >
                Doações
              </a>
            </li>
            <li>
              <a 
                className={currentSection === 'metas' ? 'active' : ''}
                onClick={() => onNavigate('metas')}
              >
                Metas
              </a>
            </li>
            <li>
              <a 
                className={currentSection === 'welcome' ? 'active' : ''}
                onClick={() => onNavigate('welcome')}
              >
                Bem-vindo
              </a>
            </li>
          </ul>
        </nav>
        
        <div className="user-actions">
          {user ? (
            <>
              <span className="user-info">
                Olá, {user.nome} ({user.tipo})
              </span>
              <button className="btn btn-primary" onClick={onLogout}>
                Sair
              </button>
            </>
          ) : (
            <button className="btn btn-primary" onClick={onLogin}>
              Login
            </button>
          )}
        </div>
      </div>
    </header>
  )
}

export default Header

