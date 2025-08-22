const { pool } = require('../config/database');

// Listar todas as edições
const getAllEdicoes = async (req, res) => {
    try {
        const [edicoes] = await pool.execute(
            'SELECT * FROM EDICAO ORDER BY data_inicio DESC'
        );

        res.json({
            success: true,
            data: edicoes
        });

    } catch (error) {
        console.error('Erro ao listar edições:', error);
        res.status(500).json({
            success: false,
            message: 'Erro interno do servidor'
        });
    }
};

// Obter edição por ID
const getEdicaoById = async (req, res) => {
    try {
        const { id } = req.params;

        const [edicoes] = await pool.execute(
            'SELECT * FROM EDICAO WHERE id_edicao = ?',
            [id]
        );

        if (edicoes.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Edição não encontrada'
            });
        }

        res.json({
            success: true,
            data: edicoes[0]
        });

    } catch (error) {
        console.error('Erro ao obter edição:', error);
        res.status(500).json({
            success: false,
            message: 'Erro interno do servidor'
        });
    }
};

// Criar nova edição (apenas administradores)
const createEdicao = async (req, res) => {
    try {
        const { nome_edicao, data_inicio, data_fim } = req.body;

        // Validar dados obrigatórios
        if (!nome_edicao || !data_inicio || !data_fim) {
            return res.status(400).json({
                success: false,
                message: 'Nome da edição, data de início e data de fim são obrigatórios'
            });
        }

        // Validar se data de fim é posterior à data de início
        if (new Date(data_fim) <= new Date(data_inicio)) {
            return res.status(400).json({
                success: false,
                message: 'Data de fim deve ser posterior à data de início'
            });
        }

        const [result] = await pool.execute(
            'INSERT INTO EDICAO (nome_edicao, data_inicio, data_fim) VALUES (?, ?, ?)',
            [nome_edicao, data_inicio, data_fim]
        );

        res.status(201).json({
            success: true,
            message: 'Edição criada com sucesso',
            data: {
                id_edicao: result.insertId,
                nome_edicao,
                data_inicio,
                data_fim
            }
        });

    } catch (error) {
        console.error('Erro ao criar edição:', error);
        res.status(500).json({
            success: false,
            message: 'Erro interno do servidor'
        });
    }
};

// Atualizar edição (apenas administradores)
const updateEdicao = async (req, res) => {
    try {
        const { id } = req.params;
        const { nome_edicao, data_inicio, data_fim } = req.body;

        // Verificar se a edição existe
        const [existingEdicao] = await pool.execute(
            'SELECT id_edicao FROM EDICAO WHERE id_edicao = ?',
            [id]
        );

        if (existingEdicao.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Edição não encontrada'
            });
        }

        // Validar se data de fim é posterior à data de início
        if (data_inicio && data_fim && new Date(data_fim) <= new Date(data_inicio)) {
            return res.status(400).json({
                success: false,
                message: 'Data de fim deve ser posterior à data de início'
            });
        }

        const [result] = await pool.execute(
            'UPDATE EDICAO SET nome_edicao = COALESCE(?, nome_edicao), data_inicio = COALESCE(?, data_inicio), data_fim = COALESCE(?, data_fim) WHERE id_edicao = ?',
            [nome_edicao, data_inicio, data_fim, id]
        );

        res.json({
            success: true,
            message: 'Edição atualizada com sucesso'
        });

    } catch (error) {
        console.error('Erro ao atualizar edição:', error);
        res.status(500).json({
            success: false,
            message: 'Erro interno do servidor'
        });
    }
};

// Deletar edição (apenas administradores)
const deleteEdicao = async (req, res) => {
    try {
        const { id } = req.params;

        // Verificar se a edição existe
        const [existingEdicao] = await pool.execute(
            'SELECT id_edicao FROM EDICAO WHERE id_edicao = ?',
            [id]
        );

        if (existingEdicao.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Edição não encontrada'
            });
        }

        // Verificar se existem equipes associadas à edição
        const [equipes] = await pool.execute(
            'SELECT id_equipe FROM EQUIPE WHERE id_edicao = ?',
            [id]
        );

        if (equipes.length > 0) {
            return res.status(400).json({
                success: false,
                message: 'Não é possível deletar edição que possui equipes associadas'
            });
        }

        await pool.execute('DELETE FROM EDICAO WHERE id_edicao = ?', [id]);

        res.json({
            success: true,
            message: 'Edição deletada com sucesso'
        });

    } catch (error) {
        console.error('Erro ao deletar edição:', error);
        res.status(500).json({
            success: false,
            message: 'Erro interno do servidor'
        });
    }
};

module.exports = {
    getAllEdicoes,
    getEdicaoById,
    createEdicao,
    updateEdicao,
    deleteEdicao
};

