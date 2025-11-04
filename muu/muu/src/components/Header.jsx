import { useState } from 'react'

function Header({ user, onLogin, onLogout, onNavigate, currentSection }) {
  const [showMenu, setShowMenu] = useState(false)

  const handleProfileClick = () => {
    setShowMenu(!showMenu)
  }

  const handleLogoutClick = () => {
    setShowMenu(false)
    onLogout()
  }

  const handleNavigate = (section) => {
    setShowMenu(false)
    onNavigate(section)
  }

  return (
    <header className="header">
      <div className="container_header">
        <div className="logo">
          <i className="fas fa-heart"></i>
          <span>
            Lideranças<br />Empáticas
          </span>
        </div>

        {/* Navegação principal */}
        <nav className="nav">
          <ul id="navMenu">
            <li><a className={currentSection === 'dashboard' ? 'active' : ''} onClick={() => onNavigate('dashboard')}>Dashboard</a></li>
            <li><a className={currentSection === 'edicoes' ? 'active' : ''} onClick={() => onNavigate('edicoes')}>Edições</a></li>
            <li><a className={currentSection === 'participantes' ? 'active' : ''} onClick={() => onNavigate('participantes')}>Participantes</a></li>
            <li><a className={currentSection === 'equipes' ? 'active' : ''} onClick={() => onNavigate('equipes')}>Equipes</a></li>
            <li><a className={currentSection === 'atividades' ? 'active' : ''} onClick={() => onNavigate('atividades')}>Atividades</a></li>
            <li><a className={currentSection === 'relatorios' ? 'active' : ''} onClick={() => onNavigate('relatorios')}>Relatórios</a></li>
            <li><a className={currentSection === 'monitoramento' ? 'active' : ''} onClick={() => onNavigate('monitoramento')}>Monitoramento</a></li>
            <li><a className={currentSection === 'doacoes' ? 'active' : ''} onClick={() => onNavigate('doacoes')}>Doações</a></li>
            <li><a className={currentSection === 'metas' ? 'active' : ''} onClick={() => onNavigate('metas')}>Metas</a></li>
          </ul>
        </nav>

        {/* Ações do usuário */}
        <div className="user-actions">
          {user ? (
            <div className="user-menu">
              <button className="user-info" onClick={handleProfileClick}>
                {user.foto ? (
                  <img src={user.foto} alt="foto do usuário" className="user-avatar" />
                ) : (
                  <i className="fas fa-user-circle"></i>
                )}
                <span>{user.nome}</span>
              </button>

              {showMenu && (
                <div className="dropdown-menu">
                  <button onClick={() => handleNavigate('perfil')}>Editar Perfil</button>
                  <button onClick={handleLogoutClick}>Sair</button>
                </div>
              )}
            </div>
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
