import loginService from "../Services/loginService.js";
import { publishEvent } from "../../event-bus/index.js";

export const Login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const result = await loginService.login(email, password);
    res.status(200).json(result);
  } catch (err) {
    res.status(401).json({ error: err.message });
  }
};

export const Register = async (req, res) => {
  const { email, password } = req.body;
  try {
    const result = await loginService.register(email, password);
    publishEvent("user.registered", { email }); 
    res.status(201).json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const ResetPassword = async (req, res) => {
  const { email, newPassword } = req.body;

  try {
    const user = await loginService.findUserByEmail(email);
    if (!user) {
      return res.status(404).json({ error: "Usuário não encontrado" });
    }

    await loginService.updatePassword(email, newPassword);
    publishEvent("user.password_reset", { email });
    return res.status(200).json({ message: "Senha redefinida com sucesso" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Erro ao redefinir a senha" });
  }
};

export const DeleteUser = async (req, res) => {
  const { email, password } = req.body;
  if (req.user.email !== email) {
    return res.status(403).json({ error: "Você só pode deletar sua própria conta" });
  }
  try {
    const result = await loginService.deleteUser(email, password);
    publishEvent("user.deleted", { email }); 
    res.status(200).json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};