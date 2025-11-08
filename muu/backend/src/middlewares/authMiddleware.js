// Middleware de autenticação para proteger rotas 
import jwt from "jsonwebtoken";
// Carregar variável de ambiente para a chave secreta do JWT
const JWT_SECRET = process.env.JWT_SECRET || "troque_este_segredo_super_seguro";
// Função middleware
export default function authMiddleware(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Token não fornecido" });
    }
    // Extrair token do cabeçalho
    const token = authHeader.split(" ")[1];
    const payload = jwt.verify(token, JWT_SECRET);
    // Anexar informações do usuário ao objeto de requisição
    req.user = { id: payload.id, email: payload.email, tipo: payload.tipo };
    next();
  } catch (err) {
    return res.status(401).json({ error: "Token inválido ou expirado" });
  }
}
