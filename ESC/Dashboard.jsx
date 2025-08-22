import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '../contexts/AuthContext';
import { relatoriosAPI, equipesAPI, atividadesAPI } from '../lib/api';
import { Users, Activity, Calendar, TrendingUp } from 'lucide-react';

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalEquipes: 0,
    totalAtividades: 0,
    totalArrecadado: 0,
    totalFundoUtilizado: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [relatorioResponse, equipesResponse] = await Promise.all([
          relatoriosAPI.getGeral(),
          equipesAPI.getAll()
        ]);

        const relatorio = relatorioResponse.data.data;
        const equipes = equipesResponse.data.data;

        setStats({
          totalEquipes: equipes.length,
          totalAtividades: relatorio.estatisticas.total_atividades,
          totalArrecadado: relatorio.estatisticas.total_arrecadado,
          totalFundoUtilizado: relatorio.estatisticas.total_fundo_utilizado
        });
      } catch (error) {
        console.error('Erro ao carregar estatísticas:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const statsCards = [
    {
      title: 'Total de Equipes',
      value: stats.totalEquipes,
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      title: 'Total de Atividades',
      value: stats.totalAtividades,
      icon: Activity,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      title: 'Total Arrecadado',
      value: formatCurrency(stats.totalArrecadado),
      icon: TrendingUp,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    },
    {
      title: 'Fundo Utilizado',
      value: formatCurrency(stats.totalFundoUtilizado),
      icon: Calendar,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50'
    }
  ];

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          Bem-vindo, {user?.nome}!
        </h1>
        <p className="text-gray-600 mt-2">
          Aqui está um resumo das atividades do projeto Lideranças Empáticas.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsCards.map((card, index) => {
          const Icon = card.icon;
          return (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">
                  {card.title}
                </CardTitle>
                <div className={`p-2 rounded-lg ${card.bgColor}`}>
                  <Icon className={`h-4 w-4 ${card.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900">
                  {card.value}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Visão Geral do Sistema</CardTitle>
            <CardDescription>
              Informações sobre o projeto Lideranças Empáticas
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-sm text-gray-600">
              <p className="mb-2">
                <strong>Objetivo:</strong> Gerenciar as edições do projeto Lideranças Empáticas, 
                controlando equipes, atividades, metas e resultados.
              </p>
              <p className="mb-2">
                <strong>Seu perfil:</strong> {user?.perfil}
              </p>
              <p>
                <strong>Funcionalidades disponíveis:</strong> Baseadas no seu nível de acesso, 
                você pode visualizar e gerenciar diferentes aspectos do projeto.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Ações Rápidas</CardTitle>
            <CardDescription>
              Links para as principais funcionalidades
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-1 gap-2">
              <a
                href="/equipes"
                className="flex items-center p-3 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
              >
                <Users className="h-5 w-5 text-blue-600 mr-3" />
                <span className="text-sm font-medium text-blue-700">
                  Gerenciar Equipes
                </span>
              </a>
              <a
                href="/atividades"
                className="flex items-center p-3 bg-green-50 hover:bg-green-100 rounded-lg transition-colors"
              >
                <Activity className="h-5 w-5 text-green-600 mr-3" />
                <span className="text-sm font-medium text-green-700">
                  Ver Atividades
                </span>
              </a>
              <a
                href="/relatorios"
                className="flex items-center p-3 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors"
              >
                <TrendingUp className="h-5 w-5 text-purple-600 mr-3" />
                <span className="text-sm font-medium text-purple-700">
                  Relatórios
                </span>
              </a>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;

