import express from 'express'
const cors = require('cors');
const bodyParser = require('body-parser');
const mysql = require('mysql2/promise');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Configuração do banco de dados MySQL
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'liderancas_empaticas',
  port: process.env.DB_PORT || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};

let db;

// Função para conectar ao MySQL
async function connectToDatabase() {
  try {
    db = mysql.createPool(dbConfig);
    console.log('Conectado ao banco de dados MySQL.');
    await initializeDatabase();
  } catch (error) {
    console.error('Erro ao conectar com o banco de dados:', error.message);
    process.exit(1);
  }
}

// Inicializar tabelas do banco de dados
async function initializeDatabase() {
  try {
    // Tabela de Edições
    await db.execute(`CREATE TABLE IF NOT EXISTS edicoes (
      id INT AUTO_INCREMENT PRIMARY KEY,
      nome VARCHAR(255) NOT NULL,
      dataInicio DATE NOT NULL,
      dataFim DATE NOT NULL,
      descricao TEXT,
      status VARCHAR(50) DEFAULT 'Planejada',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`);

    // Tabela de Participantes
    await db.execute(`CREATE TABLE IF NOT EXISTS participantes (
      id INT AUTO_INCREMENT PRIMARY KEY,
      nome VARCHAR(255) NOT NULL,
      email VARCHAR(255) UNIQUE NOT NULL,
      telefone VARCHAR(20),
      tipo VARCHAR(50) NOT NULL,
      edicao_id INT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (edicao_id) REFERENCES edicoes (id) ON DELETE SET NULL
    )`);

    // Tabela de Equipes
    await db.execute(`CREATE TABLE IF NOT EXISTS equipes (
      id INT AUTO_INCREMENT PRIMARY KEY,
      nome VARCHAR(255) NOT NULL,
      mentor VARCHAR(255),
      edicao_id INT,
      membros TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (edicao_id) REFERENCES edicoes (id) ON DELETE SET NULL
    )`);

    // Tabela de Atividades
    await db.execute(`CREATE TABLE IF NOT EXISTS atividades (
      id INT AUTO_INCREMENT PRIMARY KEY,
      nome VARCHAR(255) NOT NULL,
      tipo VARCHAR(100) NOT NULL,
      descricao TEXT,
      equipe_id INT,
      meta_financeira DECIMAL(10,2) DEFAULT 0,
      valor_arrecadado DECIMAL(10,2) DEFAULT 0,
      status VARCHAR(50) DEFAULT 'Pendente',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (equipe_id) REFERENCES equipes (id) ON DELETE SET NULL
    )`);

    // Tabela de Doações
    await db.execute(`CREATE TABLE IF NOT EXISTS doacoes (
      id INT AUTO_INCREMENT PRIMARY KEY,
      data_doacao DATE NOT NULL,
      aluno_responsavel VARCHAR(255) NOT NULL,
      item_doacao VARCHAR(255) NOT NULL,
      quantidade DECIMAL(10,2) NOT NULL,
      campanha VARCHAR(255),
      doador VARCHAR(255),
      pontuacao INT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`);

    // Tabela de Metas
    await db.execute(`CREATE TABLE IF NOT EXISTS metas (
      id INT AUTO_INCREMENT PRIMARY KEY,
      data DATE NOT NULL,
      titulo VARCHAR(255) NOT NULL,
      descricao TEXT,
      equipe VARCHAR(255),
      prioridade ENUM('baixa', 'media', 'alta') DEFAULT 'media',
      status ENUM('pendente', 'em_andamento', 'concluida', 'cancelada') DEFAULT 'pendente',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`);

    console.log('Tabelas do banco de dados inicializadas.');
  } catch (error) {
    console.error('Erro ao inicializar tabelas:', error.message);
  }
}

// Função para executar queries
async function executeQuery(query, params = []) {
  try {
    const [rows] = await db.execute(query, params);
    return rows;
  } catch (error) {
    console.error('Erro ao executar query:', error.message);
    throw error;
  }
}

// Disponibilizar a função executeQuery para as rotas
app.locals.executeQuery = executeQuery;

// Importar rotas
const edicoesRoutes = require('./routes/edicoes');
const participantesRoutes = require('./routes/participantes');
const equipesRoutes = require('./routes/equipes');
const atividadesRoutes = require('./routes/atividades');
const doacoesRoutes = require('./routes/doacoes');
const metasRoutes = require('./routes/metas');

// Usar rotas
app.use('/api/edicoes', edicoesRoutes);
app.use('/api/participantes', participantesRoutes);
app.use('/api/equipes', equipesRoutes);
app.use('/api/atividades', atividadesRoutes);
app.use('/api/doacoes', doacoesRoutes);
app.use('/api/metas', metasRoutes);

// Rota de teste
app.get('/api/test', (req, res) => {
  res.json({ 
    message: 'API Lideranças Empáticas funcionando!',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    database: 'MySQL'
  });
});

// Rota para informações da API
app.get('/api', (req, res) => {
  res.json({
    name: 'Lideranças Empáticas API',
    version: '1.0.0',
    description: 'API para gerenciamento do sistema Lideranças Empáticas',
    database: 'MySQL',
    endpoints: {
      edicoes: '/api/edicoes',
      participantes: '/api/participantes',
      equipes: '/api/equipes',
      atividades: '/api/atividades',
      doacoes: '/api/doacoes',
      metas: '/api/metas',
      test: '/api/test'
    }
  });
});

// Rota para verificar status da conexão com o banco
app.get('/api/health', async (req, res) => {
  try {
    await db.execute('SELECT 1');
    res.json({ 
      status: 'healthy', 
      database: 'connected',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ 
      status: 'unhealthy', 
      database: 'disconnected',
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// Middleware de tratamento de erros
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Algo deu errado!' });
});

// Middleware para rotas não encontradas
app.use((req, res) => {
  res.status(404).json({ error: 'Rota não encontrada' });
});

// Inicializar conexão com o banco e iniciar servidor
async function startServer() {
  await connectToDatabase();
  
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Servidor rodando na porta ${PORT}`);
    console.log(`Acesse: http://localhost:${PORT}/api`);
    console.log(`Health check: http://localhost:${PORT}/api/health`);
  });
}

// Tratamento de encerramento gracioso
process.on('SIGINT', async () => {
  console.log('Encerrando servidor...');
  if (db) {
    await db.end();
    console.log('Conexão com o banco de dados fechada.');
  }
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('Encerrando servidor...');
  if (db) {
    await db.end();
    console.log('Conexão com o banco de dados fechada.');
  }
  process.exit(0);
});

// Iniciar o servidor
startServer().catch(error => {
  console.error('Erro ao iniciar servidor:', error);
  process.exit(1);
});

module.exports = { app, db, executeQuery };

