import React, { useEffect, useState } from "react";
import axios from "axios";

const Perfil = ({ onLogout }) => {
  const [user, setUser] = useState(null);
  const [nome, setNome] = useState("");
  const [foto, setFoto] = useState(null);
  const [mensagem, setMensagem] = useState("");

  const token = localStorage.getItem("token");

  // 🔄 Buscar dados do usuário
  useEffect(() => {
    const fetchUser = async () => {
      try {
        if (!token) {
          setMensagem("Sessão expirada. Faça login novamente.");
          if (onLogout) onLogout();
          return;
        }

        const res = await axios.get("http://localhost:3001/api/auth/me", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setUser(res.data.user);
        setNome(res.data.user.name);
      } catch (error) {
        console.error("Erro ao carregar perfil:", error);
        setMensagem("Token inválido ou expirado. Faça login novamente.");
        localStorage.removeItem("token");
        if (onLogout) onLogout();
      }
    };

    fetchUser();
    // ❌ não colocar onLogout nas dependências → causa reexecuções infinitas
  }, [token]);

  // ✏️ Atualizar nome
  const handleUpdate = async () => {
    try {
      if (!nome.trim()) {
        setMensagem("O nome não pode estar vazio.");
        return;
      }

      const res = await axios.put(
        `http://localhost:3001/api/auth/update/${user.id}`,
        { nome },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setMensagem(res.data.message || "Perfil atualizado com sucesso!");
    } catch (error) {
      console.error("Erro ao atualizar perfil:", error);
      setMensagem("Erro ao atualizar perfil.");
    }
  };

  // 🗑️ Deletar conta
  const handleDelete = async () => {
    try {
      if (!token) {
        setMensagem("Sessão expirada. Faça login novamente.");
        if (onLogout) onLogout();
        return;
      }

      const confirmar = window.confirm("Tem certeza que deseja deletar sua conta?");
      if (!confirmar) return;

      const res = await axios.delete("http://localhost:3001/api/auth/delete", {
        headers: { Authorization: `Bearer ${token}` },
      });

      alert(res.data.message || "Conta excluída com sucesso.");
      localStorage.removeItem("token");
      if (onLogout) onLogout();
    } catch (error) {
      console.error("Erro ao deletar conta:", error);
      setMensagem("Erro ao deletar conta. Tente novamente mais tarde.");
    }
  };

  if (!user) {
    return (
      <div className="perfil-page text-center">
        <p>{mensagem || "Carregando perfil..."}</p>
      </div>
    );
  }

  return (
    <div className="perfil-page">
      <h2 style={{ color: "#146C43", textAlign: "center", marginBottom: "1.5rem" }}>
        Meu Perfil
      </h2>

      <div className="perfil-container">
        {/* Foto de perfil */}
        <div className="foto-container">
          {foto ? (
            <img
              src={URL.createObjectURL(foto)}
              alt="Foto de perfil"
              className="perfil-foto"
            />
          ) : (
            <div
              style={{
                width: "120px",
                height: "120px",
                borderRadius: "50%",
                backgroundColor: "#e8f5ee",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#666",
                marginBottom: "1rem",
              }}
            >
              Sem foto
            </div>
          )}

          <label className="btn btn-primary" style={{ cursor: "pointer" }}>
            Escolher foto
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setFoto(e.target.files[0])}
              style={{ display: "none" }}
            />
          </label>
        </div>

        {/* Nome */}
        <div className="perfil-info">
          <label>Nome:</label>
          <input
            type="text"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
          />

          <button className="btn btn-primary" onClick={handleUpdate}>
            Atualizar Perfil
          </button>

          <button className="btn btn-danger" onClick={handleDelete}>
            Deletar Conta
          </button>

          {mensagem && (
            <p style={{ marginTop: "1rem", textAlign: "center", color: "#555" }}>
              {mensagem}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Perfil;
