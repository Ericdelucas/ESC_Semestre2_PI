import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { atividadesAPI, equipesAPI, tiposAtividadeAPI } from '../lib/api';
import { Plus, Edit, Trash2, Activity, Calendar, DollarSign, Target } from 'lucide-react';

const Atividades = () => {
  const [atividades, setAtividades] = useState([]);
  const [equipes, setEquipes] = useState([]);
  const [tiposAtividade, setTiposAtividade] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingAtividade, setEditingAtividade] = useState(null);
  const [formData, setFormData] = useState({
    id_equipe: '',
    id_tipo_atividade: '',
    descricao: '',
    data_atividade: '',
    valor_arrecadado: '',
    valor_fundo_utilizado: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [atividadesResponse, equipesResponse, tiposResponse] = await Promise.all([
        atividadesAPI.getAll(),
        equipesAPI.getAll(),
        tiposAtividadeAPI.getAll()
      ]);
      setAtividades(atividadesResponse.data.data);
      setEquipes(equipesResponse.data.data);
      setTiposAtividade(tiposResponse.data.data);
    } catch (error) {
      setError('Erro ao carregar dados');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const dataToSend = {
        ...formData,
        id_equipe: parseInt(formData.id_equipe),
        id_tipo_atividade: parseInt(formData.id_tipo_atividade),
        valor_arrecadado: parseFloat(formData.valor_arrecadado || 0),
        valor_fundo_utilizado: parseFloat(formData.valor_fundo_utilizado || 0)
      };

      if (editingAtividade) {
        await atividadesAPI.update(editingAtividade.id_atividade, dataToSend);
        setSuccess('Atividade atualizada com sucesso!');
      } else {
        await atividadesAPI.create(dataToSend);
        setSuccess('Atividade criada com sucesso!');
      }
      
      fetchData();
      handleCloseDialog();
    } catch (error) {
      setError(error.response?.data?.message || 'Erro ao salvar atividade');
    }
  };

  const handleEdit = (atividade) => {
    setEditingAtividade(atividade);
    setFormData({
      id_equipe: atividade.id_equipe.toString(),
      id_tipo_atividade: atividade.id_tipo_atividade.toString(),
      descricao: atividade.descricao,
      data_atividade: atividade.data_atividade,
      valor_arrecadado: atividade.valor_arrecadado.toString(),
      valor_fundo_utilizado: atividade.valor_fundo_utilizado.toString()
    });
    setDialogOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Tem certeza que deseja deletar esta atividade?')) {
      try {
        await atividadesAPI.delete(id);
        setSuccess('Atividade deletada com sucesso!');
        fetchData();
      } catch (error) {
        setError(error.response?.data?.message || 'Erro ao deletar atividade');
      }
    }
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingAtividade(null);
    setFormData({
      id_equipe: '',
      id_tipo_atividade: '',
      descricao: '',
      data_atividade: '',
      valor_arrecadado: '',
      valor_fundo_utilizado: ''
    });
    setError('');
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const getEquipeNome = (idEquipe) => {
    const equipe = equipes.find(e => e.id_equipe === idEquipe);
    return equipe ? equipe.nome_equipe : 'N/A';
  };

  const getTipoAtividadeNome = (idTipo) => {
    const tipo = tiposAtividade.find(t => t.id_tipo_atividade === idTipo);
    return tipo ? tipo.nome_tipo : 'N/A';
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-80 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gerenciamento de Atividades</h1>
          <p className="text-gray-600 mt-2">
            Gerencie as atividades realizadas pelas equipes.
          </p>
        </div>

        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Nova Atividade
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>
                {editingAtividade ? 'Editar Atividade' : 'Nova Atividade'}
              </DialogTitle>
              <DialogDescription>
                {editingAtividade 
                  ? 'Atualize as informações da atividade.' 
                  : 'Preencha os dados para criar uma nova atividade.'
                }
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="id_equipe">Equipe</Label>
                  <Select
                    value={formData.id_equipe}
                    onValueChange={(value) => setFormData({...formData, id_equipe: value})}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione uma equipe" />
                    </SelectTrigger>
                    <SelectContent>
                      {equipes.map((equipe) => (
                        <SelectItem key={equipe.id_equipe} value={equipe.id_equipe.toString()}>
                          {equipe.nome_equipe}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="id_tipo_atividade">Tipo de Atividade</Label>
                  <Select
                    value={formData.id_tipo_atividade}
                    onValueChange={(value) => setFormData({...formData, id_tipo_atividade: value})}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      {tiposAtividade.map((tipo) => (
                        <SelectItem key={tipo.id_tipo_atividade} value={tipo.id_tipo_atividade.toString()}>
                          {tipo.nome_tipo}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="descricao">Descrição</Label>
                <Textarea
                  id="descricao"
                  value={formData.descricao}
                  onChange={(e) => setFormData({...formData, descricao: e.target.value})}
                  placeholder="Descreva a atividade realizada..."
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="data_atividade">Data da Atividade</Label>
                <Input
                  id="data_atividade"
                  type="date"
                  value={formData.data_atividade}
                  onChange={(e) => setFormData({...formData, data_atividade: e.target.value})}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="valor_arrecadado">Valor Arrecadado (R$)</Label>
                  <Input
                    id="valor_arrecadado"
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.valor_arrecadado}
                    onChange={(e) => setFormData({...formData, valor_arrecadado: e.target.value})}
                    placeholder="0.00"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="valor_fundo_utilizado">Fundo Utilizado (R$)</Label>
                  <Input
                    id="valor_fundo_utilizado"
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.valor_fundo_utilizado}
                    onChange={(e) => setFormData({...formData, valor_fundo_utilizado: e.target.value})}
                    placeholder="0.00"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={handleCloseDialog}>
                  Cancelar
                </Button>
                <Button type="submit">
                  {editingAtividade ? 'Atualizar' : 'Criar'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {success && (
        <Alert className="border-green-200 bg-green-50 text-green-800">
          <AlertDescription>{success}</AlertDescription>
        </Alert>
      )}

      {error && !dialogOpen && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {atividades.map((atividade) => (
          <Card key={atividade.id_atividade} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center">
                  <Activity className="h-5 w-5 mr-2 text-blue-600" />
                  <span className="truncate">
                    {getTipoAtividadeNome(atividade.id_tipo_atividade)}
                  </span>
                </span>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(atividade)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(atividade.id_atividade)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardTitle>
              <CardDescription>
                <Badge variant="secondary" className="mr-2">
                  {getEquipeNome(atividade.id_equipe)}
                </Badge>
                <span className="flex items-center text-sm text-gray-600 mt-1">
                  <Calendar className="h-4 w-4 mr-1" />
                  {formatDate(atividade.data_atividade)}
                </span>
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <p className="text-sm text-gray-700 line-clamp-3">
                  {atividade.descricao}
                </p>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center text-sm text-gray-600">
                      <Target className="h-4 w-4 mr-2 text-green-600" />
                      Arrecadado:
                    </span>
                    <span className="font-medium text-green-600">
                      {formatCurrency(atividade.valor_arrecadado)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="flex items-center text-sm text-gray-600">
                      <DollarSign className="h-4 w-4 mr-2 text-orange-600" />
                      Fundo Usado:
                    </span>
                    <span className="font-medium text-orange-600">
                      {formatCurrency(atividade.valor_fundo_utilizado)}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {atividades.length === 0 && !loading && (
        <div className="text-center py-12">
          <Activity className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Nenhuma atividade encontrada
          </h3>
          <p className="text-gray-600 mb-4">
            Comece registrando a primeira atividade.
          </p>
          <Button onClick={() => setDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Registrar Primeira Atividade
          </Button>
        </div>
      )}
    </div>
  );
};

export default Atividades;

