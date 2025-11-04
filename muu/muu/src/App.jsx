import { useState, useEffect } from 'react'
import axios from 'axios'
import Header from './components/Header'
import LoginModal from './components/LoginModal'
import Registro from './components/Registro'
import Welcome from './components/Welcome'
import Dashboard from './components/Dashboard'
import Edicoes from './components/Edicoes'
import Participantes from './components/Participantes'
import Equipes from './components/Equipes'
import Atividades from './components/Atividades'
import Relatorios from './components/Relatorios'
import Monitoramento from './components/Monitoramento'
import Doacoes from './components/Doacoes'
import Metas from './components/Metas'
import Perfil from './components/Perfil'

// controle de acesso por papel
const ACCESS_MAP = {
  administrador: [
    'dashboard', 'edicoes', 'participantes', 'equipes', 'atividades',
    'relatorios', 'monitoramento', 'doacoes', 'metas', 'perfil'
  ],
  professor: [
    'dashboard', 'participantes', 'equipes', 'atividades',
    'relatorios', 'monitoramento', 'perfil'
  ],
  mentor: [
    'dashboard', 'participantes', 'equipes', 'atividades', 'perfil'
  ],
  aluno: [
    'dashboard', 'doacoes', 'perfil'
  ]
}

function App() {
  const [currentSection, setCurrentSection] = useState('welcome')
  const [user, setUser] = useState(null)
  const [showLoginModal, setShowLoginModal] = useState(false)
  const [showRegister, setShowRegister] = useState(false)

  // Dados do sistema
  const [edicoes, setEdicoes] = useState([])
  const [participantes, setParticipantes] = useState([])
  const [equipes, setEquipes] = useState([])
  const [atividades, setAtividades] = useState([])
  const [metas, setMetas] = useState([])
  const [doacoes, setDoacoes] = useState([])

  // 🧩 Persistência de login: ao carregar o app, tenta validar o token
  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) return

    const fetchUser = async () => {
      try {
        const res = await axios.get('http://localhost:3001/api/auth/me', {
          headers: { Authorization: `Bearer ${token}` }
        })
        setUser(res.data.user)
        setCurrentSection('dashboard') // entra direto se token válido
      } catch (err) {
        console.error('Token inválido ou expirado:', err)
        localStorage.removeItem('token')
      }
    }

    fetchUser()
  }, [])

  // LOGIN
  const handleLogin = (data) => {
    const { user, token } = data
    setUser(user)
    localStorage.setItem('token', token)
    setShowLoginModal(false)
    setShowRegister(false)
    setCurrentSection('dashboard')
  }

  // LOGOUT
  const handleLogout = () => {
    setUser(null)
    localStorage.removeItem('token')
    setCurrentSection('welcome')
  }

  // Atualiza perfil (nome/foto)
  const handleUserUpdate = (newUser) => {
    setUser(newUser)
  }

  // Deleta conta
  const handleDeleteAccount = () => {
    alert('Sua conta foi excluída.')
    handleLogout()
  }

  const showSection = (section) => setCurrentSection(section)

  // Se o usuário não tiver permissão para acessar uma seção, volta ao dashboard
  useEffect(() => {
    if (user && ACCESS_MAP[user.role]) {
      if (!ACCESS_MAP[user.role].includes(currentSection)) {
        setCurrentSection('dashboard')
      }
    }
  }, [user, currentSection])

  return (
    <div className="App">
      <Header
        user={user}
        onLogin={() => setShowLoginModal(true)}
        onLogout={handleLogout}
        onNavigate={showSection}
        currentSection={currentSection}
      />

      <main className="main">
        <Welcome
          active={currentSection === 'welcome'}
          onLogin={() => setShowLoginModal(true)}
        />

        <Dashboard
          active={currentSection === 'dashboard'}
          edicoes={edicoes}
          participantes={participantes}
          equipes={equipes}
          atividades={atividades}
        />

        <Edicoes
          active={currentSection === 'edicoes'}
          edicoes={edicoes}
          onEdicoesChange={setEdicoes}
        />

        <Participantes
          active={currentSection === 'participantes'}
          participantes={participantes}
          setParticipantes={setParticipantes}
        />

        <Equipes
          active={currentSection === 'equipes'}
          equipes={equipes}
          setEquipes={setEquipes}
          participantes={participantes}
          edicoes={edicoes}
        />

        <Atividades
          active={currentSection === 'atividades'}
          atividades={atividades}
          setAtividades={setAtividades}
          equipes={equipes}
        />

        <Relatorios
          active={currentSection === 'relatorios'}
          edicoes={edicoes}
          participantes={participantes}
          equipes={equipes}
          atividades={atividades}
          metas={metas}
          doacoes={doacoes}
        />

        <Monitoramento
          active={currentSection === 'monitoramento'}
          edicoes={edicoes}
          participantes={participantes}
          equipes={equipes}
          atividades={atividades}
          metas={metas}
          doacoes={doacoes}
          onNavigate={setCurrentSection}
        />

        <Doacoes
          active={currentSection === 'doacoes'}
          participantes={participantes}
          equipes={equipes}
          doacoes={doacoes}
          onDoacoesChange={setDoacoes}
        />

        <Metas
          active={currentSection === 'metas'}
          user={user}
          metas={metas}
          onMetasChange={setMetas}
        />

        <Perfil
          active={currentSection === 'perfil'}
          user={user}
          onUserUpdate={handleUserUpdate}
          onDeleteAccount={handleDeleteAccount}
          onLogout={handleLogout}
        />
      </main>

      {/* MODAIS */}
      <LoginModal
        show={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onLogin={handleLogin}
        onShowRegister={() => {
          setShowLoginModal(false)
          setShowRegister(true)
        }}
      />

      <Registro
        show={showRegister}
        onClose={() => setShowRegister(false)}
        onRegister={handleLogin}
        onShowLogin={() => {
          setShowRegister(false)
          setShowLoginModal(true)
        }}
      />
    </div>
  )
}

export default App
