import { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import axios from "axios";

function ModalRelatorioEquipe({ show, onClose, onSubmit = () => {} }) {
  const [formData, setFormData] = useState({
    nomeEquipe: "",
    mentor: "",
    resumo: "",
    resultados: "",
    tipoImpacto: "dinheiro",
    quantidade: "",
    imagem: null,
    imagemPreview: null,
  });

  const [equipes, setEquipes] = useState([]);
  const [mentores, setMentores] = useState([]);
  const [loading, setLoading] = useState(false);

  const UNIDADES = {
    dinheiro: "R$",
    arroz: "kg",
    oleo: "L",
    padrao: "unidades",
  };

  // ===========================================
  // 🔹 Carrega equipes e mentores do backend
  // ===========================================
  useEffect(() => {
    if (show) {
      const fetchData = async () => {
        try {
          setLoading(true);

          const [eqRes, menRes] = await Promise.all([
            axios.get("http://localhost:3001/api/equipes"),
            axios.get("http://localhost:3001/api/participantes"),
          ]);

          // ✅ Corrige formato (usa eqRes.data.data se existir)
          const equipesData = Array.isArray(eqRes.data)
            ? eqRes.data
            : eqRes.data?.data || [];

          // ✅ Filtra apenas mentores se vierem todos os participantes
          const mentoresData = (Array.isArray(menRes.data)
            ? menRes.data
            : menRes.data?.data || []
          ).filter((p) => p.tipo === "mentor");

          setEquipes(equipesData);
          setMentores(mentoresData);
        } catch (error) {
          console.error("❌ Erro ao carregar equipes ou mentores:", error);
        } finally {
          setLoading(false);
        }
      };

      fetchData();
    }
  }, [show]);

  if (!show) return null;

  // ===========================================
  // 🔹 Controle de formulário
  // ===========================================
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      const file = files[0];
      const previewUrl = URL.createObjectURL(file);
      setFormData((prev) => ({
        ...prev,
        imagem: file,
        imagemPreview: previewUrl,
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.nomeEquipe || !formData.mentor || !formData.resumo) {
      alert("⚠️ Preencha todos os campos obrigatórios!");
      return;
    }

    const unidade = UNIDADES[formData.tipoImpacto] || UNIDADES.padrao;

    const envio = {
      ...formData,
      impacto: `${formData.quantidade} ${unidade}`,
      gerado_por: "Sistema",
    };

    onSubmit(envio);
  };

  // ===========================================
  // 🔹 Renderização do modal
  // ===========================================
  const modalContent = (
    <div
      className="modal active"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        backgroundColor: "rgba(0,0,0,0.4)",
        zIndex: 3000,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        className="modal-content"
        style={{
          background: "white",
          maxWidth: "720px",
          width: "90%",
          maxHeight: "90vh",
          borderRadius: "12px",
          overflowY: "auto",
          animation: "modalSlideIn 0.3s ease",
        }}
      >
        {/* HEADER */}
        <div
          className="modal-header"
          style={{
            background: "linear-gradient(135deg, #1abc9c 0%, #16a085 100%)",
            color: "#fff",
            padding: "1.2rem 1.5rem",
            borderRadius: "12px 12px 0 0",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <h2 style={{ margin: 0, fontSize: "1.3rem" }}>Criar Relatório de Equipe</h2>
          <span
            onClick={onClose}
            style={{
              fontSize: "1.8rem",
              cursor: "pointer",
              fontWeight: "bold",
            }}
          >
            &times;
          </span>
        </div>

        {loading ? (
          <div style={{ padding: "2rem", textAlign: "center" }}>
            <p>⏳ Carregando equipes e mentores...</p>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            style={{ padding: "1.8rem", display: "flex", flexDirection: "column", gap: "1rem" }}
          >
            {/* Equipe */}
            <div className="form-group">
              <label>Equipe</label>
              <select
                name="nomeEquipe"
                value={formData.nomeEquipe}
                onChange={handleChange}
                required
              >
                <option value="">Selecione uma equipe existente</option>
                {equipes.map((eq) => (
                  <option key={eq.id} value={eq.nome}>
                    {eq.nome}
                  </option>
                ))}
              </select>
            </div>

            {/* Mentor */}
            <div className="form-group">
              <label>Mentor Responsável</label>
              <select
                name="mentor"
                value={formData.mentor}
                onChange={handleChange}
                required
              >
                <option value="">Selecione um mentor</option>
                {mentores.map((m) => (
                  <option key={m.id} value={m.nome}>
                    {m.nome}
                  </option>
                ))}
              </select>
            </div>

            {/* Campos adicionais */}
            <div className="form-group">
              <label>Resumo das Atividades</label>
              <textarea
                name="resumo"
                rows="3"
                value={formData.resumo}
                onChange={handleChange}
                placeholder="Descreva as atividades..."
                required
              />
            </div>

            <div className="form-group">
              <label>Resultados e Impactos</label>
              <textarea
                name="resultados"
                rows="2"
                value={formData.resultados}
                onChange={handleChange}
                placeholder="Descreva os resultados..."
              />
            </div>

            <div className="form-group">
              <label>Tipo de Impacto</label>
              <select
                name="tipoImpacto"
                value={formData.tipoImpacto}
                onChange={handleChange}
              >
                <option value="dinheiro">Dinheiro (R$)</option>
                <option value="arroz">Arroz (kg)</option>
                <option value="oleo">Óleo (L)</option>
              </select>
            </div>

            <div className="form-group">
              <label>Quantidade ({UNIDADES[formData.tipoImpacto]})</label>
              <input
                type="number"
                name="quantidade"
                value={formData.quantidade}
                onChange={handleChange}
                placeholder="Ex: 200"
                required
              />
            </div>

            {/* Upload de imagem */}
            <div className="form-group">
              <label>Imagem da Equipe</label>
              <input type="file" accept="image/*" onChange={handleChange} />
              {formData.imagemPreview && (
                <img
                  src={formData.imagemPreview}
                  alt="Prévia"
                  style={{
                    width: "120px",
                    height: "120px",
                    borderRadius: "50%",
                    objectFit: "cover",
                    marginTop: "1rem",
                    boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
                  }}
                />
              )}
            </div>

            {/* Botões */}
            <div
              className="form-actions"
              style={{ display: "flex", justifyContent: "flex-end", gap: "1rem" }}
            >
              <button
                type="button"
                onClick={onClose}
                style={{
                  border: "1px solid #ccc",
                  background: "white",
                  color: "#333",
                  padding: "0.6rem 1.2rem",
                  borderRadius: "8px",
                }}
              >
                Cancelar
              </button>
              <button
                type="submit"
                style={{
                  background: "#1abc9c",
                  border: "none",
                  color: "white",
                  padding: "0.6rem 1.2rem",
                  borderRadius: "8px",
                  fontWeight: "600",
                  cursor: "pointer",
                }}
              >
                Salvar Relatório
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );

  return ReactDOM.createPortal(modalContent, document.body);
}

export default ModalRelatorioEquipe;
