import db from "../Database/connection.js";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import dotenv from "dotenv";
dotenv.config({ path: '../.env' });

class LoginService {
  hashPassword(password) {
    // Usa HMAC com SHA256 e o segredo do .env
    return crypto
      .createHmac("sha256", process.env.LOGIN_PASSWORD_JWT_SECRET)
      .update(password)
      .digest("hex");
  }

  async login(email, password) {
    const hashedPassword = this.hashPassword(password);

    // Busca usuário no banco
    const [users] = await db.promise().query(
      "SELECT * FROM users WHERE email = ? AND hashedPassword = ?",
      [email, hashedPassword]
    );

    if (users.length === 0) {
      throw new Error("Usuário ou senha inválidos");
    }

    // Gera JWT
    const token = jwt.sign(
      { id: users[0].id, email: users[0].email },
      process.env.LOGIN_PASSWORD_JWT_SECRET,
      { expiresIn: "1h" }
    );

    return { token, user: { id: users[0].id, email: users[0].email } };
  }

  async updatePassword(email, oldPassword, newPassword) {
    const hashedOldPassword = this.hashPassword(oldPassword);

    // Verifica se o usuário existe e a senha antiga está correta
    const [users] = await db.promise().query(
      "SELECT * FROM users WHERE email = ? AND hashedPassword = ?",
      [email, hashedOldPassword]
    );

    if (users.length === 0) {
      throw new Error("Usuário ou senha antiga inválidos");
    }

    const hashedNewPassword = this.hashPassword(newPassword);

    await db.promise().query(
      "UPDATE users SET hashedPassword = ? WHERE email = ?",
      [hashedNewPassword, email]
    );

    return { message: "Senha atualizada com sucesso" };
  }

  async deleteUser(email, password) {
    const hashedPassword = this.hashPassword(password);

    // Verifica se o usuário existe e a senha está correta
    const [users] = await db.promise().query(
      "SELECT * FROM users WHERE email = ? AND hashedPassword = ?",
      [email, hashedPassword]
    );

    if (users.length === 0) {
      throw new Error("Usuário ou senha inválidos");
    }

    await db.promise().query(
      "DELETE FROM users WHERE email = ?",
      [email]
    );

    return { message: "Usuário excluído com sucesso" };
  }
}

export default new LoginService();