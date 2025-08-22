import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { equipesAPI, edicoesAPI } from '../lib/api';
import { Plus, Edit, Trash2, Users, Target, DollarSign } from 'lucide-react';

const Equipes = () => {
  const [equipes, setEquipes] = useState([]);
  const [edicoes, setEdicoes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingEquipe, setEditingEquipe] = useState(null);
  const [formData, setFormData] = useState({
    nome_equipe: '',
    id_edicao: '',
    meta_arrecadacao: '',
    fundo_inicial: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [equipesResponse, edicoesResponse] = await Promise.all([
        equipesAPI.getAll(),
        edicoesAPI.getAll()
      ]);
      setEquipes(equipesResponse.data.data);
      setEdicoes(edicoesResponse.data.data);
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
        meta_arrecadacao: parseFloat(formData.meta_arrecadacao),
        fundo_inicial: parseFloat(formData.fundo_inicial)
      };

      if (editingEquipe) {
        await equipesAPI.update(editingEquipe.id_equipe, dataToSend);
        setSuccess('Equipe atualizada com sucesso!');
      } else {
        await equipesAPI.create(dataToSend);
        setSuccess('Equipe criada com sucesso!');
      }
      
      fetchData();
      handleCloseDialog();
    } catch (error) {
      setError(error.response?.data?.message || 'Erro ao salvar equipe');
    }
  };

  const handleEdit = (equipe) => {
    setEditingEquipe(equipe);
    setFormData({
      nome_equipe: equipe.nome_equipe,
      id_edicao: equipe.id_edicao.toString(),
      meta_arrecadacao: equipe.meta_arrecadacao.toString(),
      fundo_inicial: equipe.fundo_inicial.toString()
    });
    setDialogOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Tem certeza que deseja deletar esta equipe?')) {
      try {
        await equipesAPI.delete(id);
        setSuccess('Equipe deletada com sucesso!');
        fetchData();
      } catch (error) {
        setError(error.response?.data?.message || 'Erro ao deletar equipe');
      }
    }
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingEquipe(null);
    setFormData({
      nome_equipe: '',
      id_edicao: '',
      meta_arrecadacao: '',
      fundo_inicial: ''
    });
    setError('');
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const getEdicaoNome = (idEdicao) => {
    const edicao = edicoes.find(e => e.id_edicao === idEdicao);
    return edicao ? edicao.nome_edicao : 'N/A';
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-64 bg-gray-200 rounded"></div>
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
          <h1 className="text-3xl font-bold text-gray-900">Gerenciamento de Equipes</h1>
          <p className="text-gray-600 mt-2">
            Gerencie as equipes participantes do projeto Lideranças Empáticas.
          </p>
        </div>

        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Nova Equipe
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>
                {editingEquipe ? 'Editar Equipe' : 'Nova Equipe'}
              </DialogTitle>
              <DialogDescription>
                {editingEquipe 
                  ? 'Atualize as informações da equipe.' 
                  : 'Preencha os dados para criar uma nova equipe.'
                }
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="nome_equipe">Nome da Equipe</Label>
                <Input
                  id="nome_equipe"
                  value={formData.nome_equipe}
                  onChange={(e) => setFormData({...formData, nome_equipe: e.target.value})}
                  placeholder="Ex: Equipe Alpha"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="id_edicao">Edição</Label>
                <Select
                  value={formData.id_edicao}
                  onValueChange={(value) => setFormData({...formData, id_edicao: value})}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione uma edição" />
                  </SelectTrigger>
                  <SelectContent>
                    {edicoes.map((edicao) => (
                      <SelectItem key={edicao.id_edicao} value={edicao.id_edicao.toString()}>
                        {edicao.nome_edicao}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="meta_arrecadacao">Meta de Arrecadação (R$)</Label>
                <Input
                  id="meta_arrecadacao"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.meta_arrecadacao}
                  onChange={(e) => setFormData({...formData, meta_arrecadacao: e.target.value})}
                  placeholder="0.00"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="fundo_inicial">Fundo Inicial (R$)</Label>
                <Input
                  id="fundo_inicial"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.fundo_inicial}
                  onChange={(e) => setFormData({...formData, fundo_inicial: e.target.value})}
                  placeholder="0.00"
                  required
                />
              </div>

              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={handleCloseDialog}>
                  Cancelar
                </Button>
                <Button type="submit">
                  {editingEquipe ? 'Atualizar' : 'Criar'}
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
        {equipes.map((equipe) => (
          <Card key={equipe.id_equipe} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center">
                  <Users className="h-5 w-5 mr-2 text-blue-600" />
                  {equipe.nome_equipe}
                </span>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(equipe)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(equipe.id_equipe)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardTitle>
              <CardDescription>
                Edição: {getEdicaoNome(equipe.id_edicao)}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="flex items-center text-sm text-gray-600">
                    <Target className="h-4 w-4 mr-2" />
                    Meta:
                  </span>
                  <span className="font-medium text-green-600">
                    {formatCurrency(equipe.meta_arrecadacao)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center text-sm text-gray-600">
                    <DollarSign className="h-4 w-4 mr-2" />
                    Fundo:
                  </span>
                  <span className="font-medium text-blue-600">
                    {formatCurrency(equipe.fundo_inicial)}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {equipes.length === 0 && !loading && (
        <div className="text-center py-12">
          <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Nenhuma equipe encontrada
          </h3>
          <p className="text-gray-600 mb-4">
            Comece criando a primeira equipe do projeto.
          </p>
          <Button onClick={() => setDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Criar Primeira Equipe
          </Button>
        </div>
      )}
    </div>
  );
};

export default Equipes;

