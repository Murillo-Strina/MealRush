import { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import logoMealRush from "../assets/images/logo_mealrush_transparent.png";

const ForgottenPasswordScreen = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [emailConfirmed, setEmailConfirmed] = useState(false);

  const colors = {
    darkPrimary: '#1A202C',
    accent: '#00C9A7',
    lightNeutral: '#F7FAFC',
    mediumNeutral: '#E2E8F0',
    textDark: '#2D3748',
    textSubtleLightBg: '#718096',
  };

  const inputStyle = {
    backgroundColor: '#FFFFFF',
    borderColor: colors.mediumNeutral,
    color: colors.textDark,
    height: '50px',
    fontSize: '1rem',
    boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.075)'
  };

  const handleCheckEmail = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const response = await axios.post('http://localhost:3020/user/reset', {
        email,
        newPassword: password
      });
      setSuccess(true);
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      if (err.response && err.response.status === 404) {
        setError('E-mail não encontrado');
        setEmailConfirmed(false);
      } else {
        setError('Erro ao redefinir senha');
      }
    }
  };

  return (
    <div className="d-flex align-items-center justify-content-center" style={{ minHeight: '100vh', backgroundColor: colors.lightNeutral, padding: '1rem' }}>
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-sm-10 col-md-8 col-lg-6 col-xl-4">
            <div className="card p-4 p-md-5 shadow-lg rounded-4 border-0" style={{ animation: 'fadeInUp 0.5s ease-out' }}>
              <div className="col-12 mb-3">
                <Link
                  to="/login"
                  className="btn rounded-pill px-4 py-2"
                  style={{
                    backgroundColor: colors.accent,
                    color: colors.darkPrimary,
                    fontWeight: 'bold',
                    transition: 'background-color 0.2s ease, transform 0.2s ease'
                  }}
                  onMouseOver={e => e.currentTarget.style.transform = 'scale(1.05)'}
                  onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="bi bi-arrow-left-short me-1" viewBox="0 0 16 16">
                    <path fillRule="evenodd" d="M12 8a.5.5 0 0 1-.5.5H5.707l2.147 2.146a.5.5 0 0 1-.708.708l-3-3a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L5.707 7.5H11.5a.5.5 0 0 1 .5.5z" />
                  </svg>
                  Voltar
                </Link>
              </div>

              <div className="text-center mb-4">
                <img src={logoMealRush} alt="MealRush Logo" style={{ maxWidth: '180px', height: 'auto' }} />
                <h2 className="mt-3 fw-bold" style={{ color: colors.textDark }}>Esqueceu sua senha?</h2>
                <p style={{ color: colors.textSubtleLightBg }}>
                  Digite seu e-mail e escolha uma nova senha.
                </p>
              </div>

              <form onSubmit={handleCheckEmail}>
                <div className="mb-3">
                  <input
                    type="email"
                    className="form-control rounded-pill p-3"
                    placeholder="Seu e-mail"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    style={inputStyle}
                  />
                </div>

                <div className="mb-3">
                  <input
                    type="password"
                    className="form-control rounded-pill p-3"
                    placeholder="Nova senha"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    style={inputStyle}
                  />
                </div>

                <button
                  type="submit"
                  className="btn w-100 rounded-pill p-3 fw-bold mt-3"
                  style={{
                    backgroundColor: colors.accent,
                    color: colors.darkPrimary,
                    fontSize: '1.1rem',
                    transition: 'all 0.2s ease-out'
                  }}
                >
                  Redefinir senha
                </button>

                {error && <div className="alert alert-danger mt-3 text-center">{error}</div>}
                {success && <div className="alert alert-success mt-3 text-center">Senha atualizada com sucesso! Redirecionando...</div>}
              </form>
            </div>
          </div>
        </div>
      </div>

      <style>
        {`
          @keyframes fadeInUp {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .form-control:focus {
            border-color: ${colors.accent};
            box-shadow: 0 0 0 0.25rem rgba(0, 201, 167, 0.25);
          }
        `}
      </style>
    </div>
  );
};

export default ForgottenPasswordScreen;
