import React from 'react';
import { Link } from 'react-router-dom';

import logoMealRush from "../assets/images/logo_mealrush_transparent.png";

const LoginScreen = () => {
    const colors = {
        darkPrimary: '#1A202C', accent: '#00C9A7', lightNeutral: '#F7FAFC',
        mediumNeutral: '#E2E8F0', textDark: '#2D3748',
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
    
    const buttonHoverStyle = (target, isHovering) => {
        target.style.backgroundColor = isHovering ? '#00ab8e' : colors.accent;
        target.style.transform = isHovering ? 'translateY(-2px)' : 'translateY(0)';
        target.style.boxShadow = isHovering ? `0 4px 10px rgba(0, 201, 167, 0.3)` : 'none';
    };

    return (
        <div className="d-flex align-items-center justify-content-center" style={{ minHeight: '100vh', backgroundColor: colors.lightNeutral, padding: '1rem' }}>
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-sm-10 col-md-8 col-lg-6 col-xl-4">
                        <div className="card p-4 p-md-5 shadow-lg rounded-4 border-0" style={{animation: 'fadeInUp 0.5s ease-out'}}>
                            <div className="text-center mb-4">
                                <img src={logoMealRush} alt="MealRush Logo" style={{ maxWidth: '180px', height: 'auto' }} /> {/* Ajustado maxWidth */}
                                <h2 className="mt-3 fw-bold" style={{ color: colors.textDark }}>Bem-vindo de volta!</h2>
                                <p style={{color: colors.textSubtleLightBg}}>Acesse sua conta MealRush.</p>
                            </div>

                            <form onSubmit={(e) => e.preventDefault()}>
                                <div className="mb-3">
                                    <label htmlFor="emailInput" className="form-label visually-hidden">E-mail</label>
                                    <input
                                        type="email"
                                        className="form-control rounded-pill p-3"
                                        id="emailInput"
                                        placeholder="Seu e-mail"
                                        required
                                        style={inputStyle}
                                    />
                                </div>
                                <div className="mb-3">
                                     <label htmlFor="passwordInput" className="form-label visually-hidden">Senha</label>
                                    <input
                                        type="password"
                                        className="form-control rounded-pill p-3"
                                        id="passwordInput"
                                        placeholder="Sua senha"
                                        required
                                        style={inputStyle}
                                    />
                                </div>
                                <button
                                    type="submit"
                                    className="btn w-100 rounded-pill p-3 fw-bold mt-3"
                                    style={{ backgroundColor: colors.accent, color: colors.darkPrimary, fontSize: '1.1rem', transition: 'all 0.2s ease-out' }}
                                    onMouseEnter={(e) => buttonHoverStyle(e.currentTarget, true)}
                                    onMouseLeave={(e) => buttonHoverStyle(e.currentTarget, false)}
                                >
                                    Entrar
                                </button>
                                <div className="text-center mt-3">
                                    <Link
                                        to="/recuperar-senha"
                                        className="btn btn-link"
                                        style={{ color: colors.textSubtleLightBg, textDecoration: 'none', fontSize: '0.9rem' }}
                                    >
                                        Esqueci minha senha
                                    </Link>
                                </div>
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

export default LoginScreen;