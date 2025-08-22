import axios from 'axios';

const API_BASE_URL = 'http://localhost:3001/api';

// Criar instância do axios
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para adicionar token de autenticação
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para lidar com respostas
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Token expirado ou inválido
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Funções de autenticação
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  getProfile: () => api.get('/auth/profile'),
};

// Funções para edições
export const edicoesAPI = {
  getAll: () => api.get('/edicoes'),
  getById: (id) => api.get(`/edicoes/${id}`),
  create: (data) => api.post('/edicoes', data),
  update: (id, data) => api.put(`/edicoes/${id}`, data),
  delete: (id) => api.delete(`/edicoes/${id}`),
};

// Funções para equipes
export const equipesAPI = {
  getAll: () => api.get('/equipes'),
  getById: (id) => api.get(`/equipes/${id}`),
  create: (data) => api.post('/equipes', data),
  update: (id, data) => api.put(`/equipes/${id}`, data),
  delete: (id) => api.delete(`/equipes/${id}`),
};

// Funções para tipos de atividade
export const tiposAtividadeAPI = {
  getAll: () => api.get('/tipos-atividade'),
  getById: (id) => api.get(`/tipos-atividade/${id}`),
  create: (data) => api.post('/tipos-atividade', data),
  update: (id, data) => api.put(`/tipos-atividade/${id}`, data),
  delete: (id) => api.delete(`/tipos-atividade/${id}`),
};

// Funções para atividades
export const atividadesAPI = {
  getAll: () => api.get('/atividades'),
  getById: (id) => api.get(`/atividades/${id}`),
  getByEquipe: (equipeId) => api.get(`/atividades/equipe/${equipeId}`),
  create: (data) => api.post('/atividades', data),
  update: (id, data) => api.put(`/atividades/${id}`, data),
  delete: (id) => api.delete(`/atividades/${id}`),
};

// Funções para relatórios
export const relatoriosAPI = {
  getGeral: () => api.get('/relatorios/geral'),
  getPorPeriodo: (dataInicio, dataFim) => 
    api.get(`/relatorios/periodo?data_inicio=${dataInicio}&data_fim=${dataFim}`),
  getPorEquipe: (equipeId) => api.get(`/relatorios/equipe/${equipeId}`),
  getPorEquipeEPeriodo: (equipeId, dataInicio, dataFim) => 
    api.get(`/relatorios/equipe/${equipeId}/periodo?data_inicio=${dataInicio}&data_fim=${dataFim}`),
};

export default api;

