import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { 
  Clock, 
  Users, 
  Calendar, 
  BarChart3, 
  Settings, 
  Heart,
  Timer,
  Trophy,
  Target,
  FileText
} from 'lucide-react'
import './App.css'

// Componentes principais
import Dashboard from './components/Dashboard'
import TimeMonitor from './components/TimeMonitor'
import Timeline from './components/Timeline'
import DonationSystem from './components/DonationSystem'
import GoalsCalendar from './components/GoalsCalendar'
import AdminPanel from './components/AdminPanel'
import LoginModal from './components/LoginModal'

function App() {
  const [currentUser, setCurrentUser] = useState(null)
  const [activeTab, setActiveTab] = useState('dashboard')
  const [showLoginModal, setShowLoginModal] = useState(false)

  const handleLogin = (userData) => {
    setCurrentUser(userData)
    setShowLoginModal(false)
  }

  const handleLogout = () => {
    setCurrentUser(null)
    setActiveTab('dashboard')
  }

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center">
        <div className="max-w-md w-full mx-4">
          <Card className="shadow-xl">
            <CardHeader className="text-center">
              <div className="flex items-center justify-center mb-4">
                <Heart className="h-8 w-8 text-green-600 mr-2" />
                <h1 className="text-2xl font-bold text-gray-800">Lideranças Empáticas</h1>
              </div>
              <p className="text-gray-600">Sistema de Monitoramento de Alunos</p>
            </CardHeader>
            <CardContent>
              <Button 
                onClick={() => setShowLoginModal(true)}
                className="w-full bg-green-600 hover:bg-green-700"
              >
                Fazer Login
              </Button>
            </CardContent>
          </Card>
        </div>
        
        {showLoginModal && (
          <LoginModal 
            onLogin={handleLogin}
            onClose={() => setShowLoginModal(false)}
          />
        )}
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Heart className="h-8 w-8 text-green-600 mr-2" />
              <h1 className="text-xl font-bold text-gray-800">Lideranças Empáticas</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <Badge variant="outline" className="text-sm">
                {currentUser.tipo}
              </Badge>
              <span className="text-sm text-gray-600">{currentUser.nome}</span>
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleLogout}
              >
                Sair
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-6 mb-8">
            <TabsTrigger value="dashboard" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Dashboard
            </TabsTrigger>
            <TabsTrigger value="time-monitor" className="flex items-center gap-2">
              <Timer className="h-4 w-4" />
              Tempo
            </TabsTrigger>
            <TabsTrigger value="timeline" className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Timeline
            </TabsTrigger>
            <TabsTrigger value="donations" className="flex items-center gap-2">
              <Trophy className="h-4 w-4" />
              Doações
            </TabsTrigger>
            <TabsTrigger value="goals" className="flex items-center gap-2">
              <Target className="h-4 w-4" />
              Metas
            </TabsTrigger>
            {currentUser.tipo === 'administrador' && (
              <TabsTrigger value="admin" className="flex items-center gap-2">
                <Settings className="h-4 w-4" />
                Admin
              </TabsTrigger>
            )}
          </TabsList>

          <TabsContent value="dashboard">
            <Dashboard currentUser={currentUser} />
          </TabsContent>

          <TabsContent value="time-monitor">
            <TimeMonitor currentUser={currentUser} />
          </TabsContent>

          <TabsContent value="timeline">
            <Timeline currentUser={currentUser} />
          </TabsContent>

          <TabsContent value="donations">
            <DonationSystem currentUser={currentUser} />
          </TabsContent>

          <TabsContent value="goals">
            <GoalsCalendar currentUser={currentUser} />
          </TabsContent>

          {currentUser.tipo === 'administrador' && (
            <TabsContent value="admin">
              <AdminPanel currentUser={currentUser} />
            </TabsContent>
          )}
        </Tabs>
      </main>
    </div>
  )
}

export default App

