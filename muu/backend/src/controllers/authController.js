import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "segredo_teste";

export async function register(req, res) {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password)
      return res.status(400).json({ error: "Preencha todos os campos" });

    const users = await req.app.locals.executeQuery(
      "SELECT * FROM participantes WHERE email = ?",
      [email]
    );
    if (users.length > 0)
      return res.status(400).json({ error: "Email já registrado" });

    const hashed = await bcrypt.hash(password, 10);
    await req.app.locals.executeQuery(
      "INSERT INTO participantes (nome, email, tipo) VALUES (?, ?, 'usuario')",
      [name, email]
    );
    await req.app.locals.executeQuery(
      "UPDATE participantes SET telefone = ? WHERE email = ?",
      [hashed, email]
    );

    res.status(201).json({ message: "Usuário registrado com sucesso!" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export async function login(req, res) {
  try {
    const { email, password } = req.body;

    const users = await req.app.locals.executeQuery(
      "SELECT * FROM participantes WHERE email = ?",
      [email]
    );
    if (users.length === 0)
      return res.status(404).json({ error: "Usuário não encontrado" });

    const user = users[0];
    const valid = await bcrypt.compare(password, user.telefone); // usando telefone como senha (ajuste se tiver coluna password)
    if (!valid) return res.status(401).json({ error: "Senha incorreta" });

    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, {
      expiresIn: "1h",
    });

    res.json({ message: "Login realizado com sucesso", token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export async function logout(req, res) {
  res.json({ message: "Logout realizado!" });
}

export async function changePassword(req, res) {
  try {
    const { email, oldPassword, newPassword } = req.body;

    const users = await req.app.locals.executeQuery(
      "SELECT * FROM participantes WHERE email = ?",
      [email]
    );
    if (users.length === 0)
      return res.status(404).json({ error: "Usuário não encontrado" });

    const user = users[0];
    const valid = await bcrypt.compare(oldPassword, user.telefone);
    if (!valid) return res.status(401).json({ error: "Senha antiga incorreta" });

    const hashed = await bcrypt.hash(newPassword, 10);
    await req.app.locals.executeQuery(
      "UPDATE participantes SET telefone = ? WHERE email = ?",
      [hashed, email]
    );

    res.json({ message: "Senha alterada com sucesso!" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export async function deleteAccount(req, res) {
  try {
    const { email, password } = req.body;

    const users = await req.app.locals.executeQuery(
      "SELECT * FROM participantes WHERE email = ?",
      [email]
    );
    if (users.length === 0)
      return res.status(404).json({ error: "Usuário não encontrado" });

    const user = users[0];
    const valid = await bcrypt.compare(password, user.telefone);
    if (!valid) return res.status(401).json({ error: "Senha incorreta" });

    await req.app.locals.executeQuery("DELETE FROM participantes WHERE email = ?", [
      email,
    ]);
    res.json({ message: "Conta deletada com sucesso!" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
