import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Progress } from '@/components/ui/progress.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { 
  Clock, 
  Calendar, 
  Timer, 
  AlertCircle,
  CheckCircle,
  Users
} from 'lucide-react'
import relogioImage from '../assets/Relogio.png'

const TimeMonitor = ({ currentUser }) => {
  const [currentTime, setCurrentTime] = useState(new Date())
  
  // Configuração do período de 1 mês (30 dias)
  const startDate = new Date('2025-01-01')
  const endDate = new Date('2025-01-31')
  const totalDays = 30
  
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)
    
    return () => clearInterval(timer)
  }, [])

  // Calcular progresso
  const now = new Date()
  const daysElapsed = Math.floor((now - startDate) / (1000 * 60 * 60 * 24))
  const daysRemaining = Math.max(0, totalDays - daysElapsed)
  const progressPercentage = Math.min(100, (daysElapsed / totalDays) * 100)

  // Calcular horas, minutos e segundos restantes no dia atual
  const endOfDay = new Date(now)
  endOfDay.setHours(23, 59, 59, 999)
  const timeUntilEndOfDay = endOfDay - now
  
  const hoursLeft = Math.floor(timeUntilEndOfDay / (1000 * 60 * 60))
  const minutesLeft = Math.floor((timeUntilEndOfDay % (1000 * 60 * 60)) / (1000 * 60))
  const secondsLeft = Math.floor((timeUntilEndOfDay % (1000 * 60)) / 1000)

  const getStatusColor = () => {
    if (progressPercentage < 30) return 'text-green-600'
    if (progressPercentage < 70) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getStatusIcon = () => {
    if (progressPercentage < 70) return <CheckCircle className="h-5 w-5 text-green-600" />
    if (progressPercentage < 90) return <AlertCircle className="h-5 w-5 text-yellow-600" />
    return <AlertCircle className="h-5 w-5 text-red-600" />
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-gray-800">Monitoramento de Tempo</h2>
        <Badge variant="outline" className="text-lg px-3 py-1">
          {currentUser.equipe || 'Individual'}
        </Badge>
      </div>

      {/* Relógio Principal */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-gradient-to-br from-green-50 to-blue-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Timer className="h-6 w-6 text-green-600" />
              Relógio de Tempo das Tarefas
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <div className="mb-6">
              <img 
                src={relogioImage} 
                alt="Relógio Lideranças Empáticas" 
                className="w-32 h-32 mx-auto mb-4 rounded-full shadow-lg"
              />
            </div>
            
            <div className="space-y-4">
              <div className="text-4xl font-bold text-gray-800">
                {String(hoursLeft).padStart(2, '0')}:
                {String(minutesLeft).padStart(2, '0')}:
                {String(secondsLeft).padStart(2, '0')}
              </div>
              <p className="text-gray-600">Tempo restante hoje</p>
              
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Progresso do Período</span>
                  <span className={`text-sm font-bold ${getStatusColor()}`}>
                    {progressPercentage.toFixed(1)}%
                  </span>
                </div>
                <Progress value={progressPercentage} className="h-3" />
                <div className="flex justify-between text-xs text-gray-500 mt-2">
                  <span>{startDate.toLocaleDateString('pt-BR')}</span>
                  <span>{endDate.toLocaleDateString('pt-BR')}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Informações Detalhadas */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-6 w-6 text-blue-600" />
              Detalhes do Período
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-gray-600" />
                  <span className="font-medium">Data Atual</span>
                </div>
                <span className="text-gray-800">
                  {currentTime.toLocaleDateString('pt-BR')}
                </span>
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-gray-600" />
                  <span className="font-medium">Dias Decorridos</span>
                </div>
                <span className="text-gray-800 font-bold">
                  {daysElapsed} de {totalDays} dias
                </span>
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <Timer className="h-4 w-4 text-gray-600" />
                  <span className="font-medium">Dias Restantes</span>
                </div>
                <span className={`font-bold ${getStatusColor()}`}>
                  {daysRemaining} dias
                </span>
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2">
                  {getStatusIcon()}
                  <span className="font-medium">Status</span>
                </div>
                <Badge 
                  variant={progressPercentage < 70 ? "default" : progressPercentage < 90 ? "secondary" : "destructive"}
                >
                  {progressPercentage < 30 ? 'Início' : 
                   progressPercentage < 70 ? 'Em Andamento' : 
                   progressPercentage < 90 ? 'Atenção' : 'Urgente'}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Informações da Equipe */}
      {currentUser.tipo === 'aluno' && currentUser.equipe && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-6 w-6 text-purple-600" />
              Tempo da Equipe: {currentUser.equipe}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">4</div>
                <div className="text-sm text-gray-600">Membros Ativos</div>
              </div>
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">23</div>
                <div className="text-sm text-gray-600">Tarefas Concluídas</div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">87%</div>
                <div className="text-sm text-gray-600">Progresso da Equipe</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Dicas e Alertas */}
      <Card className="border-l-4 border-l-blue-500">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-blue-500 mt-0.5" />
            <div>
              <h4 className="font-semibold text-gray-800 mb-2">Dicas para Gerenciar seu Tempo</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Registre suas doações diariamente para não perder pontos</li>
                <li>• Acompanhe o progresso da sua equipe regularmente</li>
                <li>• Defina metas semanais para manter o ritmo</li>
                <li>• Use a linha do tempo para verificar seu histórico</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default TimeMonitor

