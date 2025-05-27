import AuthService from "../Services/authService.js";

class AuthController {
  async Login(req, res) {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: "E-mail e senha são obrigatórios." });
    }
    try {
      const result = await AuthService.login(email, password);
      // O 'result.user' agora só terá 'email'
      res.status(200).json(result);
    } catch (err) {
      res.status(401).json({ error: err.message });
    }
  }

  async RegisterUser(req, res) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({ error: "E-mail e senha são obrigatórios para o registro." });
      }

      // Validações mais robustas (formato de e-mail, força da senha) podem ser adicionadas aqui
      // ex: if (!/\S+@\S+\.\S+/.test(email)) { return res.status(400).json({ error: "Formato de e-mail inválido."}); }
      // ex: if (password.length < 6) { return res.status(400).json({ error: "A senha deve ter pelo menos 6 caracteres."}); }

      const result = await AuthService.register(email, password);
      // O 'result.user' agora só terá 'email'
      res.status(201).json(result);
    } catch (error) {
      if (error.message === "Este e-mail já está cadastrado.") {
        return res.status(409).json({ error: error.message });
      }
      console.error("Erro no controller de registro:", error.message);
      res.status(500).json({ error: "Erro interno do servidor ao tentar registrar usuário." });
    }
  }

  async UpdatePassword(req, res) {
    const { email, oldPassword, newPassword } = req.body;

    if (!email || !oldPassword || !newPassword) {
      return res.status(400).json({ error: "E-mail, senha antiga e nova senha são obrigatórios."});
    }
    if (newPassword.length < 6) { // Exemplo simples de validação
      return res.status(400).json({ error: "A nova senha deve ter pelo menos 6 caracteres."});
    }

    if (!req.user) { // req.user é populado pelo middleware de autenticação
       return res.status(401).json({ error: "Acesso não autorizado. Token inválido ou não fornecido." });
    }
    // req.user.email ainda é válido aqui, pois o token JWT agora contém o email
    if (req.user.email !== email) {
      return res.status(403).json({ error: "Ação não permitida. Você só pode alterar sua própria senha." });
    }

    try {
      const result = await AuthService.updatePassword(email, oldPassword, newPassword);
      res.status(200).json(result);
    } catch (err) {
      if (err.message === "Usuário ou senha antiga inválidos") {
          return res.status(401).json({ error: err.message });
      }
      console.error("Erro ao atualizar senha:", err.message);
      res.status(400).json({ error: err.message });
    }
  }

  async DeleteUser(req, res) {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "E-mail e senha são obrigatórios para exclusão." });
    }

    if (!req.user) { // req.user é populado pelo middleware de autenticação
       return res.status(401).json({ error: "Acesso não autorizado. Token inválido ou não fornecido." });
    }
    // req.user.email ainda é válido aqui
    if (req.user.email !== email) {
      return res.status(403).json({ error: "Ação não permitida. Você só pode excluir sua própria conta." });
    }
    try {
      const result = await AuthService.deleteUser(email, password);
      res.status(200).json(result);
    } catch (err) {
      if (err.message === "Usuário ou senha inválidos para exclusão") {
          return res.status(401).json({ error: err.message });
      }
      console.error("Erro ao excluir usuário:", err.message);
      res.status(400).json({ error: err.message });
    }
  }
}

export default new AuthController();
