import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "troque_este_segredo_super_seguro";

export default function authMiddleware(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Token não fornecido" });
    }

    const token = authHeader.split(" ")[1];
    const payload = jwt.verify(token, JWT_SECRET);

    req.user = { id: payload.id, email: payload.email, tipo: payload.tipo };
    next();
  } catch (err) {
    return res.status(401).json({ error: "Token inválido ou expirado" });
  }
}
