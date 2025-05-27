import db from "../Database/connection.js";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, "../../.env") });

class AuthService {
  hashPassword(password) {
    if (!process.env.LOGIN_PASSWORD_JWT_SECRET) {
        throw new Error("Variável de ambiente LOGIN_PASSWORD_JWT_SECRET não está definida para o hash da senha.");
    }
    return crypto
      .createHmac("sha256", process.env.LOGIN_PASSWORD_JWT_SECRET)
      .update(password)
      .digest("hex");
  }

  async login(email, password) {
    const hashedPassword = this.hashPassword(password);

    // Busca usuário no banco (seleciona apenas email para confirmação e payload do token)
    const [users] = await db.promise().query(
      "SELECT email, hashedPassword FROM users WHERE email = ? AND hashedPassword = ?",
      [email, hashedPassword]
    );

    if (users.length === 0) {
      throw new Error("Usuário ou senha inválidos");
    }

    const user = users[0];

    const token = jwt.sign(
      { email: user.email }, 
      process.env.LOGIN_PASSWORD_JWT_SECRET,
      { expiresIn: "1h" }
    );

    // Retorna o email do usuário
    return { token, user: { email: user.email } };
  }

  async register(email, password) {
    // 1. Verificar se o usuário já existe
    const [existingUsers] = await db.promise().query(
      "SELECT email FROM users WHERE email = ?",
      [email]
    );

    if (existingUsers.length > 0) {
      throw new Error("Este e-mail já está cadastrado.");
    }

    // 2. Fazer o hash da senha
    const hashedPassword = this.hashPassword(password);

    // 3. Inserir o novo usuário no banco de dados
    // Tabela 'users' agora só precisa de 'email' e 'hashedPassword' (e outras colunas que não sejam ID auto-increment)
    const [result] = await db.promise().query(
      "INSERT INTO users (email, hashedPassword) VALUES (?, ?)",
      [email, hashedPassword]
    );

    if (result.affectedRows === 0) {
      throw new Error("Não foi possível registrar o usuário.");
    }

    // Como não há 'id' auto-incrementado, não usamos result.insertId
    // Retornamos o email como identificador
    return {
      message: "Usuário registrado com sucesso!",
      user: {
        email: email,
      },
    };
  }

  async updatePassword(email, oldPassword, newPassword) {
    const hashedOldPassword = this.hashPassword(oldPassword);

    // Verifica se o usuário existe e a senha antiga está correta
    // Não precisamos selecionar um 'id' específico, apenas confirmar a existência
    const [users] = await db.promise().query(
      "SELECT email FROM users WHERE email = ? AND hashedPassword = ?", // Pode ser qualquer coluna para verificar a linha
      [email, hashedOldPassword]
    );

    if (users.length === 0) {
      throw new Error("Usuário ou senha antiga inválidos");
    }

    const hashedNewPassword = this.hashPassword(newPassword);

    const [updateResult] = await db.promise().query(
      "UPDATE users SET hashedPassword = ? WHERE email = ?",
      [hashedNewPassword, email]
    );

    if (updateResult.affectedRows === 0) {
        throw new Error("Não foi possível atualizar a senha. Usuário não encontrado ou dados inalterados.");
    }

    return { message: "Senha atualizada com sucesso" };
  }

  async deleteUser(email, password) {
    const hashedPassword = this.hashPassword(password);

    // Verifica se o usuário existe e a senha está correta
    const [users] = await db.promise().query(
      "SELECT email FROM users WHERE email = ? AND hashedPassword = ?", // Pode ser qualquer coluna
      [email, hashedPassword]
    );

    if (users.length === 0) {
      throw new Error("Usuário ou senha inválidos para exclusão");
    }

    const [deleteResult] = await db.promise().query(
        "DELETE FROM users WHERE email = ?",
        [email]
    );

    if (deleteResult.affectedRows === 0) {
        throw new Error("Não foi possível excluir o usuário. Usuário não encontrado.");
    }

    return { message: "Usuário excluído com sucesso" };
  }
}

export default new AuthService();
