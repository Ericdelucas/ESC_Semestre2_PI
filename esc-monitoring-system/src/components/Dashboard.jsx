import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { 
  Users, 
  Calendar, 
  Trophy, 
  Target,
  TrendingUp,
  Clock
} from 'lucide-react'

const Dashboard = ({ currentUser }) => {
  // Dados simulados - em um sistema real, viriam de uma API
  const stats = {
    totalEquipes: 12,
    totalAlunos: 48,
    totalDoacoes: 156,
    metasAtivas: 8,
    pontuacaoTotal: 2340
  }

  const recentActivities = [
    {
      id: 1,
      tipo: 'doacao',
      descricao: 'João Silva registrou doação de Arroz',
      pontos: 1,
      data: '2025-01-06 14:30',
      equipe: 'Equipe Alpha'
    },
    {
      id: 2,
      tipo: 'meta',
      descricao: 'Equipe Beta criou nova meta para Janeiro',
      data: '2025-01-06 13:15',
      equipe: 'Equipe Beta'
    },
    {
      id: 3,
      tipo: 'doacao',
      descricao: 'Maria Santos registrou doação de Feijão',
      pontos: 2,
      data: '2025-01-06 11:45',
      equipe: 'Equipe Gamma'
    }
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-gray-800">Dashboard</h2>
        <Badge variant="outline" className="text-lg px-3 py-1">
          Bem-vindo, {currentUser.nome}!
        </Badge>
      </div>

      {/* Cards de Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Equipes</CardTitle>
            <Users className="h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalEquipes}</div>
            <p className="text-xs text-blue-100">
              +2 desde o mês passado
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Alunos</CardTitle>
            <Users className="h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalAlunos}</div>
            <p className="text-xs text-green-100">
              +8 novos alunos
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Doações</CardTitle>
            <Trophy className="h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalDoacoes}</div>
            <p className="text-xs text-purple-100">
              +23 esta semana
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pontuação Total</CardTitle>
            <Target className="h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pontuacaoTotal}</div>
            <p className="text-xs text-orange-100">
              +156 pontos hoje
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Atividades Recentes */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Atividades Recentes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentActivities.map((activity) => (
              <div key={activity.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <p className="font-medium text-gray-800">{activity.descricao}</p>
                  <div className="flex items-center gap-4 mt-1">
                    <span className="text-sm text-gray-500">{activity.data}</span>
                    <Badge variant="outline" className="text-xs">
                      {activity.equipe}
                    </Badge>
                  </div>
                </div>
                {activity.pontos && (
                  <Badge className="bg-green-100 text-green-800">
                    +{activity.pontos} pts
                  </Badge>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Informações da Equipe (se for aluno) */}
      {currentUser.tipo === 'aluno' && currentUser.equipe && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Minha Equipe: {currentUser.equipe}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">4</div>
                <div className="text-sm text-gray-600">Membros</div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">23</div>
                <div className="text-sm text-gray-600">Doações</div>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">187</div>
                <div className="text-sm text-gray-600">Pontos</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

export default Dashboard

