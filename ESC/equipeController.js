const { pool } = require('../config/database');

// Listar todas as equipes
const getAllEquipes = async (req, res) => {
    try {
        const [equipes] = await pool.execute(`
            SELECT 
                e.id_equipe,
                e.nome_equipe,
                e.id_edicao,
                ed.nome_edicao,
                e.id_mentor,
                p.nome as nome_mentor
            FROM EQUIPE e
            LEFT JOIN EDICAO ed ON e.id_edicao = ed.id_edicao
            LEFT JOIN PARTICIPANTE p ON e.id_mentor = p.id_participante
            ORDER BY e.nome_equipe
        `);

        // Para cada equipe, buscar os alunos
        for (let equipe of equipes) {
            const [alunos] = await pool.execute(`
                SELECT 
                    p.id_participante,
                    p.nome,
                    p.email
                FROM EQUIPE_ALUNO ea
                JOIN PARTICIPANTE p ON ea.id_aluno = p.id_participante
                WHERE ea.id_equipe = ?
            `, [equipe.id_equipe]);
            
            equipe.alunos = alunos;
        }

        res.json({
            success: true,
            data: equipes
        });

    } catch (error) {
        console.error('Erro ao listar equipes:', error);
        res.status(500).json({
            success: false,
            message: 'Erro interno do servidor'
        });
    }
};

// Obter equipe por ID
const getEquipeById = async (req, res) => {
    try {
        const { id } = req.params;

        const [equipes] = await pool.execute(`
            SELECT 
                e.id_equipe,
                e.nome_equipe,
                e.id_edicao,
                ed.nome_edicao,
                e.id_mentor,
                p.nome as nome_mentor
            FROM EQUIPE e
            LEFT JOIN EDICAO ed ON e.id_edicao = ed.id_edicao
            LEFT JOIN PARTICIPANTE p ON e.id_mentor = p.id_participante
            WHERE e.id_equipe = ?
        `, [id]);

        if (equipes.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Equipe não encontrada'
            });
        }

        // Buscar alunos da equipe
        const [alunos] = await pool.execute(`
            SELECT 
                p.id_participante,
                p.nome,
                p.email
            FROM EQUIPE_ALUNO ea
            JOIN PARTICIPANTE p ON ea.id_aluno = p.id_participante
            WHERE ea.id_equipe = ?
        `, [id]);

        const equipe = equipes[0];
        equipe.alunos = alunos;

        res.json({
            success: true,
            data: equipe
        });

    } catch (error) {
        console.error('Erro ao obter equipe:', error);
        res.status(500).json({
            success: false,
            message: 'Erro interno do servidor'
        });
    }
};

// Criar nova equipe (apenas administradores)
const createEquipe = async (req, res) => {
    try {
        const { nome_equipe, id_edicao, id_mentor, alunos } = req.body;

        // Validar dados obrigatórios
        if (!nome_equipe || !id_edicao) {
            return res.status(400).json({
                success: false,
                message: 'Nome da equipe e ID da edição são obrigatórios'
            });
        }

        // Verificar se a edição existe
        const [edicao] = await pool.execute(
            'SELECT id_edicao FROM EDICAO WHERE id_edicao = ?',
            [id_edicao]
        );

        if (edicao.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Edição não encontrada'
            });
        }

        // Verificar se o mentor existe (se fornecido)
        if (id_mentor) {
            const [mentor] = await pool.execute(
                'SELECT id_participante FROM PARTICIPANTE WHERE id_participante = ? AND perfil = ?',
                [id_mentor, 'mentor']
            );

            if (mentor.length === 0) {
                return res.status(400).json({
                    success: false,
                    message: 'Mentor não encontrado'
                });
            }
        }

        // Criar a equipe
        const [result] = await pool.execute(
            'INSERT INTO EQUIPE (nome_equipe, id_edicao, id_mentor) VALUES (?, ?, ?)',
            [nome_equipe, id_edicao, id_mentor]
        );

        const equipeId = result.insertId;

        // Adicionar alunos à equipe (se fornecidos)
        if (alunos && Array.isArray(alunos) && alunos.length > 0) {
            for (const alunoId of alunos) {
                // Verificar se o aluno existe
                const [aluno] = await pool.execute(
                    'SELECT id_participante FROM PARTICIPANTE WHERE id_participante = ? AND perfil = ?',
                    [alunoId, 'aluno']
                );

                if (aluno.length > 0) {
                    await pool.execute(
                        'INSERT INTO EQUIPE_ALUNO (id_equipe, id_aluno) VALUES (?, ?)',
                        [equipeId, alunoId]
                    );
                }
            }
        }

        res.status(201).json({
            success: true,
            message: 'Equipe criada com sucesso',
            data: {
                id_equipe: equipeId,
                nome_equipe,
                id_edicao,
                id_mentor
            }
        });

    } catch (error) {
        console.error('Erro ao criar equipe:', error);
        res.status(500).json({
            success: false,
            message: 'Erro interno do servidor'
        });
    }
};

