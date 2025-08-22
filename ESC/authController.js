const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { pool } = require('../config/database');
require('dotenv').config();

// Registrar novo participante (auto cadastro para alunos)
const register = async (req, res) => {
    try {
        const { nome, email, senha, perfil = 'aluno' } = req.body;

        // Validar dados obrigatórios
        if (!nome || !email || !senha) {
            return res.status(400).json({
                success: false,
                message: 'Nome, email e senha são obrigatórios'
            });
        }

        // Verificar se o email já existe
        const [existingUser] = await pool.execute(
            'SELECT id_participante FROM PARTICIPANTE WHERE email = ?',
            [email]
        );

        if (existingUser.length > 0) {
            return res.status(400).json({
                success: false,
                message: 'Email já cadastrado'
            });
        }

        // Criptografar senha
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(senha, saltRounds);

        // Inserir novo participante
        const [result] = await pool.execute(
            'INSERT INTO PARTICIPANTE (nome, email, senha, perfil) VALUES (?, ?, ?, ?)',
            [nome, email, hashedPassword, perfil]
        );

        res.status(201).json({
            success: true,
            message: 'Participante cadastrado com sucesso',
            data: {
                id: result.insertId,
                nome,
                email,
                perfil
            }
        });

    } catch (error) {
        console.error('Erro no registro:', error);
        res.status(500).json({
            success: false,
            message: 'Erro interno do servidor'
        });
    }
};

// Login de participante
const login = async (req, res) => {
    try {
        const { email, senha } = req.body;

        // Validar dados obrigatórios
        if (!email || !senha) {
            return res.status(400).json({
                success: false,
                message: 'Email e senha são obrigatórios'
            });
        }

        // Buscar participante por email
        const [users] = await pool.execute(
            'SELECT id_participante, nome, email, senha, perfil FROM PARTICIPANTE WHERE email = ?',
            [email]
        );

        if (users.length === 0) {
            return res.status(401).json({
                success: false,
                message: 'Credenciais inválidas'
            });
        }

        const user = users[0];

        // Verificar senha
        const isPasswordValid = await bcrypt.compare(senha, user.senha);
        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: 'Credenciais inválidas'
            });
        }

        // Gerar token JWT
        const token = jwt.sign(
            {
                id: user.id_participante,
                email: user.email,
                perfil: user.perfil
            },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.json({
            success: true,
            message: 'Login realizado com sucesso',
            data: {
                token,
                user: {
                    id: user.id_participante,
                    nome: user.nome,
                    email: user.email,
                    perfil: user.perfil
                }
            }
        });

    } catch (error) {
        console.error('Erro no login:', error);
        res.status(500).json({
            success: false,
            message: 'Erro interno do servidor'
        });
    }
};

// Obter perfil do usuário logado
const getProfile = async (req, res) => {
    try {
        const [users] = await pool.execute(
            'SELECT id_participante, nome, email, perfil FROM PARTICIPANTE WHERE id_participante = ?',
            [req.user.id]
        );

        if (users.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Usuário não encontrado'
            });
        }

        res.json({
            success: true,
            data: users[0]
        });

    } catch (error) {
        console.error('Erro ao obter perfil:', error);
        res.status(500).json({
            success: false,
            message: 'Erro interno do servidor'
        });
    }
};

module.exports = {
    register,
    login,
    getProfile
};

