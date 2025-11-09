// 📦 Dependências
import axios from 'axios';

// ============================
// 🔧 CONFIGURAÇÃO BASE DA API
// ============================
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 segundos de timeout
});

// ============================
// ⚠️ INTERCEPTOR DE ERROS
// ============================
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('🚨 Erro na API:', error);

    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
    } else if (error.request) {
      console.error('Erro de rede:', error.request);
    } else {
      console.error('Erro de configuração:', error.message);
    }

    return Promise.reject(error);
  }
);

console.log('🌐 API Base URL:', API_BASE_URL);

// ============================
// 🧩 SERVIÇOS - EDIÇÕES
// ============================
export const edicoesService = {
  getAll: () => api.get('/edicoes'),
  getById: (id) => api.get(`/edicoes/${id}`),
  create: (data) => api.post('/edicoes', data),
  update: (id, data) => api.put(`/edicoes/${id}`, data),
  delete: (id) => api.delete(`/edicoes/${id}`),
};

// ============================
// 👥 SERVIÇOS - PARTICIPANTES
// ============================
export const participantesService = {
  getAll: () => api.get('/participantes'),
  getById: (id) => api.get(`/participantes/${id}`),
  getByTipo: (tipo) => api.get(`/participantes/tipo/${tipo}`),
  create: (data) => api.post('/participantes', data),
  update: (id, data) => api.put(`/participantes/${id}`, data),
  delete: (id) => api.delete(`/participantes/${id}`),
};

// ============================
// 🧑‍🤝‍🧑 SERVIÇOS - EQUIPES
// ============================
export const equipesService = {
  getAll: () => api.get('/equipes'),
  getById: (id) => api.get(`/equipes/${id}`),
  getByEdicao: (edicaoId) => api.get(`/equipes/edicao/${edicaoId}`),
  create: (data) => api.post('/equipes', data),
  update: (id, data) => api.put(`/equipes/${id}`, data),
  delete: (id) => api.delete(`/equipes/${id}`),
};

// ============================
// 🧾 SERVIÇOS - ATIVIDADES
// ============================
export const atividadesService = {
  getAll: () => api.get('/atividades'),
  getById: (id) => api.get(`/atividades/${id}`),
  getByEquipe: (equipeId) => api.get(`/atividades/equipe/${equipeId}`),
  getByTipo: (tipo) => api.get(`/atividades/tipo/${tipo}`),
  create: (data) => api.post('/atividades', data),
  update: (id, data) => api.put(`/atividades/${id}`, data),
  updateValor: (id, valor) =>
    api.patch(`/atividades/${id}/valor`, { valor_arrecadado: valor }),
  delete: (id) => api.delete(`/atividades/${id}`),
};

// ============================
// 🎁 SERVIÇOS - DOAÇÕES (atualizado)
// ============================
export const doacoesService = {
  getAll: () => api.get('/doacoes'),
  getById: (id) => api.get(`/doacoes/${id}`),
  getByEquipe: (id) => api.get(`/doacoes/equipe/${id}`),
  getStats: () => api.get('/doacoes/stats/resumo'),
  create: (data) => api.post('/doacoes', data),
  update: (id, data) => api.put(`/doacoes/${id}`, data),
  delete: (id) => api.delete(`/doacoes/${id}`),
};

// ============================
// 🎯 SERVIÇOS - METAS
// ============================
export const metasService = {
  getAll: () => api.get('/metas'),
  getById: (id) => api.get(`/metas/${id}`),
  getByEquipe: (equipe) => api.get(`/metas/equipe/${equipe}`),
  getByStatus: (status) => api.get(`/metas/status/${status}`),
  getByPeriodo: (inicio, fim) => api.get(`/metas/periodo/${inicio}/${fim}`),
  getStats: () => api.get('/metas/stats/geral'),
  create: (data) => api.post('/metas', data),
  update: (id, data) => api.put(`/metas/${id}`, data),
  updateStatus: (id, status) =>
    api.patch(`/metas/${id}/status`, { status }),
  delete: (id) => api.delete(`/metas/${id}`),
};

// ============================
// 📊 SERVIÇOS - RELATÓRIOS / GRÁFICOS
// ============================
export const relatoriosService = {
  getResumoDoacoes: () => api.get('/doacoes/stats/resumo'),
  getResumoMetas: () => api.get('/metas/stats/geral'),
};

// ============================
// 🧪 SERVIÇO DE TESTE
// ============================
export const testService = {
  test: () => api.get('/test'),
  info: () => api.get('/'),
};

// ============================
// 🚀 EXPORT DEFAULT
// ============================
export default api;
