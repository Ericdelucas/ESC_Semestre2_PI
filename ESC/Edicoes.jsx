import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { edicoesAPI } from '../lib/api';
import { Plus, Edit, Trash2, Calendar } from 'lucide-react';

const Edicoes = () => {
  const [edicoes, setEdicoes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingEdicao, setEditingEdicao] = useState(null);
  const [formData, setFormData] = useState({
    nome_edicao: '',
    data_inicio: '',
    data_fim: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchEdicoes();
  }, []);

  const fetchEdicoes = async () => {
    try {
      const response = await edicoesAPI.getAll();
      setEdicoes(response.data.data);
    } catch (error) {
      setError('Erro ao carregar edições');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      if (editingEdicao) {
        await edicoesAPI.update(editingEdicao.id_edicao, formData);
        setSuccess('Edição atualizada com sucesso!');
      } else {
        await edicoesAPI.create(formData);
        setSuccess('Edição criada com sucesso!');
      }
      
      fetchEdicoes();
      handleCloseDialog();
    } catch (error) {
      setError(error.response?.data?.message || 'Erro ao salvar edição');
    }
  };

  const handleEdit = (edicao) => {
    setEditingEdicao(edicao);
    setFormData({
      nome_edicao: edicao.nome_edicao,
      data_inicio: edicao.data_inicio,
      data_fim: edicao.data_fim
    });
    setDialogOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Tem certeza que deseja deletar esta edição?')) {
      try {
        await edicoesAPI.delete(id);
        setSuccess('Edição deletada com sucesso!');
        fetchEdicoes();
      } catch (error) {
        setError(error.response?.data?.message || 'Erro ao deletar edição');
      }
    }
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingEdicao(null);
    setFormData({
      nome_edicao: '',
      data_inicio: '',
      data_fim: ''
    });
    setError('');
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-48 bg-gray-200 rounded"></div>
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
          <h1 className="text-3xl font-bold text-gray-900">Gerenciamento de Edições</h1>
          <p className="text-gray-600 mt-2">
            Gerencie as edições do projeto Lideranças Empáticas.
          </p>
        </div>

        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Nova Edição
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingEdicao ? 'Editar Edição' : 'Nova Edição'}
              </DialogTitle>
              <DialogDescription>
                {editingEdicao 
                  ? 'Atualize as informações da edição.' 
                  : 'Preencha os dados para criar uma nova edição.'
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
                <Label htmlFor="nome_edicao">Nome da Edição</Label>
                <Input
                  id="nome_edicao"
                  value={formData.nome_edicao}
                  onChange={(e) => setFormData({...formData, nome_edicao: e.target.value})}
                  placeholder="Ex: Edição 2025.1"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="data_inicio">Data de Início</Label>
                <Input
                  id="data_inicio"
                  type="date"
                  value={formData.data_inicio}
                  onChange={(e) => setFormData({...formData, data_inicio: e.target.value})}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="data_fim">Data de Fim</Label>
                <Input
                  id="data_fim"
                  type="date"
                  value={formData.data_fim}
                  onChange={(e) => setFormData({...formData, data_fim: e.target.value})}
                  required
                />
              </div>

              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={handleCloseDialog}>
                  Cancelar
                </Button>
                <Button type="submit">
                  {editingEdicao ? 'Atualizar' : 'Criar'}
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
        {edicoes.map((edicao) => (
          <Card key={edicao.id_edicao} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center">
                  <Calendar className="h-5 w-5 mr-2 text-blue-600" />
                  {edicao.nome_edicao}
                </span>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(edicao)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(edicao.id_edicao)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Início:</span>
                  <span className="font-medium">{formatDate(edicao.data_inicio)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Fim:</span>
                  <span className="font-medium">{formatDate(edicao.data_fim)}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {edicoes.length === 0 && !loading && (
        <div className="text-center py-12">
          <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Nenhuma edição encontrada
          </h3>
          <p className="text-gray-600 mb-4">
            Comece criando a primeira edição do projeto.
          </p>
          <Button onClick={() => setDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Criar Primeira Edição
          </Button>
        </div>
      )}
    </div>
  );
};

export default Edicoes;

