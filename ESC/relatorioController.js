const { pool } = require('../config/database');

// Relatório geral de atividades
const getRelatorioGeral = async (req, res) => {
    try {
        const [atividades] = await pool.execute(`
            SELECT 
                a.id_atividade,
                a.nome_atividade,
                e.nome_equipe,
                ta.nome_tipo,
                a.data_inicio,
                a.data_fim,
                a.meta_esperada,
                a.unidade_meta,
                a.valor_arrecadado,
                a.valor_fundo_utilizado,
                ed.nome_edicao
            FROM ATIVIDADE a
            LEFT JOIN EQUIPE e ON a.id_equipe = e.id_equipe
            LEFT JOIN TIPO_ATIVIDADE ta ON a.id_tipo_atividade = ta.id_tipo_atividade
            LEFT JOIN EDICAO ed ON e.id_edicao = ed.id_edicao
            ORDER BY a.data_inicio DESC
        `);

        // Calcular estatísticas gerais
        const totalAtividades = atividades.length;
        const totalArrecadado = atividades.reduce((sum, atividade) => sum + (parseFloat(atividade.valor_arrecadado) || 0), 0);
        const totalFundoUtilizado = atividades.reduce((sum, atividade) => sum + (parseFloat(atividade.valor_fundo_utilizado) || 0), 0);

        res.json({
            success: true,
            data: {
                atividades,
                estatisticas: {
                    total_atividades: totalAtividades,
                    total_arrecadado: totalArrecadado,
                    total_fundo_utilizado: totalFundoUtilizado
                }
            }
        });

    } catch (error) {
        console.error('Erro ao gerar relatório geral:', error);
        res.status(500).json({
            success: false,
            message: 'Erro interno do servidor'
        });
    }
};

// Relatório por período
const getRelatorioPorPeriodo = async (req, res) => {
    try {
        const { data_inicio, data_fim } = req.query;

        if (!data_inicio || !data_fim) {
            return res.status(400).json({
                success: false,
                message: 'Data de início e data de fim são obrigatórias'
            });
        }

        const [atividades] = await pool.execute(`
            SELECT 
                a.id_atividade,
                a.nome_atividade,
                e.nome_equipe,
                ta.nome_tipo,
                a.data_inicio,
                a.data_fim,
                a.meta_esperada,
                a.unidade_meta,
                a.valor_arrecadado,
                a.valor_fundo_utilizado,
                ed.nome_edicao
            FROM ATIVIDADE a
            LEFT JOIN EQUIPE e ON a.id_equipe = e.id_equipe
            LEFT JOIN TIPO_ATIVIDADE ta ON a.id_tipo_atividade = ta.id_tipo_atividade
            LEFT JOIN EDICAO ed ON e.id_edicao = ed.id_edicao
            WHERE a.data_inicio >= ? AND a.data_fim <= ?
            ORDER BY a.data_inicio DESC
        `, [data_inicio, data_fim]);

        // Calcular estatísticas do período
        const totalAtividades = atividades.length;
        const totalArrecadado = atividades.reduce((sum, atividade) => sum + (parseFloat(atividade.valor_arrecadado) || 0), 0);
        const totalFundoUtilizado = atividades.reduce((sum, atividade) => sum + (parseFloat(atividade.valor_fundo_utilizado) || 0), 0);

        res.json({
            success: true,
            data: {
                periodo: {
                    data_inicio,
                    data_fim
                },
                atividades,
                estatisticas: {
                    total_atividades: totalAtividades,
                    total_arrecadado: totalArrecadado,
                    total_fundo_utilizado: totalFundoUtilizado
                }
            }
        });

    } catch (error) {
        console.error('Erro ao gerar relatório por período:', error);
        res.status(500).json({
            success: false,
            message: 'Erro interno do servidor'
        });
    }
};

