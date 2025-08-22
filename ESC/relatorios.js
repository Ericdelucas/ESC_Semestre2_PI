const express = require('express');
const router = express.Router();
const { 
    getRelatorioGeral, 
    getRelatorioPorPeriodo, 
    getRelatorioPorEquipe, 
    getRelatorioPorEquipeEPeriodo 
} = require('../controllers/relatorioController');
const { authenticateToken } = require('../middleware/auth');

// Rota para relatório geral de atividades (protegida)
router.get('/geral', authenticateToken, getRelatorioGeral);

// Rota para relatório por período (protegida)
router.get('/periodo', authenticateToken, getRelatorioPorPeriodo);

// Rota para relatório por equipe (protegida)
router.get('/equipe/:equipeId', authenticateToken, getRelatorioPorEquipe);

// Rota para relatório por equipe e período (protegida)
router.get('/equipe/:equipeId/periodo', authenticateToken, getRelatorioPorEquipeEPeriodo);

module.exports = router;

