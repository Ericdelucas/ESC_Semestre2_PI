const { pool } = require('../config/database');

// Listar todas as atividades
const getAllAtividades = async (req, res) => {
    try {
        const [atividades] = await pool.execute(`
            SELECT 
                a.id_atividade,
                a.nome_atividade,
                a.id_equipe,
                e.nome_equipe,
                a.id_tipo_atividade,
                ta.nome_tipo,
                a.data_inicio,
                a.data_fim,
                a.meta_esperada,
                a.unidade_meta,
                a.valor_arrecadado,
                a.valor_fundo_utilizado
            FROM ATIVIDADE a
            LEFT JOIN EQUIPE e ON a.id_equipe = e.id_equipe
            LEFT JOIN TIPO_ATIVIDADE ta ON a.id_tipo_atividade = ta.id_tipo_atividade
            ORDER BY a.data_inicio DESC
        `);

        res.json({
            success: true,
            data: atividades
        });

    } catch (error) {
        console.error('Erro ao listar atividades:', error);
        res.status(500).json({
            success: false,
            message: 'Erro interno do servidor'
        });
    }
};

// Obter atividade por ID
const getAtividadeById = async (req, res) => {
    try {
        const { id } = req.params;

        const [atividades] = await pool.execute(`
            SELECT 
                a.id_atividade,
                a.nome_atividade,
                a.id_equipe,
                e.nome_equipe,
                a.id_tipo_atividade,
                ta.nome_tipo,
                a.data_inicio,
                a.data_fim,
                a.meta_esperada,
                a.unidade_meta,
                a.valor_arrecadado,
                a.valor_fundo_utilizado
            FROM ATIVIDADE a
            LEFT JOIN EQUIPE e ON a.id_equipe = e.id_equipe
            LEFT JOIN TIPO_ATIVIDADE ta ON a.id_tipo_atividade = ta.id_tipo_atividade
            WHERE a.id_atividade = ?
        `, [id]);

        if (atividades.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Atividade não encontrada'
            });
        }

        res.json({
            success: true,
            data: atividades[0]
        });

    } catch (error) {
        console.error('Erro ao obter atividade:', error);
        res.status(500).json({
            success: false,
            message: 'Erro interno do servidor'
        });
    }
};

// Listar atividades por equipe
const getAtividadesByEquipe = async (req, res) => {
    try {
        const { equipeId } = req.params;

        const [atividades] = await pool.execute(`
            SELECT 
                a.id_atividade,
                a.nome_atividade,
                a.id_equipe,
                e.nome_equipe,
                a.id_tipo_atividade,
                ta.nome_tipo,
                a.data_inicio,
                a.data_fim,
                a.meta_esperada,
                a.unidade_meta,
                a.valor_arrecadado,
                a.valor_fundo_utilizado
            FROM ATIVIDADE a
            LEFT JOIN EQUIPE e ON a.id_equipe = e.id_equipe
            LEFT JOIN TIPO_ATIVIDADE ta ON a.id_tipo_atividade = ta.id_tipo_atividade
            WHERE a.id_equipe = ?
            ORDER BY a.data_inicio DESC
        `, [equipeId]);

        res.json({
            success: true,
            data: atividades
        });

    } catch (error) {
        console.error('Erro ao listar atividades por equipe:', error);
        res.status(500).json({
            success: false,
            message: 'Erro interno do servidor'
        });
    }
};

// Criar nova atividade
const createAtividade = async (req, res) => {
    try {
        const { 
            nome_atividade, 
            id_equipe, 
            id_tipo_atividade, 
            data_inicio, 
            data_fim, 
            meta_esperada, 
            unidade_meta, 
            valor_arrecadado, 
            valor_fundo_utilizado 
        } = req.body;

        // Validar dados obrigatórios
        if (!nome_atividade || !id_equipe || !id_tipo_atividade || !data_inicio || !data_fim) {
            return res.status(400).json({
                success: false,
                message: 'Nome da atividade, equipe, tipo de atividade, data de início e data de fim são obrigatórios'
            });
        }

        // Validar se data de fim é posterior à data de início
        if (new Date(data_fim) <= new Date(data_inicio)) {
            return res.status(400).json({
                success: false,
                message: 'Data de fim deve ser posterior à data de início'
            });
        }

        // Verificar se a equipe existe
        const [equipe] = await pool.execute(
            'SELECT id_equipe FROM EQUIPE WHERE id_equipe = ?',
            [id_equipe]
        );

        if (equipe.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Equipe não encontrada'
            });
        }

        // Verificar se o tipo de atividade existe
        const [tipoAtividade] = await pool.execute(
            'SELECT id_tipo_atividade FROM TIPO_ATIVIDADE WHERE id_tipo_atividade = ?',
            [id_tipo_atividade]
        );

        if (tipoAtividade.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Tipo de atividade não encontrado'
            });
        }

        const [result] = await pool.execute(
            'INSERT INTO ATIVIDADE (nome_atividade, id_equipe, id_tipo_atividade, data_inicio, data_fim, meta_esperada, unidade_meta, valor_arrecadado, valor_fundo_utilizado) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [nome_atividade, id_equipe, id_tipo_atividade, data_inicio, data_fim, meta_esperada, unidade_meta, valor_arrecadado, valor_fundo_utilizado]
        );

        res.status(201).json({
            success: true,
            message: 'Atividade criada com sucesso',
            data: {
                id_atividade: result.insertId,
                nome_atividade,
                id_equipe,
                id_tipo_atividade,
                data_inicio,
                data_fim,
                meta_esperada,
                unidade_meta,
                valor_arrecadado,
                valor_fundo_utilizado
            }
        });

    } catch (error) {
        console.error('Erro ao criar atividade:', error);
        res.status(500).json({
            success: false,
            message: 'Erro interno do servidor'
        });
    }
};

