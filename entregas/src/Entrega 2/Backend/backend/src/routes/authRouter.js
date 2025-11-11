import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { connection } from "../database.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || "troque_este_segredo_super_seguro";

// 🔐 Gera token JWT
const generateToken = (user) => {
  return jwt.sign(
    { id: user.id, email: user.email, tipo: user.tipo },
    JWT_SECRET,
    { expiresIn: "2h" }
  );
};

// 📝 Registrar novo usuário
router.post("/register", async (req, res) => {
  try {
    const { name, email, password, tipo } = req.body;
    if (!name || !email || !password)
      return res.status(400).json({ error: "Preencha todos os campos obrigatórios" });

    const [exists] = await connection.query("SELECT * FROM usuarios WHERE email = ?", [email]);
    if (exists.length > 0)
      return res.status(400).json({ error: "Email já cadastrado" });

    const hashed = await bcrypt.hash(password, 10);
    const [result] = await connection.query(
      "INSERT INTO usuarios (name, email, password, tipo) VALUES (?, ?, ?, ?)",
      [name, email, hashed, tipo || "aluno"]
    );

    const newUser = { id: result.insertId, name, email, tipo: tipo || "aluno" };
    const token = generateToken(newUser);

    res.status(201).json({ message: "Usuário registrado com sucesso", user: newUser, token });
  } catch (error) {
    console.error("Erro no registro:", error);
    res.status(500).json({ error: "Erro interno no servidor" });
  }
});

// 🔑 Login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ error: "Email e senha são obrigatórios" });

    const [rows] = await connection.query("SELECT * FROM usuarios WHERE email = ?", [email]);
    if (rows.length === 0)
      return res.status(404).json({ error: "Usuário não encontrado" });

    const user = rows[0];
    const match = await bcrypt.compare(password, user.password);
    if (!match)
      return res.status(401).json({ error: "Senha incorreta" });

    const token = generateToken(user);

    res.json({
      message: "Login bem-sucedido",
      token,
      user: { id: user.id, name: user.name, email: user.email, tipo: user.tipo },
    });
  } catch (error) {
    console.error("Erro no login:", error);
    res.status(500).json({ error: "Erro interno no servidor" });
  }
});

// 🔁 Esqueci minha senha
router.post("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: "Informe o email" });

    const [rows] = await connection.query("SELECT * FROM usuarios WHERE email = ?", [email]);
    if (rows.length === 0)
      return res.status(404).json({ error: "Usuário não encontrado" });

    const tempPass = Math.random().toString(36).slice(-8);
    const hashed = await bcrypt.hash(tempPass, 10);
    await connection.query("UPDATE usuarios SET password = ? WHERE email = ?", [hashed, email]);

    console.log(`Senha temporária de ${email}: ${tempPass}`);
    res.json({ message: "Senha temporária gerada (veja o console do servidor)." });
  } catch (error) {
    console.error("Erro ao redefinir senha:", error);
    res.status(500).json({ error: "Erro interno no servidor" });
  }
});

// 🧩 Atualizar nome (rota protegida)
router.put("/update/:id", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const { nome } = req.body;

    if (req.user.id !== parseInt(id))
      return res.status(403).json({ error: "Você não pode editar outro usuário" });

    await connection.query("UPDATE usuarios SET name = ? WHERE id = ?", [nome, id]);
    res.json({ message: "Perfil atualizado com sucesso", nome });
  } catch (error) {
    console.error("Erro ao atualizar perfil:", error);
    res.status(500).json({ error: "Erro interno no servidor" });
  }
});

// ❌ Deletar conta (rota protegida)
router.delete("/delete", authMiddleware, async (req, res) => {
  try {
    const [result] = await connection.query("DELETE FROM usuarios WHERE id = ?", [req.user.id]);
    if (result.affectedRows === 0)
      return res.status(404).json({ error: "Usuário não encontrado" });

    res.json({ message: "Conta excluída com sucesso" });
  } catch (error) {
    console.error("Erro ao excluir conta:", error);
    res.status(500).json({ error: "Erro interno no servidor" });
  }
});

// 🔒 Retornar dados do usuário logado
router.get("/me", authMiddleware, async (req, res) => {
  try {
    const [rows] = await connection.query(
      "SELECT id, name, email, tipo FROM usuarios WHERE id = ?",
      [req.user.id]
    );

    if (rows.length === 0)
      return res.status(404).json({ error: "Usuário não encontrado" });

    res.json({ user: rows[0] });
  } catch (error) {
    res.status(401).json({ error: "Token inválido ou expirado" });
  }
});

export default router;
