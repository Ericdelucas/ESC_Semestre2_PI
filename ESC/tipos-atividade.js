const express = require('express');
const router = express.Router();
const { 
    getAllTiposAtividade, 
    getTipoAtividadeById, 
    createTipoAtividade, 
    updateTipoAtividade, 
    deleteTipoAtividade 
} = require('../controllers/tipoAtividadeController');
const { authenticateToken } = require('../middleware/auth');

// Rota para listar todos os tipos de atividade (protegida)
router.get('/', authenticateToken, getAllTiposAtividade);

// Rota para obter tipo de atividade por ID (protegida)
router.get('/:id', authenticateToken, getTipoAtividadeById);

// Rota para criar novo tipo de atividade (protegida)
router.post('/', authenticateToken, createTipoAtividade);

// Rota para atualizar tipo de atividade (protegida)
router.put('/:id', authenticateToken, updateTipoAtividade);

// Rota para deletar tipo de atividade (protegida)
router.delete('/:id', authenticateToken, deleteTipoAtividade);

module.exports = router;

