import { useState } from 'react'

// 🔒 Controle de acesso por tipo de usuário (Copiado de App.jsx)
const ACCESS_MAP = {
  administrador: [
    'dashboard', 'edicoes', 'participantes', 'equipes', 'atividades',
    'relatorios', 'monitoramento', 'doacoes', 'metas', 'perfil', 'graficos'
  ],
  professor: [
    'dashboard', 'participantes', 'equipes', 'atividades',
    'relatorios', 'monitoramento', 'perfil', 'graficos'
  ],
  mentor: [
    'dashboard', 'participantes', 'equipes', 'atividades', 'perfil', 'relatorios'
  ],
  aluno: [
    'dashboard', 'doacoes', 'perfil', 'relatorios'
  ]
}

// Mapeamento de seção para texto de exibição
const SECTION_TITLES = {
  dashboard: 'Dashboard',
  edicoes: 'Edições',
  participantes: 'Participantes',
  equipes: 'Equipes',
  atividades: 'Atividades',
  relatorios: 'Relatórios',
  monitoramento: 'Monitoramento',
  doacoes: 'Doações',
  metas: 'Metas',
  perfil: 'Perfil',
  graficos: 'Gráficos'
}

function Header({ user, onLogin, onLogout, onNavigate, currentSection }) {
  // 🔐 Filtra as seções permitidas para o usuário logado
  const getSections = () => {
    if (!user) return []
    const allowedSections = ACCESS_MAP[user.tipo] || []
    return allowedSections.filter(section => section !== 'perfil') // Perfil é acessado pelo dropdown
  }
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
            {getSections().map(section => (
              <li key={section}>
                <a
                  className={currentSection === section ? 'active' : ''}
                  onClick={() => onNavigate(section)}
                >
                  {SECTION_TITLES[section]}
                </a>
              </li>
            ))}
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
