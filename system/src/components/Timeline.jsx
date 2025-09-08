import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs.jsx'
import { 
  Clock, 
  User, 
  Users, 
  Trophy, 
  Calendar,
  CheckCircle,
  Gift,
  Target
} from 'lucide-react'

const Timeline = ({ currentUser }) => {
  // Dados simulados da linha do tempo
  const timelineData = {
    individual: [
      {
        id: 1,
        tipo: 'doacao',
        titulo: 'Doação de Arroz',
        descricao: 'Registrou doação de 2kg de arroz',
        pontos: 1,
        data: '2025-01-06 14:30',
        status: 'concluido'
      },
      {
        id: 2,
        tipo: 'doacao',
        titulo: 'Doação de Feijão',
        descricao: 'Registrou doação de 1kg de feijão',
        pontos: 2,
        data: '2025-01-05 16:45',
        status: 'concluido'
      },
      {
        id: 3,
        tipo: 'meta',
        titulo: 'Meta Semanal Criada',
        descricao: 'Definiu meta de 5 doações para esta semana',
        data: '2025-01-04 09:15',
        status: 'ativo'
      },
      {
        id: 4,
        tipo: 'doacao',
        titulo: 'Doação de Açúcar',
        descricao: 'Registrou doação de 1kg de açúcar',
        pontos: 3,
        data: '2025-01-03 11:20',
        status: 'concluido'
      },
      {
        id: 5,
        tipo: 'doacao',
        titulo: 'Doação em Dinheiro',
        descricao: 'Registrou doação de R$ 50,00',
        pontos: 9,
        data: '2025-01-02 13:10',
        status: 'concluido'
      }
    ],
    equipe: [
      {
        id: 1,
        tipo: 'doacao',
        titulo: 'João Silva - Doação de Arroz',
        descricao: 'Membro da equipe registrou doação de arroz',
        pontos: 1,
        data: '2025-01-06 14:30',
        autor: 'João Silva',
        status: 'concluido'
      },
      {
        id: 2,
        tipo: 'doacao',
        titulo: 'Maria Santos - Doação de Óleo',
        descricao: 'Membro da equipe registrou doação de óleo',
        pontos: 4,
        data: '2025-01-06 10:15',
        autor: 'Maria Santos',
        status: 'concluido'
      },
      {
        id: 3,
        tipo: 'meta',
        titulo: 'Meta da Equipe Atualizada',
        descricao: 'Equipe definiu nova meta mensal de 100 pontos',
        data: '2025-01-05 14:00',
        autor: 'Pedro Costa',
        status: 'ativo'
      },
      {
        id: 4,
        tipo: 'doacao',
        titulo: 'Ana Lima - Doação de Leite em Pó',
        descricao: 'Membro da equipe registrou doação de leite em pó',
        pontos: 7,
        data: '2025-01-04 16:30',
        autor: 'Ana Lima',
        status: 'concluido'
      },
      {
        id: 5,
        tipo: 'doacao',
        titulo: 'Carlos Oliveira - Doação de Macarrão',
        descricao: 'Membro da equipe registrou doação de macarrão',
        pontos: 5,
        data: '2025-01-03 12:45',
        autor: 'Carlos Oliveira',
        status: 'concluido'
      }
    ]
  }

  const getIconByType = (tipo) => {
    switch (tipo) {
      case 'doacao':
        return <Gift className="h-4 w-4" />
      case 'meta':
        return <Target className="h-4 w-4" />
      default:
        return <CheckCircle className="h-4 w-4" />
    }
  }

  const getColorByType = (tipo) => {
    switch (tipo) {
      case 'doacao':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'meta':
        return 'bg-blue-100 text-blue-800 border-blue-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const TimelineItem = ({ item, showAuthor = false }) => (
    <div className="flex gap-4 p-4 border-l-2 border-gray-200 hover:border-blue-300 transition-colors">
      <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${getColorByType(item.tipo)}`}>
        {getIconByType(item.tipo)}
      </div>
      
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h4 className="font-semibold text-gray-800 mb-1">{item.titulo}</h4>
            <p className="text-sm text-gray-600 mb-2">{item.descricao}</p>
            
            <div className="flex items-center gap-3 text-xs text-gray-500">
              <div className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {new Date(item.data).toLocaleString('pt-BR')}
              </div>
              {showAuthor && item.autor && (
                <div className="flex items-center gap-1">
                  <User className="h-3 w-3" />
                  {item.autor}
                </div>
              )}
            </div>
          </div>
          
          <div className="flex items-center gap-2 ml-4">
            {item.pontos && (
              <Badge className="bg-yellow-100 text-yellow-800">
                +{item.pontos} pts
              </Badge>
            )}
            <Badge 
              variant={item.status === 'concluido' ? 'default' : 'secondary'}
              className="text-xs"
            >
              {item.status === 'concluido' ? 'Concluído' : 'Ativo'}
            </Badge>
          </div>
        </div>
      </div>
    </div>
  )

  const calculateTotalPoints = (timeline) => {
    return timeline.reduce((total, item) => total + (item.pontos || 0), 0)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-gray-800">Linha do Tempo</h2>
        <Badge variant="outline" className="text-lg px-3 py-1">
          {currentUser.equipe || 'Individual'}
        </Badge>
      </div>

      {/* Estatísticas Rápidas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">
              {calculateTotalPoints(timelineData.individual)}
            </div>
            <div className="text-sm text-gray-600">Meus Pontos</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">
              {timelineData.individual.filter(item => item.tipo === 'doacao').length}
            </div>
            <div className="text-sm text-gray-600">Minhas Doações</div>
          </CardContent>
        </Card>
        
        {currentUser.equipe && (
          <>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {calculateTotalPoints(timelineData.equipe)}
                </div>
                <div className="text-sm text-gray-600">Pontos da Equipe</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-orange-600">
                  {timelineData.equipe.filter(item => item.tipo === 'doacao').length}
                </div>
                <div className="text-sm text-gray-600">Doações da Equipe</div>
              </CardContent>
            </Card>
          </>
        )}
      </div>

      {/* Timeline Tabs */}
      <Tabs defaultValue="individual" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="individual" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            Minha Timeline
          </TabsTrigger>
          <TabsTrigger value="equipe" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Timeline da Equipe
          </TabsTrigger>
        </TabsList>

        <TabsContent value="individual" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Minha Linha do Tempo
              </CardTitle>
            </CardHeader>
            <CardContent>
              {timelineData.individual.length > 0 ? (
                <div className="space-y-2">
                  {timelineData.individual.map((item) => (
                    <TimelineItem key={item.id} item={item} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Nenhuma atividade registrada ainda.</p>
                  <p className="text-sm">Comece registrando suas primeiras doações!</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="equipe" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Timeline da Equipe {currentUser.equipe}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {timelineData.equipe.length > 0 ? (
                <div className="space-y-2">
                  {timelineData.equipe.map((item) => (
                    <TimelineItem key={item.id} item={item} showAuthor={true} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Nenhuma atividade da equipe registrada ainda.</p>
                  <p className="text-sm">Incentive sua equipe a registrar as doações!</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Informações sobre Prevenção de Fraudes */}
      <Card className="border-l-4 border-l-yellow-500 bg-yellow-50">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <Trophy className="h-5 w-5 text-yellow-600 mt-0.5" />
            <div>
              <h4 className="font-semibold text-gray-800 mb-2">Sistema Anti-Fraude</h4>
              <p className="text-sm text-gray-700 mb-2">
                Todas as atividades são registradas com timestamp e rastreabilidade para garantir a transparência e evitar fraudes.
              </p>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Cada doação é registrada individualmente com data e hora</li>
                <li>• Timeline mostra tanto atividades individuais quanto da equipe</li>
                <li>• Histórico completo para auditoria e verificação</li>
                <li>• Pontuação transparente baseada em critérios pré-definidos</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default Timeline

