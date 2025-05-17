import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config({ path: '../.env' });

export function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer <token>

  if (!token) return res.status(401).json({ error: "Token não fornecido" });

  jwt.verify(token, process.env.LOGIN_PASSWORD_JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: "Token inválido" });
    req.user = user;
    next();
  });
}