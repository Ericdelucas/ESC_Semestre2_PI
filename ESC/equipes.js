const express = require('express');
const router = express.Router();
const { 
    getAllEquipes, 
    getEquipeById, 
    createEquipe, 
    updateEquipe, 
    deleteEquipe 
} = require('../controllers/equipeController');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

// Rota para listar todas as equipes (protegida)
router.get('/', authenticateToken, getAllEquipes);

// Rota para obter equipe por ID (protegida)
router.get('/:id', authenticateToken, getEquipeById);

// Rota para criar nova equipe (apenas administradores)
router.post('/', authenticateToken, requireAdmin, createEquipe);

// Rota para atualizar equipe (apenas administradores)
router.put('/:id', authenticateToken, requireAdmin, updateEquipe);

// Rota para deletar equipe (apenas administradores)
router.delete('/:id', authenticateToken, requireAdmin, deleteEquipe);

module.exports = router;