// Relatório por equipe
const getRelatorioPorEquipe = async (req, res) => {
    try {
        const { equipeId } = req.params;

        // Verificar se a equipe existe
        const [equipe] = await pool.execute(`
            SELECT 
                e.id_equipe,
                e.nome_equipe,
                ed.nome_edicao,
                p.nome as nome_mentor
            FROM EQUIPE e
            LEFT JOIN EDICAO ed ON e.id_edicao = ed.id_edicao
            LEFT JOIN PARTICIPANTE p ON e.id_mentor = p.id_participante
            WHERE e.id_equipe = ?
        `, [equipeId]);

        if (equipe.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Equipe não encontrada'
            });
        }

        // Buscar atividades da equipe
        const [atividades] = await pool.execute(`
            SELECT 
                a.id_atividade,
                a.nome_atividade,
                ta.nome_tipo,
                a.data_inicio,
                a.data_fim,
                a.meta_esperada,
                a.unidade_meta,
                a.valor_arrecadado,
                a.valor_fundo_utilizado
            FROM ATIVIDADE a
            LEFT JOIN TIPO_ATIVIDADE ta ON a.id_tipo_atividade = ta.id_tipo_atividade
            WHERE a.id_equipe = ?
            ORDER BY a.data_inicio DESC
        `, [equipeId]);

        // Buscar alunos da equipe
        const [alunos] = await pool.execute(`
            SELECT 
                p.id_participante,
                p.nome,
                p.email
            FROM EQUIPE_ALUNO ea
            JOIN PARTICIPANTE p ON ea.id_aluno = p.id_participante
            WHERE ea.id_equipe = ?
        `, [equipeId]);

        // Calcular estatísticas da equipe
        const totalAtividades = atividades.length;
        const totalArrecadado = atividades.reduce((sum, atividade) => sum + (parseFloat(atividade.valor_arrecadado) || 0), 0);
        const totalFundoUtilizado = atividades.reduce((sum, atividade) => sum + (parseFloat(atividade.valor_fundo_utilizado) || 0), 0);

        res.json({
            success: true,
            data: {
                equipe: {
                    ...equipe[0],
                    alunos
                },
                atividades,
                estatisticas: {
                    total_atividades: totalAtividades,
                    total_arrecadado: totalArrecadado,
                    total_fundo_utilizado: totalFundoUtilizado
                }
            }
        });

    } catch (error) {
        console.error('Erro ao gerar relatório por equipe:', error);
        res.status(500).json({
            success: false,
            message: 'Erro interno do servidor'
        });
    }
};

// Relatório por equipe e período
const getRelatorioPorEquipeEPeriodo = async (req, res) => {
    try {
        const { equipeId } = req.params;
        const { data_inicio, data_fim } = req.query;

        if (!data_inicio || !data_fim) {
            return res.status(400).json({
                success: false,
                message: 'Data de início e data de fim são obrigatórias'
            });
        }

        // Verificar se a equipe existe
        const [equipe] = await pool.execute(`
            SELECT 
                e.id_equipe,
                e.nome_equipe,
                ed.nome_edicao,
                p.nome as nome_mentor
            FROM EQUIPE e
            LEFT JOIN EDICAO ed ON e.id_edicao = ed.id_edicao
            LEFT JOIN PARTICIPANTE p ON e.id_mentor = p.id_participante
            WHERE e.id_equipe = ?
        `, [equipeId]);

        if (equipe.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Equipe não encontrada'
            });
        }

        // Buscar atividades da equipe no período
        const [atividades] = await pool.execute(`
            SELECT 
                a.id_atividade,
                a.nome_atividade,
                ta.nome_tipo,
                a.data_inicio,
                a.data_fim,
                a.meta_esperada,
                a.unidade_meta,
                a.valor_arrecadado,
                a.valor_fundo_utilizado
            FROM ATIVIDADE a
            LEFT JOIN TIPO_ATIVIDADE ta ON a.id_tipo_atividade = ta.id_tipo_atividade
            WHERE a.id_equipe = ? AND a.data_inicio >= ? AND a.data_fim <= ?
            ORDER BY a.data_inicio DESC
        `, [equipeId, data_inicio, data_fim]);

        // Buscar alunos da equipe
        const [alunos] = await pool.execute(`
            SELECT 
                p.id_participante,
                p.nome,
                p.email
            FROM EQUIPE_ALUNO ea
            JOIN PARTICIPANTE p ON ea.id_aluno = p.id_participante
            WHERE ea.id_equipe = ?
        `, [equipeId]);

        // Calcular estatísticas da equipe no período
        const totalAtividades = atividades.length;
        const totalArrecadado = atividades.reduce((sum, atividade) => sum + (parseFloat(atividade.valor_arrecadado) || 0), 0);
        const totalFundoUtilizado = atividades.reduce((sum, atividade) => sum + (parseFloat(atividade.valor_fundo_utilizado) || 0), 0);

        res.json({
            success: true,
            data: {
                periodo: {
                    data_inicio,
                    data_fim
                },
                equipe: {
                    ...equipe[0],
                    alunos
                },
                atividades,
                estatisticas: {
                    total_atividades: totalAtividades,
                    total_arrecadado: totalArrecadado,
                    total_fundo_utilizado: totalFundoUtilizado
                }
            }
        });

    } catch (error) {
        console.error('Erro ao gerar relatório por equipe e período:', error);
        res.status(500).json({
            success: false,
            message: 'Erro interno do servidor'
        });
    }
};

module.exports = {
    getRelatorioGeral,
    getRelatorioPorPeriodo,
    getRelatorioPorEquipe,
    getRelatorioPorEquipeEPeriodo
};