// Atualizar atividade
const updateAtividade = async (req, res) => {
    try {
        const { id } = req.params;
        const { 
            nome_atividade, 
            id_equipe, 
            id_tipo_atividade, 
            data_inicio, 
            data_fim, 
            meta_esperada, 
            unidade_meta, 
            valor_arrecadado, 
            valor_fundo_utilizado 
        } = req.body;

        // Verificar se a atividade existe
        const [existingAtividade] = await pool.execute(
            'SELECT id_atividade FROM ATIVIDADE WHERE id_atividade = ?',
            [id]
        );

        if (existingAtividade.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Atividade não encontrada'
            });
        }

        // Validar se data de fim é posterior à data de início (se ambas fornecidas)
        if (data_inicio && data_fim && new Date(data_fim) <= new Date(data_inicio)) {
            return res.status(400).json({
                success: false,
                message: 'Data de fim deve ser posterior à data de início'
            });
        }

        // Verificar se a equipe existe (se fornecida)
        if (id_equipe) {
            const [equipe] = await pool.execute(
                'SELECT id_equipe FROM EQUIPE WHERE id_equipe = ?',
                [id_equipe]
            );

            if (equipe.length === 0) {
                return res.status(400).json({
                    success: false,
                    message: 'Equipe não encontrada'
                });
            }
        }

        // Verificar se o tipo de atividade existe (se fornecido)
        if (id_tipo_atividade) {
            const [tipoAtividade] = await pool.execute(
                'SELECT id_tipo_atividade FROM TIPO_ATIVIDADE WHERE id_tipo_atividade = ?',
                [id_tipo_atividade]
            );

            if (tipoAtividade.length === 0) {
                return res.status(400).json({
                    success: false,
                    message: 'Tipo de atividade não encontrado'
                });
            }
        }

        await pool.execute(
            'UPDATE ATIVIDADE SET nome_atividade = COALESCE(?, nome_atividade), id_equipe = COALESCE(?, id_equipe), id_tipo_atividade = COALESCE(?, id_tipo_atividade), data_inicio = COALESCE(?, data_inicio), data_fim = COALESCE(?, data_fim), meta_esperada = COALESCE(?, meta_esperada), unidade_meta = COALESCE(?, unidade_meta), valor_arrecadado = COALESCE(?, valor_arrecadado), valor_fundo_utilizado = COALESCE(?, valor_fundo_utilizado) WHERE id_atividade = ?',
            [nome_atividade, id_equipe, id_tipo_atividade, data_inicio, data_fim, meta_esperada, unidade_meta, valor_arrecadado, valor_fundo_utilizado, id]
        );

        res.json({
            success: true,
            message: 'Atividade atualizada com sucesso'
        });

    } catch (error) {
        console.error('Erro ao atualizar atividade:', error);
        res.status(500).json({
            success: false,
            message: 'Erro interno do servidor'
        });
    }
};

// Deletar atividade
const deleteAtividade = async (req, res) => {
    try {
        const { id } = req.params;

        // Verificar se a atividade existe
        const [existingAtividade] = await pool.execute(
            'SELECT id_atividade FROM ATIVIDADE WHERE id_atividade = ?',
            [id]
        );

        if (existingAtividade.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Atividade não encontrada'
            });
        }

        await pool.execute('DELETE FROM ATIVIDADE WHERE id_atividade = ?', [id]);

        res.json({
            success: true,
            message: 'Atividade deletada com sucesso'
        });

    } catch (error) {
        console.error('Erro ao deletar atividade:', error);
        res.status(500).json({
            success: false,
            message: 'Erro interno do servidor'
        });
    }
};

module.exports = {
    getAllAtividades,
    getAtividadeById,
    getAtividadesByEquipe,
    createAtividade,
    updateAtividade,
    deleteAtividade
};

