const mysql = require('mysql2/promise');
require('dotenv').config();

const dbConfig = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
};

const pool = mysql.createPool(dbConfig);

// Função para inicializar o banco de dados
async function initializeDatabase() {
    try {
        // Criar conexão sem especificar o banco de dados
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD
        });

        // Criar o banco de dados se não existir
        await connection.execute(`CREATE DATABASE IF NOT EXISTS ${process.env.DB_NAME}`);
        console.log(`Banco de dados ${process.env.DB_NAME} criado ou já existe.`);

        // Usar o banco de dados
        await connection.query(`USE ${process.env.DB_NAME}`);

        // Criar as tabelas
        await createTables(connection);

        await connection.end();
        console.log('Banco de dados inicializado com sucesso!');
    } catch (error) {
        console.error('Erro ao inicializar o banco de dados:', error);
        throw error;
    }
}

// Função para criar as tabelas
async function createTables(connection) {
    const tables = [
        `CREATE TABLE IF NOT EXISTS EDICAO (
            id_edicao INT PRIMARY KEY AUTO_INCREMENT,
            nome_edicao VARCHAR(255) NOT NULL,
            data_inicio DATE NOT NULL,
            data_fim DATE NOT NULL
        )`,
        
        `CREATE TABLE IF NOT EXISTS PARTICIPANTE (
            id_participante INT PRIMARY KEY AUTO_INCREMENT,
            nome VARCHAR(255) NOT NULL,
            email VARCHAR(255) UNIQUE NOT NULL,
            senha VARCHAR(255) NOT NULL,
            perfil ENUM('aluno', 'professor', 'mentor', 'administrador') NOT NULL
        )`,
        
        `CREATE TABLE IF NOT EXISTS EQUIPE (
            id_equipe INT PRIMARY KEY AUTO_INCREMENT,
            nome_equipe VARCHAR(255) NOT NULL,
            id_edicao INT NOT NULL,
            id_mentor INT,
            FOREIGN KEY (id_edicao) REFERENCES EDICAO(id_edicao),
            FOREIGN KEY (id_mentor) REFERENCES PARTICIPANTE(id_participante)
        )`,
        
        `CREATE TABLE IF NOT EXISTS TIPO_ATIVIDADE (
            id_tipo_atividade INT PRIMARY KEY AUTO_INCREMENT,
            nome_tipo VARCHAR(255) NOT NULL
        )`,
        
        `CREATE TABLE IF NOT EXISTS ATIVIDADE (
            id_atividade INT PRIMARY KEY AUTO_INCREMENT,
            nome_atividade VARCHAR(255) NOT NULL,
            id_equipe INT NOT NULL,
            id_tipo_atividade INT NOT NULL,
            data_inicio DATE NOT NULL,
            data_fim DATE NOT NULL,
            meta_esperada DECIMAL(10,2),
            unidade_meta VARCHAR(50),
            valor_arrecadado DECIMAL(10,2),
            valor_fundo_utilizado DECIMAL(10,2),
            FOREIGN KEY (id_equipe) REFERENCES EQUIPE(id_equipe),
            FOREIGN KEY (id_tipo_atividade) REFERENCES TIPO_ATIVIDADE(id_tipo_atividade)
        )`,
        
        `CREATE TABLE IF NOT EXISTS EQUIPE_ALUNO (
            id_equipe INT NOT NULL,
            id_aluno INT NOT NULL,
            PRIMARY KEY (id_equipe, id_aluno),
            FOREIGN KEY (id_equipe) REFERENCES EQUIPE(id_equipe),
            FOREIGN KEY (id_aluno) REFERENCES PARTICIPANTE(id_participante)
        )`
    ];

    for (const tableSQL of tables) {
        await connection.execute(tableSQL);
        console.log('Tabela criada com sucesso!');
    }
}

module.exports = { pool, initializeDatabase };

