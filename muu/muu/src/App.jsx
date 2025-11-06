import { useState, useEffect } from 'react'
import axios from 'axios'

// Componentes
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
import Graficos from './components/Graficos' // ✅ novo import

// 🔒 Controle de acesso por tipo de usuário
const ACCESS_MAP = {
  administrador: [
    'dashboard', 'edicoes', 'participantes', 'equipes', 'atividades',
    'relatorios', 'monitoramento', 'doacoes', 'metas', 'perfil', 'graficos' // ✅ adicionado
  ],
  professor: [
    'dashboard', 'participantes', 'equipes', 'atividades',
    'relatorios', 'monitoramento', 'perfil', 'graficos' // ✅ adicionado
  ],
  mentor: [
    'dashboard', 'participantes', 'equipes', 'atividades', 'perfil', 'graficos' // ✅ adicionado
  ],
  aluno: [
    'dashboard', 'doacoes', 'perfil', 'graficos' // ✅ adicionado
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

  // 🔐 Verifica login persistente ao abrir o app
  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) return

    const fetchUser = async () => {
      try {
        const res = await axios.get('http://localhost:3001/api/auth/me', {
          headers: { Authorization: `Bearer ${token}` }
        })
        setUser(res.data.user)
        if (currentSection === 'welcome') setCurrentSection('dashboard')
      } catch (err) {
        console.warn('Token inválido, removendo...')
        localStorage.removeItem('token')
        setUser(null)
        setCurrentSection('welcome')
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

  // Atualiza dados do usuário
  const handleUserUpdate = (newUser) => {
    setUser(newUser)
  }

  // Deleta conta
  const handleDeleteAccount = () => {
    alert('Sua conta foi excluída.')
    handleLogout()
  }

  // Navegar entre seções
  const showSection = (section) => setCurrentSection(section)

  // 🔐 Restringe seções conforme tipo de usuário
  useEffect(() => {
    if (user?.tipo && ACCESS_MAP[user.tipo]) {
      if (!ACCESS_MAP[user.tipo].includes(currentSection)) {
        setCurrentSection('dashboard')
      }
    }
  }, [user, currentSection])

  // ✅ Proteção visual — fallback se tudo estiver vazio
  const renderSection = () => {
    if (!user && currentSection !== 'welcome') {
      return (
        <section className="section active">
          <div className="container">
            <p style={{ textAlign: 'center', marginTop: '3rem' }}>
              ⚠️ Sua sessão expirou. Faça login novamente.
            </p>
          </div>
        </section>
      )
    }

    return (
      <>
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

        <Graficos
          active={currentSection === 'graficos'} // ✅ nova aba
        />
      </>
    )
  }

  return (
    <div className="App">
      {/* 🔝 Header sempre visível */}
      <Header
        user={user}
        onLogin={() => setShowLoginModal(true)}
        onLogout={handleLogout}
        onNavigate={showSection}
        currentSection={currentSection}
      />

      <main className="main">
        {renderSection()}
      </main>

      {/* 🔐 Modais */}
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