// Atualizar equipe (apenas administradores)
const updateEquipe = async (req, res) => {
    try {
        const { id } = req.params;
        const { nome_equipe, id_edicao, id_mentor, alunos } = req.body;

        // Verificar se a equipe existe
        const [existingEquipe] = await pool.execute(
            'SELECT id_equipe FROM EQUIPE WHERE id_equipe = ?',
            [id]
        );

        if (existingEquipe.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Equipe não encontrada'
            });
        }

        // Verificar se a edição existe (se fornecida)
        if (id_edicao) {
            const [edicao] = await pool.execute(
                'SELECT id_edicao FROM EDICAO WHERE id_edicao = ?',
                [id_edicao]
            );

            if (edicao.length === 0) {
                return res.status(400).json({
                    success: false,
                    message: 'Edição não encontrada'
                });
            }
        }

        // Verificar se o mentor existe (se fornecido)
        if (id_mentor) {
            const [mentor] = await pool.execute(
                'SELECT id_participante FROM PARTICIPANTE WHERE id_participante = ? AND perfil = ?',
                [id_mentor, 'mentor']
            );

            if (mentor.length === 0) {
                return res.status(400).json({
                    success: false,
                    message: 'Mentor não encontrado'
                });
            }
        }

        // Atualizar a equipe
        await pool.execute(
            'UPDATE EQUIPE SET nome_equipe = COALESCE(?, nome_equipe), id_edicao = COALESCE(?, id_edicao), id_mentor = COALESCE(?, id_mentor) WHERE id_equipe = ?',
            [nome_equipe, id_edicao, id_mentor, id]
        );

        // Atualizar alunos da equipe (se fornecidos)
        if (alunos && Array.isArray(alunos)) {
            // Remover todos os alunos atuais da equipe
            await pool.execute('DELETE FROM EQUIPE_ALUNO WHERE id_equipe = ?', [id]);

            // Adicionar novos alunos
            for (const alunoId of alunos) {
                // Verificar se o aluno existe
                const [aluno] = await pool.execute(
                    'SELECT id_participante FROM PARTICIPANTE WHERE id_participante = ? AND perfil = ?',
                    [alunoId, 'aluno']
                );

                if (aluno.length > 0) {
                    await pool.execute(
                        'INSERT INTO EQUIPE_ALUNO (id_equipe, id_aluno) VALUES (?, ?)',
                        [id, alunoId]
                    );
                }
            }
        }

        res.json({
            success: true,
            message: 'Equipe atualizada com sucesso'
        });

    } catch (error) {
        console.error('Erro ao atualizar equipe:', error);
        res.status(500).json({
            success: false,
            message: 'Erro interno do servidor'
        });
    }
};

// Deletar equipe (apenas administradores)
const deleteEquipe = async (req, res) => {
    try {
        const { id } = req.params;

        // Verificar se a equipe existe
        const [existingEquipe] = await pool.execute(
            'SELECT id_equipe FROM EQUIPE WHERE id_equipe = ?',
            [id]
        );

        if (existingEquipe.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Equipe não encontrada'
            });
        }

        // Verificar se existem atividades associadas à equipe
        const [atividades] = await pool.execute(
            'SELECT id_atividade FROM ATIVIDADE WHERE id_equipe = ?',
            [id]
        );

        if (atividades.length > 0) {
            return res.status(400).json({
                success: false,
                message: 'Não é possível deletar equipe que possui atividades associadas'
            });
        }

        // Remover alunos da equipe
        await pool.execute('DELETE FROM EQUIPE_ALUNO WHERE id_equipe = ?', [id]);

        // Deletar a equipe
        await pool.execute('DELETE FROM EQUIPE WHERE id_equipe = ?', [id]);

        res.json({
            success: true,
            message: 'Equipe deletada com sucesso'
        });

    } catch (error) {
        console.error('Erro ao deletar equipe:', error);
        res.status(500).json({
            success: false,
            message: 'Erro interno do servidor'
        });
    }
};

module.exports = {
    getAllEquipes,
    getEquipeById,
    createEquipe,
    updateEquipe,
    deleteEquipe
};

