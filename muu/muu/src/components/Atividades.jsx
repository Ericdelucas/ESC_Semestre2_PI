import { useState, useEffect } from "react";
import { atividadesService, equipesService } from "../services/api";

function Atividades({ active, atividades, setAtividades, equipes: equipesProp }) {
  const [showModal, setShowModal] = useState(false);
  const [editingAtividade, setEditingAtividade] = useState(null);
  const [loading, setLoading] = useState(false);
  const [equipes, setEquipes] = useState(equipesProp || []);
  const [formData, setFormData] = useState({
    nome: "",
    tipo: "",
    equipeId: "",
    meta_pontos: "",
    pontos_arrecadados: "",
    descricao: ""
  });

  const tiposAtividade = [
    "Arrecadação de Alimentos",
    "Arrecadação de Roupas",
    "Arrecadação de Dinheiro",
    "Workshop",
    "Palestra",
    "Visita Social",
    "Campanha de Conscientização",
    "Outro"
  ];

  // 🔹 Carrega equipes direto do backend se não vierem via props
  useEffect(() => {
    const fetchEquipes = async () => {
      try {
        const res = await equipesService.getAll();
        const data = Array.isArray(res.data)
          ? res.data
          : res.data?.data || [];
        setEquipes(data);
      } catch (error) {
        console.error("Erro ao carregar equipes:", error);
      }
    };

    if (!equipesProp || equipesProp.length === 0) {
      fetchEquipes();
    }
  }, [equipesProp]);

  // 🔹 Carregar atividades ao abrir a aba
  useEffect(() => {
    if (active) loadAtividades();
  }, [active]);

  const loadAtividades = async () => {
    try {
      setLoading(true);
      const response = await atividadesService.getAll();
      const data = Array.isArray(response.data)
        ? response.data
        : response.data?.data || [];
      setAtividades(data);
    } catch (error) {
      console.error("Erro ao carregar atividades:", error);
      alert("Erro ao carregar atividades. Verifique se o backend está rodando.");
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Criar ou atualizar atividade
  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      nome: formData.nome,
      tipo: formData.tipo,
      equipe_id: formData.equipeId || null,
      meta_pontos: Number(formData.meta_pontos) || 0,
      pontos_arrecadados: Number(formData.pontos_arrecadados) || 0,
      descricao: formData.descricao
    };

    try {
      setLoading(true);
      if (editingAtividade) {
        await atividadesService.update(editingAtividade.id, payload);
      } else {
        await atividadesService.create(payload);
      }
      await loadAtividades();
      resetForm();
      alert(editingAtividade ? "Atividade atualizada com sucesso!" : "Atividade criada com sucesso!");
    } catch (error) {
      console.error("Erro ao salvar atividade:", error);
      alert("Erro ao salvar atividade. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (atividade) => {
    setEditingAtividade(atividade);
    setFormData({
      nome: atividade.nome,
      tipo: atividade.tipo,
      equipeId: atividade.equipe_id || atividade.equipeId || "",
      meta_pontos: atividade.meta_pontos || 0,
      pontos_arrecadados: atividade.pontos_arrecadados || 0,
      descricao: atividade.descricao || ""
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!confirm("Tem certeza que deseja excluir esta atividade?")) return;
    try {
      setLoading(true);
      await atividadesService.delete(id);
      await loadAtividades();
      alert("Atividade excluída com sucesso!");
    } catch (error) {
      console.error("Erro ao excluir atividade:", error);
      alert("Erro ao excluir atividade. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      nome: "",
      tipo: "",
      equipeId: "",
      meta_pontos: "",
      pontos_arrecadados: "",
      descricao: ""
    });
    setEditingAtividade(null);
    setShowModal(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // ✅ Usa o nome da equipe corretamente, mesmo se vier como ID
  const getEquipeNome = (atividade) => {
    if (atividade.equipe_nome) return atividade.equipe_nome;
    const equipeId = atividade.equipe_id || atividade.equipeId;
    const equipe = equipes.find((e) => e.id === parseInt(equipeId));
    return equipe ? equipe.nome : "—";
  };

  const formatPoints = (value) => (!value ? "0 pts" : `${value.toLocaleString("pt-BR")} pts`);

  const getProgressPercentage = (a, m) => {
    const arrecadado = Number(a);
    const meta = Number(m);
    if (!meta || meta <= 0) return 0;
    return Math.min((arrecadado / meta) * 100, 100);
  };

  if (!active) return null;

  return (
    <section className="section active">
      <div className="container">
        <div className="section-header">
          <h2>Gerenciamento de Atividades</h2>
          <button className="btn btn-primary" onClick={() => setShowModal(true)} disabled={loading}>
            <i className="fas fa-plus"></i> Nova Atividade
          </button>
        </div>

        {loading && (
          <div className="loading-message">
            <i className="fas fa-spinner fa-spin"></i> Carregando...
          </div>
        )}

        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Nome</th>
                <th>Tipo</th>
                <th>Equipe</th>
                <th>Meta</th>
                <th>Arrecadado</th>
                <th>Progresso</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {atividades.length === 0 ? (
                <tr>
                  <td colSpan="7" className="no-data">
                    <i className="fas fa-info-circle"></i>
                    Nenhuma atividade cadastrada. Clique em "Nova Atividade" para começar.
                  </td>
                </tr>
              ) : (
                atividades.map((atividade) => (
                  <tr key={atividade.id}>
                    <td>{atividade.nome}</td>
                    <td>{atividade.tipo}</td>
                    <td>{getEquipeNome(atividade)}</td>
                    <td>{formatPoints(atividade.meta_pontos)}</td>
                    <td>{formatPoints(atividade.pontos_arrecadados)}</td>
                    <td>
                      <div style={{ width: "100px", height: "10px", background: "#eee", borderRadius: "5px", overflow: "hidden" }}>
                        <div
                          style={{
                            width: `${getProgressPercentage(atividade.pontos_arrecadados, atividade.meta_pontos)}%`,
                            height: "100%",
                            backgroundColor: "#28a745",
                            transition: "width 0.3s ease"
                          }}
                        ></div>
                      </div>
                      <small>
                        {getProgressPercentage(atividade.pontos_arrecadados, atividade.meta_pontos).toFixed(1)}%
                      </small>
                    </td>
                    <td>
                      <div className="action-buttons">
                        <button className="btn btn-sm btn-outline" onClick={() => handleEdit(atividade)} disabled={loading}>
                          <i className="fas fa-edit"></i>
                        </button>
                        <button className="btn btn-sm btn-danger" onClick={() => handleDelete(atividade.id)} disabled={loading}>
                          <i className="fas fa-trash"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {showModal && (
          <div className="modal active">
            <div className="modal-content">
              <div className="modal-header">
                <h2>{editingAtividade ? "Editar Atividade" : "Nova Atividade"}</h2>
                <span className="close" onClick={resetForm}>&times;</span>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label>Nome da Atividade:</label>
                  <input type="text" name="nome" value={formData.nome} onChange={handleChange} required />
                </div>

                <div className="form-group">
                  <label>Tipo:</label>
                  <select name="tipo" value={formData.tipo} onChange={handleChange} required>
                    <option value="">Selecione o tipo...</option>
                    {tiposAtividade.map((tipo) => (
                      <option key={tipo} value={tipo}>{tipo}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>Equipe:</label>
                  <select name="equipeId" value={formData.equipeId} onChange={handleChange} required>
                    <option value="">Selecione uma equipe...</option>
                    {equipes.map((equipe) => (
                      <option key={equipe.id} value={equipe.id}>{equipe.nome}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>Meta (pontos):</label>
                  <input type="number" name="meta_pontos" value={formData.meta_pontos} onChange={handleChange} />
                </div>

                <div className="form-group">
                  <label>Arrecadado (pontos):</label>
                  <input type="number" name="pontos_arrecadados" value={formData.pontos_arrecadados} onChange={handleChange} />
                </div>

                <div className="form-group">
                  <label>Descrição:</label>
                  <textarea name="descricao" rows="3" value={formData.descricao} onChange={handleChange} />
                </div>

                <div className="modal-actions">
                  <button type="button" className="btn btn-outline" onClick={resetForm} disabled={loading}>Cancelar</button>
                  <button type="submit" className="btn btn-primary" disabled={loading}>
                    {loading ? <><i className="fas fa-spinner fa-spin"></i> Salvando...</> : <><i className="fas fa-save"></i> {editingAtividade ? "Atualizar" : "Criar"}</>}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

export default Atividades;
