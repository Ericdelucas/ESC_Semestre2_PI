import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Button } from '@/components/ui/button.jsx'
import { Input } from '@/components/ui/input.jsx'
import { Label } from '@/components/ui/label.jsx'
import { Textarea } from '@/components/ui/textarea.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { Progress } from '@/components/ui/progress.jsx'
import { 
  Target, 
  Plus, 
  Calendar, 
  CheckCircle, 
  Clock,
  Users,
  Edit,
  Trash2,
  AlertCircle
} from 'lucide-react'

const GoalsCalendar = ({ currentUser }) => {
  const [showForm, setShowForm] = useState(false)
  const [editingGoal, setEditingGoal] = useState(null)
  const [formData, setFormData] = useState({
    titulo: '',
    descricao: '',
    dataInicio: new Date().toISOString().split('T')[0],
    dataFim: '',
    metaPontos: '',
    categoria: 'doacao'
  })

  // Dados simulados de metas
  const [metas, setMetas] = useState([
    {
      id: 1,
      titulo: 'Meta Semanal de Doações',
      descricao: 'Arrecadar 50 pontos em doações esta semana',
      dataInicio: '2025-01-06',
      dataFim: '2025-01-12',
      metaPontos: 50,
      pontosAtual: 23,
      categoria: 'doacao',
      status: 'ativo',
      equipe: currentUser.equipe || 'Individual',
      criadoPor: currentUser.nome
    },
    {
      id: 2,
      titulo: 'Campanha do Mês',
      descricao: 'Atingir 200 pontos até o final de janeiro',
      dataInicio: '2025-01-01',
      dataFim: '2025-01-31',
      metaPontos: 200,
      pontosAtual: 87,
      categoria: 'campanha',
      status: 'ativo',
      equipe: currentUser.equipe || 'Individual',
      criadoPor: 'Maria Santos'
    },
    {
      id: 3,
      titulo: 'Meta de Participação',
      descricao: 'Todos os membros da equipe devem registrar pelo menos 1 doação',
      dataInicio: '2025-01-01',
      dataFim: '2025-01-15',
      metaPontos: 4,
      pontosAtual: 3,
      categoria: 'participacao',
      status: 'ativo',
      equipe: currentUser.equipe || 'Individual',
      criadoPor: 'João Silva'
    }
  ])

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (editingGoal) {
      // Editar meta existente
      setMetas(prev => prev.map(meta => 
        meta.id === editingGoal.id 
          ? { ...meta, ...formData }
          : meta
      ))
      setEditingGoal(null)
    } else {
      // Criar nova meta
      const novaMeta = {
        id: Date.now(),
        ...formData,
        pontosAtual: 0,
        status: 'ativo',
        equipe: currentUser.equipe || 'Individual',
        criadoPor: currentUser.nome
      }
      setMetas(prev => [novaMeta, ...prev])
    }
    
    // Reset form
    setFormData({
      titulo: '',
      descricao: '',
      dataInicio: new Date().toISOString().split('T')[0],
      dataFim: '',
      metaPontos: '',
      categoria: 'doacao'
    })
    
    setShowForm(false)
  }

  const handleEdit = (meta) => {
    setFormData({
      titulo: meta.titulo,
      descricao: meta.descricao,
      dataInicio: meta.dataInicio,
      dataFim: meta.dataFim,
      metaPontos: meta.metaPontos.toString(),
      categoria: meta.categoria
    })
    setEditingGoal(meta)
    setShowForm(true)
  }

  const handleDelete = (id) => {
    setMetas(prev => prev.filter(meta => meta.id !== id))
  }

  const getStatusColor = (meta) => {
    const now = new Date()
    const fim = new Date(meta.dataFim)
    const progresso = (meta.pontosAtual / meta.metaPontos) * 100
    
    if (progresso >= 100) return 'text-green-600'
    if (fim < now) return 'text-red-600'
    if (progresso >= 70) return 'text-blue-600'
    return 'text-yellow-600'
  }

  const getStatusBadge = (meta) => {
    const now = new Date()
    const fim = new Date(meta.dataFim)
    const progresso = (meta.pontosAtual / meta.metaPontos) * 100
    
    if (progresso >= 100) return { variant: 'default', text: 'Concluída' }
    if (fim < now) return { variant: 'destructive', text: 'Expirada' }
    if (progresso >= 70) return { variant: 'secondary', text: 'Quase lá' }
    return { variant: 'outline', text: 'Em andamento' }
  }

  const getCategoryIcon = (categoria) => {
    switch (categoria) {
      case 'doacao':
        return <Target className="h-4 w-4" />
      case 'campanha':
        return <Calendar className="h-4 w-4" />
      case 'participacao':
        return <Users className="h-4 w-4" />
      default:
        return <Target className="h-4 w-4" />
    }
  }

  const getCategoryColor = (categoria) => {
    switch (categoria) {
      case 'doacao':
        return 'bg-green-100 text-green-800'
      case 'campanha':
        return 'bg-blue-100 text-blue-800'
      case 'participacao':
        return 'bg-purple-100 text-purple-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-gray-800">Calendário de Metas</h2>
        <Button 
          onClick={() => setShowForm(true)}
          className="bg-blue-600 hover:bg-blue-700"
        >
          <Plus className="h-4 w-4 mr-2" />
          Nova Meta
        </Button>
      </div>

      {/* Estatísticas das Metas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
          <CardContent className="p-4 text-center">
            <Target className="h-8 w-8 mx-auto mb-2" />
            <div className="text-2xl font-bold">{metas.length}</div>
            <div className="text-sm opacity-90">Total de Metas</div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
          <CardContent className="p-4 text-center">
            <CheckCircle className="h-8 w-8 mx-auto mb-2" />
            <div className="text-2xl font-bold">
              {metas.filter(m => (m.pontosAtual / m.metaPontos) >= 1).length}
            </div>
            <div className="text-sm opacity-90">Concluídas</div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white">
          <CardContent className="p-4 text-center">
            <Clock className="h-8 w-8 mx-auto mb-2" />
            <div className="text-2xl font-bold">
              {metas.filter(m => m.status === 'ativo' && (m.pontosAtual / m.metaPontos) < 1).length}
            </div>
            <div className="text-sm opacity-90">Em Andamento</div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
          <CardContent className="p-4 text-center">
            <Users className="h-8 w-8 mx-auto mb-2" />
            <div className="text-2xl font-bold">
              {metas.filter(m => m.equipe === currentUser.equipe).length}
            </div>
            <div className="text-sm opacity-90">Da Minha Equipe</div>
          </CardContent>
        </Card>
      </div>

      {/* Formulário de Nova Meta */}
      {showForm && (
        <Card className="border-2 border-blue-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {editingGoal ? <Edit className="h-5 w-5" /> : <Plus className="h-5 w-5" />}
              {editingGoal ? 'Editar Meta' : 'Nova Meta'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="titulo">Título da Meta</Label>
                  <Input
                    id="titulo"
                    value={formData.titulo}
                    onChange={(e) => handleInputChange('titulo', e.target.value)}
                    placeholder="Ex: Meta Semanal de Doações"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="categoria">Categoria</Label>
                  <select
                    id="categoria"
                    value={formData.categoria}
                    onChange={(e) => handleInputChange('categoria', e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md"
                    required
                  >
                    <option value="doacao">Doação</option>
                    <option value="campanha">Campanha</option>
                    <option value="participacao">Participação</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="dataInicio">Data de Início</Label>
                  <Input
                    id="dataInicio"
                    type="date"
                    value={formData.dataInicio}
                    onChange={(e) => handleInputChange('dataInicio', e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="dataFim">Data de Fim</Label>
                  <Input
                    id="dataFim"
                    type="date"
                    value={formData.dataFim}
                    onChange={(e) => handleInputChange('dataFim', e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="metaPontos">Meta de Pontos</Label>
                  <Input
                    id="metaPontos"
                    type="number"
                    value={formData.metaPontos}
                    onChange={(e) => handleInputChange('metaPontos', e.target.value)}
                    placeholder="Ex: 50"
                    min="1"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="descricao">Descrição</Label>
                <Textarea
                  id="descricao"
                  value={formData.descricao}
                  onChange={(e) => handleInputChange('descricao', e.target.value)}
                  placeholder="Descreva os objetivos e detalhes da meta"
                  rows={3}
                  required
                />
              </div>

              <div className="flex gap-3">
                <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                  <CheckCircle className="h-4 w-4 mr-2" />
                  {editingGoal ? 'Atualizar Meta' : 'Criar Meta'}
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => {
                    setShowForm(false)
                    setEditingGoal(null)
                    setFormData({
                      titulo: '',
                      descricao: '',
                      dataInicio: new Date().toISOString().split('T')[0],
                      dataFim: '',
                      metaPontos: '',
                      categoria: 'doacao'
                    })
                  }}
                >
                  Cancelar
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Lista de Metas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {metas.map((meta) => {
          const progresso = Math.min(100, (meta.pontosAtual / meta.metaPontos) * 100)
          const statusBadge = getStatusBadge(meta)
          
          return (
            <Card key={meta.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <div className={`p-1 rounded ${getCategoryColor(meta.categoria)}`}>
                        {getCategoryIcon(meta.categoria)}
                      </div>
                      <h3 className="font-semibold text-gray-800">{meta.titulo}</h3>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">{meta.descricao}</p>
                  </div>
                  
                  <div className="flex items-center gap-2 ml-4">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEdit(meta)}
                      className="h-8 w-8 p-0"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(meta.id)}
                      className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent>
                <div className="space-y-4">
                  {/* Progresso */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Progresso</span>
                      <span className={`text-sm font-bold ${getStatusColor(meta)}`}>
                        {meta.pontosAtual}/{meta.metaPontos} pontos ({progresso.toFixed(1)}%)
                      </span>
                    </div>
                    <Progress value={progresso} className="h-2" />
                  </div>

                  {/* Informações */}
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">Início:</span>
                      <div className="font-medium">
                        {new Date(meta.dataInicio).toLocaleDateString('pt-BR')}
                      </div>
                    </div>
                    <div>
                      <span className="text-gray-500">Fim:</span>
                      <div className="font-medium">
                        {new Date(meta.dataFim).toLocaleDateString('pt-BR')}
                      </div>
                    </div>
                  </div>

                  {/* Status e Equipe */}
                  <div className="flex items-center justify-between">
                    <Badge variant={statusBadge.variant}>
                      {statusBadge.text}
                    </Badge>
                    <div className="text-xs text-gray-500">
                      Criado por: {meta.criadoPor}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {metas.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <Target className="h-16 w-16 mx-auto mb-4 text-gray-400" />
            <h3 className="text-lg font-semibold text-gray-600 mb-2">
              Nenhuma meta criada ainda
            </h3>
            <p className="text-gray-500 mb-4">
              Crie sua primeira meta para começar a acompanhar o progresso da equipe
            </p>
            <Button 
              onClick={() => setShowForm(true)}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              Criar Primeira Meta
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Informações sobre o Sistema */}
      <Card className="border-l-4 border-l-blue-500 bg-blue-50">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
            <div>
              <h4 className="font-semibold text-gray-800 mb-2">Como funciona o Calendário de Metas</h4>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>• Cada grupo pode criar e gerenciar suas próprias metas</li>
                <li>• As metas são atualizadas automaticamente conforme as doações são registradas</li>
                <li>• Administradores podem visualizar todas as metas dos grupos</li>
                <li>• O progresso é calculado em tempo real baseado na pontuação das doações</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default GoalsCalendar

