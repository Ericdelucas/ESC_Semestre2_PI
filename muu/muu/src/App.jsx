import { useState } from 'react'
import Header from './components/Header'
import LoginModal from './components/LoginModal'
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

function App() {
  const [currentSection, setCurrentSection] = useState('welcome')
  const [user, setUser] = useState(null)
  const [showLoginModal, setShowLoginModal] = useState(false)
  
  // Estados para dados do sistema
  const [edicoes, setEdicoes] = useState([])
  const [participantes, setParticipantes] = useState([])
  const [equipes, setEquipes] = useState([])
  const [atividades, setAtividades] = useState([])
  const [metas, setMetas] = useState([])
  const [doacoes, setDoacoes] = useState([])

  const handleLogin = (userData) => {
    setUser(userData)
    setShowLoginModal(false)
    setCurrentSection('dashboard')
  }

  const handleLogout = () => {
    setUser(null)
    setCurrentSection('welcome')
  }

  const showSection = (section) => {
    setCurrentSection(section)
  }

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
      </main>

      <LoginModal 
        show={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onLogin={handleLogin}
      />
    </div>
  )
}

export default App