import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Button } from '@/components/ui/button.jsx'
import { Input } from '@/components/ui/input.jsx'
import { Label } from '@/components/ui/label.jsx'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { Textarea } from '@/components/ui/textarea.jsx'
import { 
  Gift, 
  Plus, 
  Trophy, 
  Calendar,
  User,
  Package,
  DollarSign,
  CheckCircle,
  AlertCircle
} from 'lucide-react'
import inputsImage from '../assets/inputs.png'

const DonationSystem = ({ currentUser }) => {
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    data: new Date().toISOString().split('T')[0],
    alunoResponsavel: currentUser.nome,
    itemDoacao: '',
    campanha: '',
    doador: '',
    quantidade: '',
    observacoes: ''
  })

  // Sistema de pontuação conforme especificado
  const pontuacaoItens = {
    'arroz': { nome: 'Arroz', pontos: 1 },
    'feijao': { nome: 'Feijão', pontos: 2 },
    'acucar': { nome: 'Açúcar', pontos: 3 },
    'oleo': { nome: 'Óleo', pontos: 4 },
    'macarrao': { nome: 'Macarrão', pontos: 5 },
    'fuba': { nome: 'Fubá', pontos: 6 },
    'leite_po': { nome: 'Leite em Pó', pontos: 7 },
    'item_nao_listado': { nome: 'Item Não Listado', pontos: 8 },
    'dinheiro': { nome: 'Dinheiro', pontos: 9 }
  }

  // Dados simulados de doações registradas
  const [doacoes, setDoacoes] = useState([
    {
      id: 1,
      data: '2025-01-06',
      alunoResponsavel: 'João Silva',
      itemDoacao: 'arroz',
      campanha: 'Rifa - Camisa time',
      doador: 'Professor',
      quantidade: '2kg',
      pontos: 1,
      status: 'aprovado'
    },
    {
      id: 2,
      data: '2025-01-05',
      alunoResponsavel: 'Maria Santos',
      itemDoacao: 'oleo',
      campanha: 'Caixa FECAP',
      doador: 'Aluno FECAP',
      quantidade: '1L',
      pontos: 4,
      status: 'aprovado'
    },
    {
      id: 3,
      data: '2025-01-04',
      alunoResponsavel: 'Pedro Costa',
      itemDoacao: 'dinheiro',
      campanha: 'Caixa FECAP',
      doador: 'Professor',
      quantidade: 'R$ 25,00',
      pontos: 9,
      status: 'pendente'
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
    
    const novaDoacao = {
      id: Date.now(),
      ...formData,
      pontos: pontuacaoItens[formData.itemDoacao]?.pontos || 0,
      status: 'pendente'
    }
    
    setDoacoes(prev => [novaDoacao, ...prev])
    
    // Reset form
    setFormData({
      data: new Date().toISOString().split('T')[0],
      alunoResponsavel: currentUser.nome,
      itemDoacao: '',
      campanha: '',
      doador: '',
      quantidade: '',
      observacoes: ''
    })
    
    setShowForm(false)
  }

  const calcularPontuacaoTotal = () => {
    return doacoes
      .filter(doacao => doacao.status === 'aprovado')
      .reduce((total, doacao) => total + doacao.pontos, 0)
  }

  const calcularPontuacaoUsuario = () => {
    return doacoes
      .filter(doacao => doacao.alunoResponsavel === currentUser.nome && doacao.status === 'aprovado')
      .reduce((total, doacao) => total + doacao.pontos, 0)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-gray-800">Sistema de Doações</h2>
        <Button 
          onClick={() => setShowForm(true)}
          className="bg-green-600 hover:bg-green-700"
        >
          <Plus className="h-4 w-4 mr-2" />
          Nova Doação
        </Button>
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
          <CardContent className="p-4 text-center">
            <Trophy className="h-8 w-8 mx-auto mb-2" />
            <div className="text-2xl font-bold">{calcularPontuacaoUsuario()}</div>
            <div className="text-sm opacity-90">Meus Pontos</div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
          <CardContent className="p-4 text-center">
            <Gift className="h-8 w-8 mx-auto mb-2" />
            <div className="text-2xl font-bold">
              {doacoes.filter(d => d.alunoResponsavel === currentUser.nome).length}
            </div>
            <div className="text-sm opacity-90">Minhas Doações</div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
          <CardContent className="p-4 text-center">
            <Trophy className="h-8 w-8 mx-auto mb-2" />
            <div className="text-2xl font-bold">{calcularPontuacaoTotal()}</div>
            <div className="text-sm opacity-90">Total da Equipe</div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
          <CardContent className="p-4 text-center">
            <Package className="h-8 w-8 mx-auto mb-2" />
            <div className="text-2xl font-bold">{doacoes.length}</div>
            <div className="text-sm opacity-90">Total de Doações</div>
          </CardContent>
        </Card>
      </div>

      {/* Tabela de Pontuação */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5" />
            Tabela de Pontuação
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {Object.entries(pontuacaoItens).map(([key, item]) => (
              <div key={key} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="font-medium">{item.nome}</span>
                <Badge className="bg-yellow-100 text-yellow-800">
                  {item.pontos} pts
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Formulário de Nova Doação */}
      {showForm && (
        <Card className="border-2 border-green-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5" />
              Registrar Nova Doação
            </CardTitle>
          </CardHeader>
          <CardContent>
            {/* Imagem de referência */}
            <div className="mb-6">
              <img 
                src={inputsImage} 
                alt="Exemplo de formulário de doações" 
                className="w-full max-w-2xl mx-auto rounded-lg shadow-sm border"
              />
              <p className="text-sm text-gray-600 text-center mt-2">
                Exemplo de como preencher os dados de doação
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="data">Data da Doação</Label>
                  <Input
                    id="data"
                    type="date"
                    value={formData.data}
                    onChange={(e) => handleInputChange('data', e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="alunoResponsavel">Aluno Responsável</Label>
                  <Input
                    id="alunoResponsavel"
                    value={formData.alunoResponsavel}
                    onChange={(e) => handleInputChange('alunoResponsavel', e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="itemDoacao">Item de Doação</Label>
                  <Select onValueChange={(value) => handleInputChange('itemDoacao', value)} required>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o item" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(pontuacaoItens).map(([key, item]) => (
                        <SelectItem key={key} value={key}>
                          {item.nome} ({item.pontos} pts)
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="campanha">Campanha</Label>
                  <Select onValueChange={(value) => handleInputChange('campanha', value)} required>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione a campanha" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="rifa_camisa">Rifa - Camisa time</SelectItem>
                      <SelectItem value="caixa_fecap">Caixa FECAP</SelectItem>
                      <SelectItem value="arrecadacao_geral">Arrecadação Geral</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="doador">Doador</Label>
                  <Select onValueChange={(value) => handleInputChange('doador', value)} required>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o tipo de doador" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="professor">Professor</SelectItem>
                      <SelectItem value="aluno_fecap">Aluno FECAP</SelectItem>
                      <SelectItem value="funcionario">Funcionário</SelectItem>
                      <SelectItem value="externo">Pessoa Externa</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="quantidade">Quantidade</Label>
                  <Input
                    id="quantidade"
                    placeholder="Ex: 2kg, 1L, R$ 50,00"
                    value={formData.quantidade}
                    onChange={(e) => handleInputChange('quantidade', e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="observacoes">Observações (opcional)</Label>
                <Textarea
                  id="observacoes"
                  placeholder="Informações adicionais sobre a doação"
                  value={formData.observacoes}
                  onChange={(e) => handleInputChange('observacoes', e.target.value)}
                  rows={3}
                />
              </div>

              {formData.itemDoacao && (
                <div className="p-4 bg-green-50 rounded-lg">
                  <div className="flex items-center gap-2 text-green-800">
                    <Trophy className="h-4 w-4" />
                    <span className="font-medium">
                      Esta doação valerá {pontuacaoItens[formData.itemDoacao]?.pontos} pontos
                    </span>
                  </div>
                </div>
              )}

              <div className="flex gap-3">
                <Button type="submit" className="bg-green-600 hover:bg-green-700">
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Registrar Doação
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setShowForm(false)}
                >
                  Cancelar
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Lista de Doações */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Gift className="h-5 w-5" />
            Doações Registradas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {doacoes.map((doacao) => (
              <div key={doacao.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h4 className="font-semibold text-gray-800">
                      {pontuacaoItens[doacao.itemDoacao]?.nome}
                    </h4>
                    <Badge 
                      variant={doacao.status === 'aprovado' ? 'default' : 'secondary'}
                      className="text-xs"
                    >
                      {doacao.status === 'aprovado' ? 'Aprovado' : 'Pendente'}
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {new Date(doacao.data).toLocaleDateString('pt-BR')}
                    </div>
                    <div className="flex items-center gap-1">
                      <User className="h-3 w-3" />
                      {doacao.alunoResponsavel}
                    </div>
                    <div className="flex items-center gap-1">
                      <Package className="h-3 w-3" />
                      {doacao.quantidade}
                    </div>
                    <div className="flex items-center gap-1">
                      <Gift className="h-3 w-3" />
                      {doacao.campanha}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 ml-4">
                  <Badge className="bg-yellow-100 text-yellow-800">
                    +{doacao.pontos} pts
                  </Badge>
                  {doacao.status === 'aprovado' ? (
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  ) : (
                    <AlertCircle className="h-5 w-5 text-yellow-600" />
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default DonationSystem

