const { pool } = require('../config/database');

// Listar todos os tipos de atividade
const getAllTiposAtividade = async (req, res) => {
    try {
        const [tipos] = await pool.execute(
            'SELECT * FROM TIPO_ATIVIDADE ORDER BY nome_tipo'
        );

        res.json({
            success: true,
            data: tipos
        });

    } catch (error) {
        console.error('Erro ao listar tipos de atividade:', error);
        res.status(500).json({
            success: false,
            message: 'Erro interno do servidor'
        });
    }
};

// Obter tipo de atividade por ID
const getTipoAtividadeById = async (req, res) => {
    try {
        const { id } = req.params;

        const [tipos] = await pool.execute(
            'SELECT * FROM TIPO_ATIVIDADE WHERE id_tipo_atividade = ?',
            [id]
        );

        if (tipos.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Tipo de atividade não encontrado'
            });
        }

        res.json({
            success: true,
            data: tipos[0]
        });

    } catch (error) {
        console.error('Erro ao obter tipo de atividade:', error);
        res.status(500).json({
            success: false,
            message: 'Erro interno do servidor'
        });
    }
};

// Criar novo tipo de atividade
const createTipoAtividade = async (req, res) => {
    try {
        const { nome_tipo } = req.body;

        // Validar dados obrigatórios
        if (!nome_tipo) {
            return res.status(400).json({
                success: false,
                message: 'Nome do tipo de atividade é obrigatório'
            });
        }

        // Verificar se o tipo já existe
        const [existingTipo] = await pool.execute(
            'SELECT id_tipo_atividade FROM TIPO_ATIVIDADE WHERE nome_tipo = ?',
            [nome_tipo]
        );

        if (existingTipo.length > 0) {
            return res.status(400).json({
                success: false,
                message: 'Tipo de atividade já existe'
            });
        }

        const [result] = await pool.execute(
            'INSERT INTO TIPO_ATIVIDADE (nome_tipo) VALUES (?)',
            [nome_tipo]
        );

        res.status(201).json({
            success: true,
            message: 'Tipo de atividade criado com sucesso',
            data: {
                id_tipo_atividade: result.insertId,
                nome_tipo
            }
        });

    } catch (error) {
        console.error('Erro ao criar tipo de atividade:', error);
        res.status(500).json({
            success: false,
            message: 'Erro interno do servidor'
        });
    }
};

// Atualizar tipo de atividade
const updateTipoAtividade = async (req, res) => {
    try {
        const { id } = req.params;
        const { nome_tipo } = req.body;

        // Verificar se o tipo existe
        const [existingTipo] = await pool.execute(
            'SELECT id_tipo_atividade FROM TIPO_ATIVIDADE WHERE id_tipo_atividade = ?',
            [id]
        );

        if (existingTipo.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Tipo de atividade não encontrado'
            });
        }

        // Verificar se o novo nome já existe (se fornecido)
        if (nome_tipo) {
            const [duplicateTipo] = await pool.execute(
                'SELECT id_tipo_atividade FROM TIPO_ATIVIDADE WHERE nome_tipo = ? AND id_tipo_atividade != ?',
                [nome_tipo, id]
            );

            if (duplicateTipo.length > 0) {
                return res.status(400).json({
                    success: false,
                    message: 'Já existe um tipo de atividade com este nome'
                });
            }
        }

        await pool.execute(
            'UPDATE TIPO_ATIVIDADE SET nome_tipo = COALESCE(?, nome_tipo) WHERE id_tipo_atividade = ?',
            [nome_tipo, id]
        );

        res.json({
            success: true,
            message: 'Tipo de atividade atualizado com sucesso'
        });

    } catch (error) {
        console.error('Erro ao atualizar tipo de atividade:', error);
        res.status(500).json({
            success: false,
            message: 'Erro interno do servidor'
        });
    }
};

// Deletar tipo de atividade
const deleteTipoAtividade = async (req, res) => {
    try {
        const { id } = req.params;

        // Verificar se o tipo existe
        const [existingTipo] = await pool.execute(
            'SELECT id_tipo_atividade FROM TIPO_ATIVIDADE WHERE id_tipo_atividade = ?',
            [id]
        );

        if (existingTipo.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Tipo de atividade não encontrado'
            });
        }

        // Verificar se existem atividades associadas ao tipo
        const [atividades] = await pool.execute(
            'SELECT id_atividade FROM ATIVIDADE WHERE id_tipo_atividade = ?',
            [id]
        );

        if (atividades.length > 0) {
            return res.status(400).json({
                success: false,
                message: 'Não é possível deletar tipo de atividade que possui atividades associadas'
            });
        }

        await pool.execute('DELETE FROM TIPO_ATIVIDADE WHERE id_tipo_atividade = ?', [id]);

        res.json({
            success: true,
            message: 'Tipo de atividade deletado com sucesso'
        });

    } catch (error) {
        console.error('Erro ao deletar tipo de atividade:', error);
        res.status(500).json({
            success: false,
            message: 'Erro interno do servidor'
        });
    }
};

module.exports = {
    getAllTiposAtividade,
    getTipoAtividadeById,
    createTipoAtividade,
    updateTipoAtividade,
    deleteTipoAtividade
};

