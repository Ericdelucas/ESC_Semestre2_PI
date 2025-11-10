// src/database.js
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

// ⚠️ Carrega variáveis do .env antes de usar process.env
dotenv.config();

export const connection = await mysql.createConnection({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'liderancas_empaticas',
  port: process.env.DB_PORT || 3306,
});

console.log(`✅ Conectado ao MySQL como ${process.env.DB_USER}@${process.env.DB_HOST}`);
