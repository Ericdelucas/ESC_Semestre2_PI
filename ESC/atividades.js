const express = require('express');
const router = express.Router();
const { 
    getAllAtividades, 
    getAtividadeById, 
    getAtividadesByEquipe,
    createAtividade, 
    updateAtividade, 
    deleteAtividade 
} = require('../controllers/atividadeController');
const { authenticateToken } = require('../middleware/auth');

// Rota para listar todas as atividades (protegida)
router.get('/', authenticateToken, getAllAtividades);

// Rota para listar atividades por equipe (protegida)
router.get('/equipe/:equipeId', authenticateToken, getAtividadesByEquipe);

// Rota para obter atividade por ID (protegida)
router.get('/:id', authenticateToken, getAtividadeById);

// Rota para criar nova atividade (protegida)
router.post('/', authenticateToken, createAtividade);

// Rota para atualizar atividade (protegida)
router.put('/:id', authenticateToken, updateAtividade);

// Rota para deletar atividade (protegida)
router.delete('/:id', authenticateToken, deleteAtividade);

module.exports = router;

