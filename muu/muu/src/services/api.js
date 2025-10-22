import axios from 'axios';

// Configuração base da API
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 segundos de timeout
});

// Interceptor para tratamento de erros
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('Erro na API:', error);
    
    // Tratamento específico para diferentes tipos de erro
    if (error.response) {
      // Erro de resposta do servidor
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
    } else if (error.request) {
      // Erro de rede
      console.error('Erro de rede:', error.request);
    } else {
      // Erro de configuração
      console.error('Erro de configuração:', error.message);
    }
    
    return Promise.reject(error);
  }
);

// Log da URL da API para debug
console.log('API Base URL:', API_BASE_URL);

// Serviços para Edições
export const edicoesService = {
  getAll: () => api.get('/edicoes'),
  getById: (id) => api.get(`/edicoes/${id}`),
  create: (data) => api.post('/edicoes', data),
  update: (id, data) => api.put(`/edicoes/${id}`, data),
  delete: (id) => api.delete(`/edicoes/${id}`),
};

// Serviços para Participantes
export const participantesService = {
  getAll: () => api.get('/participantes'),
  getById: (id) => api.get(`/participantes/${id}`),
  getByTipo: (tipo) => api.get(`/participantes/tipo/${tipo}`),
  create: (data) => api.post('/participantes', data),
  update: (id, data) => api.put(`/participantes/${id}`, data),
  delete: (id) => api.delete(`/participantes/${id}`),
};

// Serviços para Equipes
export const equipesService = {
  getAll: () => api.get('/equipes'),
  getById: (id) => api.get(`/equipes/${id}`),
  getByEdicao: (edicaoId) => api.get(`/equipes/edicao/${edicaoId}`),
  create: (data) => api.post('/equipes', data),
  update: (id, data) => api.put(`/equipes/${id}`, data),
  delete: (id) => api.delete(`/equipes/${id}`),
};

// Serviços para Atividades
export const atividadesService = {
  getAll: () => api.get('/atividades'),
  getById: (id) => api.get(`/atividades/${id}`),
  getByEquipe: (equipeId) => api.get(`/atividades/equipe/${equipeId}`),
  getByTipo: (tipo) => api.get(`/atividades/tipo/${tipo}`),
  create: (data) => api.post('/atividades', data),
  update: (id, data) => api.put(`/atividades/${id}`, data),
  updateValor: (id, valor) => api.patch(`/atividades/${id}/valor`, { valor_arrecadado: valor }),
  delete: (id) => api.delete(`/atividades/${id}`),
};

// Serviços para Doações
export const doacoesService = {
  getAll: () => api.get('/doacoes'),
  getById: (id) => api.get(`/doacoes/${id}`),
  getByAluno: (aluno) => api.get(`/doacoes/aluno/${aluno}`),
  getByItem: (item) => api.get(`/doacoes/item/${item}`),
  getByPeriodo: (inicio, fim) => api.get(`/doacoes/periodo/${inicio}/${fim}`),
  getStats: () => api.get('/doacoes/stats/geral'),
  create: (data) => api.post('/doacoes', data),
  update: (id, data) => api.put(`/doacoes/${id}`, data),
  delete: (id) => api.delete(`/doacoes/${id}`),
};

// Serviços para Metas
export const metasService = {
  getAll: () => api.get('/metas'),
  getById: (id) => api.get(`/metas/${id}`),
  getByEquipe: (equipe) => api.get(`/metas/equipe/${equipe}`),
  getByStatus: (status) => api.get(`/metas/status/${status}`),
  getByPeriodo: (inicio, fim) => api.get(`/metas/periodo/${inicio}/${fim}`),
  getStats: () => api.get('/metas/stats/geral'),
  create: (data) => api.post('/metas', data),
  update: (id, data) => api.put(`/metas/${id}`, data),
  updateStatus: (id, status) => api.patch(`/metas/${id}/status`, { status }),
  delete: (id) => api.delete(`/metas/${id}`),
};

// Serviço de teste
export const testService = {
  test: () => api.get('/test'),
  info: () => api.get('/'),
};

export default api;

