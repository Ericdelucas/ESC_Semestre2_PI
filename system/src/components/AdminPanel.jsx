import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Button } from '@/components/ui/button.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs.jsx'
import { 
  Settings, 
  Users, 
  Target, 
  FileText, 
  Eye,
  Download,
  Calendar,
  BarChart3,
  AlertCircle,
  CheckCircle,
  Clock,
  TrendingUp
} from 'lucide-react'

const AdminPanel = ({ currentUser }) => {
  // Dados simulados para o painel administrativo
  const [equipesData] = useState([
    {
      id: 1,
      nome: 'Equipe Alpha',
      membros: ['João Silva', 'Maria Santos', 'Pedro Costa', 'Ana Lima'],
      totalPontos: 187,
      totalDoacoes: 23,
      metasAtivas: 3,
      ultimaAtividade: '2025-01-06 14:30'
    },
    {
      id: 2,
      nome: 'Equipe Beta',
      membros: ['Carlos Oliveira', 'Laura Nicoletti', 'Thiago Castro'],
      totalPontos: 156,
      totalDoacoes: 18,
      metasAtivas: 2,
      ultimaAtividade: '2025-01-06 10:15'
    },
    {
      id: 3,
      nome: 'Equipe Gamma',
      membros: ['Roberto Silva', 'Fernanda Costa', 'Lucas Santos', 'Juliana Lima'],
      totalPontos: 203,
      totalDoacoes: 31,
      metasAtivas: 4,
      ultimaAtividade: '2025-01-05 16:45'
    }
  ])

  const [metasMonitoramento] = useState([
    {
      id: 1,
      equipe: 'Equipe Alpha',
      titulo: 'Meta Semanal de Doações',
      dataInicio: '2025-01-06',
      dataFim: '2025-01-12',
      metaPontos: 50,
      pontosAtual: 23,
      acoes: [
        { tipo: 'criacao', data: '2025-01-06 09:00', usuario: 'João Silva' },
        { tipo: 'edicao', data: '2025-01-06 14:30', usuario: 'Maria Santos' }
      ]
    },
    {
      id: 2,
      equipe: 'Equipe Beta',
      titulo: 'Campanha do Mês',
      dataInicio: '2025-01-01',
      dataFim: '2025-01-31',
      metaPontos: 200,
      pontosAtual: 87,
      acoes: [
        { tipo: 'criacao', data: '2025-01-01 10:00', usuario: 'Carlos Oliveira' },
        { tipo: 'edicao', data: '2025-01-03 15:20', usuario: 'Laura Nicoletti' },
        { tipo: 'remocao', data: '2025-01-04 11:10', usuario: 'Thiago Castro' }
      ]
    }
  ])

  const [relatoriosSemanais] = useState([
    {
      id: 1,
      semana: '30/12/2024 - 05/01/2025',
      totalDoacoes: 45,
      totalPontos: 312,
      equipesAtivas: 3,
      metasConcluidas: 2,
      status: 'concluido'
    },
    {
      id: 2,
      semana: '23/12/2024 - 29/12/2024',
      totalDoacoes: 38,
      totalPontos: 267,
      equipesAtivas: 3,
      metasConcluidas: 1,
      status: 'concluido'
    },
    {
      id: 3,
      semana: '06/01/2025 - 12/01/2025',
      totalDoacoes: 23,
      totalPontos: 156,
      equipesAtivas: 3,
      metasConcluidas: 0,
      status: 'em_andamento'
    }
  ])

  const generateReport = (tipo) => {
    // Simulação de geração de relatório
    alert(`Gerando relatório ${tipo}...`)
  }

  const getAcaoIcon = (tipo) => {
    switch (tipo) {
      case 'criacao':
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case 'edicao':
        return <Eye className="h-4 w-4 text-blue-600" />
      case 'remocao':
        return <AlertCircle className="h-4 w-4 text-red-600" />
      default:
        return <Clock className="h-4 w-4 text-gray-600" />
    }
  }

  const getAcaoTexto = (tipo) => {
    switch (tipo) {
      case 'criacao':
        return 'Criou'
      case 'edicao':
        return 'Editou'
      case 'remocao':
        return 'Removeu'
      default:
        return 'Ação'
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-gray-800">Painel Administrativo</h2>
        <Badge variant="outline" className="text-lg px-3 py-1">
          Administrador
        </Badge>
      </div>

      {/* Estatísticas Gerais */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
          <CardContent className="p-4 text-center">
            <Users className="h-8 w-8 mx-auto mb-2" />
            <div className="text-2xl font-bold">{equipesData.length}</div>
            <div className="text-sm opacity-90">Equipes Ativas</div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
          <CardContent className="p-4 text-center">
            <TrendingUp className="h-8 w-8 mx-auto mb-2" />
            <div className="text-2xl font-bold">
              {equipesData.reduce((total, equipe) => total + equipe.totalPontos, 0)}
            </div>
            <div className="text-sm opacity-90">Pontos Totais</div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
          <CardContent className="p-4 text-center">
            <Target className="h-8 w-8 mx-auto mb-2" />
            <div className="text-2xl font-bold">
              {equipesData.reduce((total, equipe) => total + equipe.metasAtivas, 0)}
            </div>
            <div className="text-sm opacity-90">Metas Ativas</div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
          <CardContent className="p-4 text-center">
            <FileText className="h-8 w-8 mx-auto mb-2" />
            <div className="text-2xl font-bold">{relatoriosSemanais.length}</div>
            <div className="text-sm opacity-90">Relatórios</div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs do Painel */}
      <Tabs defaultValue="equipes" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="equipes" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Monitoramento de Equipes
          </TabsTrigger>
          <TabsTrigger value="metas" className="flex items-center gap-2">
            <Target className="h-4 w-4" />
            Controle de Metas
          </TabsTrigger>
          <TabsTrigger value="relatorios" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Relatórios Semanais
          </TabsTrigger>
        </TabsList>

        {/* Monitoramento de Equipes */}
        <TabsContent value="equipes" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Monitoramento de Equipes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {equipesData.map((equipe) => (
                  <div key={equipe.id} className="p-4 border rounded-lg hover:bg-gray-50">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-semibold text-lg text-gray-800">{equipe.nome}</h3>
                        <p className="text-sm text-gray-600">
                          {equipe.membros.length} membros: {equipe.membros.join(', ')}
                        </p>
                      </div>
                      <Badge variant="outline">
                        {equipe.metasAtivas} metas ativas
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="text-center p-3 bg-blue-50 rounded-lg">
                        <div className="text-xl font-bold text-blue-600">{equipe.totalPontos}</div>
                        <div className="text-xs text-gray-600">Pontos Totais</div>
                      </div>
                      <div className="text-center p-3 bg-green-50 rounded-lg">
                        <div className="text-xl font-bold text-green-600">{equipe.totalDoacoes}</div>
                        <div className="text-xs text-gray-600">Doações</div>
                      </div>
                      <div className="text-center p-3 bg-purple-50 rounded-lg">
                        <div className="text-xl font-bold text-purple-600">{equipe.metasAtivas}</div>
                        <div className="text-xs text-gray-600">Metas Ativas</div>
                      </div>
                      <div className="text-center p-3 bg-gray-50 rounded-lg">
                        <div className="text-xs font-medium text-gray-600">Última Atividade</div>
                        <div className="text-xs text-gray-500">
                          {new Date(equipe.ultimaAtividade).toLocaleString('pt-BR')}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Controle de Metas */}
        <TabsContent value="metas" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Controle de Metas - Histórico de Ações
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {metasMonitoramento.map((meta) => {
                  const progresso = (meta.pontosAtual / meta.metaPontos) * 100
                  
                  return (
                    <div key={meta.id} className="p-4 border rounded-lg">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-800">{meta.titulo}</h3>
                          <p className="text-sm text-gray-600 mb-2">Equipe: {meta.equipe}</p>
                          <div className="flex items-center gap-4 text-sm text-gray-500">
                            <span>Período: {new Date(meta.dataInicio).toLocaleDateString('pt-BR')} - {new Date(meta.dataFim).toLocaleDateString('pt-BR')}</span>
                            <span>Progresso: {meta.pontosAtual}/{meta.metaPontos} pontos ({progresso.toFixed(1)}%)</span>
                          </div>
                        </div>
                        <Badge variant={progresso >= 100 ? 'default' : 'secondary'}>
                          {progresso >= 100 ? 'Concluída' : 'Em andamento'}
                        </Badge>
                      </div>
                      
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <h4 className="font-medium text-sm text-gray-700 mb-2">Histórico de Ações:</h4>
                        <div className="space-y-2">
                          {meta.acoes.map((acao, index) => (
                            <div key={index} className="flex items-center gap-3 text-sm">
                              {getAcaoIcon(acao.tipo)}
                              <span className="text-gray-600">
                                {getAcaoTexto(acao.tipo)} por <strong>{acao.usuario}</strong> em {new Date(acao.data).toLocaleString('pt-BR')}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Relatórios Semanais */}
        <TabsContent value="relatorios" className="mt-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Relatórios Semanais
                </CardTitle>
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => generateReport('semanal')}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Gerar Relatório
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {relatoriosSemanais.map((relatorio) => (
                  <div key={relatorio.id} className="p-4 border rounded-lg hover:bg-gray-50">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-semibold text-gray-800">
                          Semana: {relatorio.semana}
                        </h3>
                        <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {relatorio.totalDoacoes} doações
                          </span>
                          <span className="flex items-center gap-1">
                            <BarChart3 className="h-3 w-3" />
                            {relatorio.totalPontos} pontos
                          </span>
                          <span className="flex items-center gap-1">
                            <Users className="h-3 w-3" />
                            {relatorio.equipesAtivas} equipes ativas
                          </span>
                          <span className="flex items-center gap-1">
                            <Target className="h-3 w-3" />
                            {relatorio.metasConcluidas} metas concluídas
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge 
                          variant={relatorio.status === 'concluido' ? 'default' : 'secondary'}
                        >
                          {relatorio.status === 'concluido' ? 'Concluído' : 'Em Andamento'}
                        </Badge>
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Ações Rápidas */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Ações Rápidas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button 
              variant="outline" 
              className="h-20 flex flex-col items-center justify-center gap-2"
              onClick={() => generateReport('geral')}
            >
              <FileText className="h-6 w-6" />
              <span>Relatório Geral</span>
            </Button>
            
            <Button 
              variant="outline" 
              className="h-20 flex flex-col items-center justify-center gap-2"
              onClick={() => generateReport('equipes')}
            >
              <Users className="h-6 w-6" />
              <span>Relatório por Equipe</span>
            </Button>
            
            <Button 
              variant="outline" 
              className="h-20 flex flex-col items-center justify-center gap-2"
              onClick={() => generateReport('metas')}
            >
              <Target className="h-6 w-6" />
              <span>Relatório de Metas</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Informações do Sistema */}
      <Card className="border-l-4 border-l-green-500 bg-green-50">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
            <div>
              <h4 className="font-semibold text-gray-800 mb-2">Funcionalidades do Painel Administrativo</h4>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>• Monitoramento em tempo real de todas as equipes e suas atividades</li>
                <li>• Controle completo das metas com histórico de criação, edição e remoção</li>
                <li>• Geração automática de relatórios semanais para análise de desempenho</li>
                <li>• Visibilidade total das ações dos usuários para auditoria e transparência</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default AdminPanel

