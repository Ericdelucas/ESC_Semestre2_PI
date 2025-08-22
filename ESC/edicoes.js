const express = require('express');
const router = express.Router();
const { 
    getAllEdicoes, 
    getEdicaoById, 
    createEdicao, 
    updateEdicao, 
    deleteEdicao 
} = require('../controllers/edicaoController');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

// Rota para listar todas as edições (protegida)
router.get('/', authenticateToken, getAllEdicoes);

// Rota para obter edição por ID (protegida)
router.get('/:id', authenticateToken, getEdicaoById);

// Rota para criar nova edição (apenas administradores)
router.post('/', authenticateToken, requireAdmin, createEdicao);

// Rota para atualizar edição (apenas administradores)
router.put('/:id', authenticateToken, requireAdmin, updateEdicao);

// Rota para deletar edição (apenas administradores)
router.delete('/:id', authenticateToken, requireAdmin, deleteEdicao);

module.exports = router;

