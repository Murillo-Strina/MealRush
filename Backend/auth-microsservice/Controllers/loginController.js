import loginService from "../Services/loginService.js";

export const Login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const result = await loginService.login(email, password);
    res.status(200).json(result);
  } catch (err) {
    res.status(401).json({ error: err.message });
  }
};

export const UpdatePassword = async (req, res) => {
  const { email, oldPassword, newPassword } = req.body;
  if (req.user.email !== email) {
    return res.status(403).json({ error: "Você só pode alterar sua própria conta" });
  }
  try {
    const result = await loginService.updatePassword(email, oldPassword, newPassword);
    res.status(200).json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const DeleteUser = async (req, res) => {
  const { email, password } = req.body;
  if (req.user.email !== email) {
    return res.status(403).json({ error: "Você só pode deletar sua própria conta" });
  }
  try {
    const result = await loginService.deleteUser(email, password);
    res.status(200).json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};