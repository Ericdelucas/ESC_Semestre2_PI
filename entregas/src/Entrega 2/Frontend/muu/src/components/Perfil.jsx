import { useState, useEffect } from "react";
import axios from "axios";

function Perfil({ active, user, onUserUpdate, onLogout, onDeleteAccount }) {
  const [nome, setNome] = useState(user?.name || "");
  const [foto, setFoto] = useState(null);
  const [mensagem, setMensagem] = useState("");

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (user) setNome(user.name || "");
  }, [user]);

  if (!user) return null;

  // 🔄 Atualizar nome do perfil
  const handleUpdate = async () => {
    if (!nome.trim()) {
      setMensagem("⚠️ O nome não pode estar vazio.");
      return;
    }

    try {
      const res = await axios.put(
        `http://localhost:3001/api/auth/update/${user.id}`,
        { nome },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const updatedUser = { ...user, name: nome };
      onUserUpdate(updatedUser);
      setMensagem(res.data.message || "✅ Perfil atualizado com sucesso!");
    } catch (error) {
      console.error("Erro ao atualizar perfil:", error);
      setMensagem("❌ Erro ao atualizar perfil.");
    }
  };

  // ❌ Deletar conta
  const handleDelete = async () => {
    if (!window.confirm("Tem certeza que deseja excluir sua conta?")) return;

    try {
      await axios.delete("http://localhost:3001/api/auth/delete", {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Conta excluída com sucesso!");
      onDeleteAccount();
    } catch (error) {
      console.error("Erro ao deletar conta:", error);
      setMensagem("❌ Erro ao deletar conta.");
    }
  };

  return (
    <section className={`section perfil-page ${active ? "active" : ""}`}>
      <div className="perfil-container">
        <h2 style={{ color: "#146C43", textAlign: "center" }}>Meu Perfil</h2>

        {/* FOTO DO USUÁRIO */}
        <div className="foto-container">
          <div
            style={{
              width: "120px",
              height: "120px",
              borderRadius: "50%",
              border: "3px solid #146C43",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              overflow: "hidden",
              backgroundColor: "#e8f5ee",
            }}
          >
            {foto ? (
              <img
                src={URL.createObjectURL(foto)}
                alt="Foto de perfil"
                className="perfil-foto"
              />
            ) : (
              <span style={{ color: "#666" }}>Sem foto</span>
            )}
          </div>

          <label
            style={{
              color: "#146C43",
              fontWeight: "600",
              cursor: "pointer",
              marginTop: "8px",
            }}
          >
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setFoto(e.target.files[0])}
              style={{ display: "none" }}
            />
            Alterar foto
          </label>
        </div>

        {/* INFORMAÇÕES */}
        <div className="perfil-info">
          <label>Nome</label>
          <input
            type="text"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
          />

          <label>Email</label>
          <input type="text" value={user?.email || ""} disabled />

          <label>Tipo de Usuário</label>
          <input type="text" value={user?.tipo || ""} disabled />

          {/* BOTÕES */}
          <button className="btn btn-primary" onClick={handleUpdate}>
            Atualizar Perfil
          </button>

          <button className="btn btn-danger" onClick={handleDelete}>
            Deletar Conta
          </button>

          {mensagem && (
            <p style={{ marginTop: "1rem", color: "#555" }}>{mensagem}</p>
          )}
        </div>
      </div>
    </section>
  );
}

export default Perfil;
