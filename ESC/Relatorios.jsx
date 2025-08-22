import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { relatoriosAPI, equipesAPI } from '../lib/api';
import { BarChart3, Download, Calendar, Users, TrendingUp, DollarSign, Target, Activity } from 'lucide-react';

const Relatorios = () => {
  const [equipes, setEquipes] = useState([]);
  const [relatorioGeral, setRelatorioGeral] = useState(null);
  const [relatorioPeriodo, setRelatorioPeriodo] = useState(null);
  const [relatorioEquipe, setRelatorioEquipe] = useState(null);
  const [loading, setLoading] = useState(false);
  const [filtros, setFiltros] = useState({
    dataInicio: '',
    dataFim: '',
    equipeId: ''
  });
  const [error, setError] = useState('');

  useEffect(() => {
    fetchEquipes();
    fetchRelatorioGeral();
  }, []);

  const fetchEquipes = async () => {
    try {
      const response = await equipesAPI.getAll();
      setEquipes(response.data.data);
    } catch (error) {
      setError('Erro ao carregar equipes');
    }
  };

  const fetchRelatorioGeral = async () => {
    setLoading(true);
    try {
      const response = await relatoriosAPI.getGeral();
      setRelatorioGeral(response.data.data);
    } catch (error) {
      setError('Erro ao carregar relatório geral');
    } finally {
      setLoading(false);
    }
  };

  const fetchRelatorioPeriodo = async () => {
    if (!filtros.dataInicio || !filtros.dataFim) {
      setError('Por favor, selecione as datas de início e fim');
      return;
    }

    setLoading(true);
    try {
      const response = await relatoriosAPI.getPorPeriodo(filtros.dataInicio, filtros.dataFim);
      setRelatorioPeriodo(response.data.data);
      setError('');
    } catch (error) {
      setError('Erro ao carregar relatório por período');
    } finally {
      setLoading(false);
    }
  };

  const fetchRelatorioEquipe = async () => {
    if (!filtros.equipeId) {
      setError('Por favor, selecione uma equipe');
      return;
    }

    setLoading(true);
    try {
      const response = await relatoriosAPI.getPorEquipe(filtros.equipeId);
      setRelatorioEquipe(response.data.data);
      setError('');
    } catch (error) {
      setError('Erro ao carregar relatório da equipe');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value || 0);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const getEquipeNome = (idEquipe) => {
    const equipe = equipes.find(e => e.id_equipe === idEquipe);
    return equipe ? equipe.nome_equipe : 'N/A';
  };

  const StatCard = ({ title, value, icon: Icon, color = 'text-blue-600', bgColor = 'bg-blue-50' }) => (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-gray-600">
          {title}
        </CardTitle>
        <div className={`p-2 rounded-lg ${bgColor}`}>
          <Icon className={`h-4 w-4 ${color}`} />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-gray-900">
          {value}
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Relatórios</h1>
        <p className="text-gray-600 mt-2">
          Visualize estatísticas e relatórios do projeto Lideranças Empáticas.
        </p>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Relatório Geral */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <BarChart3 className="h-5 w-5 mr-2" />
            Relatório Geral
          </CardTitle>
          <CardDescription>
            Visão geral de todas as atividades e estatísticas do projeto.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading && !relatorioGeral ? (
            <div className="animate-pulse">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="h-24 bg-gray-200 rounded"></div>
                ))}
              </div>
            </div>
          ) : relatorioGeral ? (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard
                  title="Total de Atividades"
                  value={relatorioGeral.estatisticas.total_atividades}
                  icon={Activity}
                  color="text-green-600"
                  bgColor="bg-green-50"
                />
                <StatCard
                  title="Total Arrecadado"
                  value={formatCurrency(relatorioGeral.estatisticas.total_arrecadado)}
                  icon={TrendingUp}
                  color="text-purple-600"
                  bgColor="bg-purple-50"
                />
                <StatCard
                  title="Fundo Utilizado"
                  value={formatCurrency(relatorioGeral.estatisticas.total_fundo_utilizado)}
                  icon={DollarSign}
                  color="text-orange-600"
                  bgColor="bg-orange-50"
                />
                <StatCard
                  title="Saldo Líquido"
                  value={formatCurrency(
                    relatorioGeral.estatisticas.total_arrecadado - 
                    relatorioGeral.estatisticas.total_fundo_utilizado
                  )}
                  icon={Target}
                  color="text-blue-600"
                  bgColor="bg-blue-50"
                />
              </div>

              {relatorioGeral.atividades_recentes && relatorioGeral.atividades_recentes.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold mb-4">Atividades Recentes</h3>
                  <div className="space-y-3">
                    {relatorioGeral.atividades_recentes.slice(0, 5).map((atividade) => (
                      <div key={atividade.id_atividade} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2">
                            <Badge variant="secondary">
                              {getEquipeNome(atividade.id_equipe)}
                            </Badge>
                            <span className="text-sm text-gray-600">
                              {formatDate(atividade.data_atividade)}
                            </span>
                          </div>
                          <p className="text-sm text-gray-800 mt-1 truncate">
                            {atividade.descricao}
                          </p>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-medium text-green-600">
                            +{formatCurrency(atividade.valor_arrecadado)}
                          </div>
                          {atividade.valor_fundo_utilizado > 0 && (
                            <div className="text-sm text-orange-600">
                              -{formatCurrency(atividade.valor_fundo_utilizado)}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <p className="text-gray-600">Carregando relatório geral...</p>
          )}
        </CardContent>
      </Card>

      {/* Filtros para Relatórios Específicos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Relatório por Período */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Calendar className="h-5 w-5 mr-2" />
              Relatório por Período
            </CardTitle>
            <CardDescription>
              Filtre as atividades por período específico.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="dataInicio">Data de Início</Label>
                <Input
                  id="dataInicio"
                  type="date"
                  value={filtros.dataInicio}
                  onChange={(e) => setFiltros({...filtros, dataInicio: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="dataFim">Data de Fim</Label>
                <Input
                  id="dataFim"
                  type="date"
                  value={filtros.dataFim}
                  onChange={(e) => setFiltros({...filtros, dataFim: e.target.value})}
                />
              </div>
            </div>
            <Button onClick={fetchRelatorioPeriodo} disabled={loading} className="w-full">
              Gerar Relatório
            </Button>

            {relatorioPeriodo && (
              <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                <h4 className="font-semibold mb-2">Resultados do Período</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Atividades:</span>
                    <span className="font-medium">{relatorioPeriodo.estatisticas.total_atividades}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Total Arrecadado:</span>
                    <span className="font-medium text-green-600">
                      {formatCurrency(relatorioPeriodo.estatisticas.total_arrecadado)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Fundo Utilizado:</span>
                    <span className="font-medium text-orange-600">
                      {formatCurrency(relatorioPeriodo.estatisticas.total_fundo_utilizado)}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Relatório por Equipe */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Users className="h-5 w-5 mr-2" />
              Relatório por Equipe
            </CardTitle>
            <CardDescription>
              Visualize o desempenho de uma equipe específica.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="equipeId">Selecionar Equipe</Label>
              <Select
                value={filtros.equipeId}
                onValueChange={(value) => setFiltros({...filtros, equipeId: value})}
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
            <Button onClick={fetchRelatorioEquipe} disabled={loading} className="w-full">
              Gerar Relatório
            </Button>

            {relatorioEquipe && (
              <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                <h4 className="font-semibold mb-2">Desempenho da Equipe</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Meta:</span>
                    <span className="font-medium">
                      {formatCurrency(relatorioEquipe.equipe.meta_arrecadacao)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Arrecadado:</span>
                    <span className="font-medium text-green-600">
                      {formatCurrency(relatorioEquipe.estatisticas.total_arrecadado)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Progresso:</span>
                    <span className="font-medium">
                      {((relatorioEquipe.estatisticas.total_arrecadado / relatorioEquipe.equipe.meta_arrecadacao) * 100).toFixed(1)}%
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Atividades:</span>
                    <span className="font-medium">{relatorioEquipe.estatisticas.total_atividades}</span>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Relatorios;

