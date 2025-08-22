const express = require('express');
const cors = require('cors');
const { initializeDatabase } = require('./config/database');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Importar rotas
const authRoutes = require('./routes/auth');
const edicoesRoutes = require('./routes/edicoes');
const equipesRoutes = require('./routes/equipes');
const tiposAtividadeRoutes = require('./routes/tipos-atividade');
const atividadesRoutes = require('./routes/atividades');
const relatoriosRoutes = require('./routes/relatorios');

// Usar rotas
app.use('/api/auth', authRoutes);
app.use('/api/edicoes', edicoesRoutes);
app.use('/api/equipes', equipesRoutes);
app.use('/api/tipos-atividade', tiposAtividadeRoutes);
app.use('/api/atividades', atividadesRoutes);
app.use('/api/relatorios', relatoriosRoutes);

// Rota de teste
app.get('/', (req, res) => {
    res.json({
        success: true,
        message: 'API do Projeto Lideranças Empáticas está funcionando!',
        version: '1.0.0'
    });
});

// Middleware de tratamento de erros
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        success: false,
        message: 'Algo deu errado!'
    });
});

// Middleware para rotas não encontradas
app.use('*', (req, res) => {
    res.status(404).json({
        success: false,
        message: 'Rota não encontrada'
    });
});

// Inicializar banco de dados e iniciar servidor
async function startServer() {
    try {
        await initializeDatabase();
        app.listen(PORT, '0.0.0.0', () => {
            console.log(`Servidor rodando na porta ${PORT}`);
            console.log(`Acesse: http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error('Erro ao iniciar o servidor:', error);
        process.exit(1);
    }
}

startServer();

