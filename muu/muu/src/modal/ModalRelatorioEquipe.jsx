import { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import axios from "axios";

function ModalRelatorioEquipe({ show, onClose, onSubmit = () => {} }) {
  if (!show) return null;

  // 🔹 Pontuação dos itens
  const ITEM_PONTOS = {
    dinheiro: 9,
    arroz: 1,
    feijao: 2,
    acucar: 3,
    oleo: 4,
    macarrao: 5,
    fuba: 6,
    leite: 7,
    outro: 8,
  };

  // 🔹 Unidades
  const UNIDADES = {
    dinheiro: "R$",
    arroz: "kg",
    feijao: "kg",
    acucar: "kg",
    oleo: "L",
    macarrao: "unid.",
    fuba: "kg",
    leite: "L",
    outro: "unid.",
  };

  const [formData, setFormData] = useState({
    nomeEquipe: "",
    mentor: "",
    resumo: "",
    resultados: "",
    tipoImpacto: "dinheiro",
    quantidade: "",
    pontosTotais: 0,
    imagem: null,
    imagemPreview: null,
  });

  const [equipes, setEquipes] = useState([]);
  const [mentores, setMentores] = useState([]);
  const [loading, setLoading] = useState(false);

  // 🔹 Carrega equipes e mentores do backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [eqRes, menRes] = await Promise.all([
          axios.get("http://localhost:3001/api/equipes"),
          axios.get("http://localhost:3001/api/participantes"),
        ]);

        const equipesData = Array.isArray(eqRes.data)
          ? eqRes.data
          : eqRes.data?.data || [];

        const mentoresData = (Array.isArray(menRes.data)
          ? menRes.data
          : menRes.data?.data || []
        ).filter((p) => p.tipo === "mentor");

        setEquipes(equipesData);
        setMentores(mentoresData);
      } catch (error) {
        console.error("Erro ao carregar equipes ou mentores:", error);
      } finally {
        setLoading(false);
      }
    };

    if (show) fetchData();
  }, [show]);

  // 🔹 Atualiza dados do formulário e recalcula pontos
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
      setFormData((prev) => {
        const updated = { ...prev, [name]: value };

        if (name === "tipoImpacto" || name === "quantidade") {
          const fator = ITEM_PONTOS[updated.tipoImpacto] || 0;
          const qtd = parseFloat(updated.quantidade) || 0;
          updated.pontosTotais = fator * qtd;
        }

        return updated;
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.nomeEquipe || !formData.mentor || !formData.resumo) {
      alert("⚠️ Preencha todos os campos obrigatórios!");
      return;
    }

    const unidade = UNIDADES[formData.tipoImpacto] || "unid.";

    const envio = {
      ...formData,
      impacto: `${formData.quantidade} ${unidade}`,
      gerado_por: "Sistema",
    };

    onSubmit(envio);
  };

  // 🔹 Estrutura visual do modal
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
        {/* Cabeçalho */}
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
          <h2 style={{ margin: 0 }}>Criar Relatório de Equipe</h2>
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

        {/* Corpo */}
        {loading ? (
          <div style={{ padding: "2rem", textAlign: "center" }}>
            <p>⏳ Carregando equipes e mentores...</p>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            style={{
              padding: "1.8rem",
              display: "flex",
              flexDirection: "column",
              gap: "1rem",
            }}
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
                <option value="">Selecione uma equipe</option>
                {equipes.map((eq) => (
                  <option key={eq.id} value={eq.nome}>
                    {eq.nome}
                  </option>
                ))}
              </select>
            </div>

            {/* Mentor */}
            <div className="form-group">
              <label>Mentor</label>
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

            {/* Resumo */}
            <div className="form-group">
              <label>Resumo das Atividades</label>
              <textarea
                name="resumo"
                rows="3"
                value={formData.resumo}
                onChange={handleChange}
                required
              />
            </div>

            {/* Resultados */}
            <div className="form-group">
              <label>Resultados e Impactos</label>
              <textarea
                name="resultados"
                rows="2"
                value={formData.resultados}
                onChange={handleChange}
              />
            </div>

            {/* Tipo de Impacto */}
            <div className="form-group">
              <label>Tipo de Impacto</label>
              <select
                name="tipoImpacto"
                value={formData.tipoImpacto}
                onChange={handleChange}
              >
                {Object.keys(ITEM_PONTOS).map((item) => (
                  <option key={item} value={item}>
                    {item.charAt(0).toUpperCase() + item.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            {/* Quantidade */}
            <div className="form-group">
              <label>Quantidade ({UNIDADES[formData.tipoImpacto]})</label>
              <input
                type="number"
                name="quantidade"
                value={formData.quantidade}
                onChange={handleChange}
                required
              />
            </div>

            {/* Pontos totais */}
            <div className="form-group">
              <label>Pontos Obtidos</label>
              <input type="text" readOnly value={formData.pontosTotais} />
            </div>

            {/* Upload */}
            <div className="form-group">
              <label>Imagem (opcional)</label>
              <input type="file" accept="image/*" onChange={handleChange} />
              {formData.imagemPreview && (
                <img
                  src={formData.imagemPreview}
                  alt="Preview"
                  style={{
                    width: "120px",
                    height: "120px",
                    borderRadius: "8px",
                    marginTop: "1rem",
                    objectFit: "cover",
                  }}
                />
              )}
            </div>

            {/* Botões */}
            <div style={{ display: "flex", justifyContent: "flex-end", gap: "1rem" }}>
              <button type="button" onClick={onClose} className="btn btn-outline">
                Cancelar
              </button>
              <button type="submit" className="btn btn-primary">
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
