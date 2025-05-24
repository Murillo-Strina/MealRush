import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const Numpad = ({ colors, onConfirm, onClear, initialValue = "", maxDisplayLength = 4 }) => {
    const [displayValue, setDisplayValue] = useState(initialValue);

    useEffect(() => {
        setDisplayValue(initialValue); // Atualiza se o valor inicial mudar externamente
    }, [initialValue]);

    const defaultColors = {
        darkPrimary: '#1A202C', accent: '#00C9A7', cardBackgroundDark: '#2D3748',
        textLight: '#F7FAFC', mediumNeutral: '#E2E8F0', textDark: '#2D3748',
        danger: '#D32F2F', // Vermelho mais suave para X
        success: '#00C9A7', // Usando accent para OK
        buttonTextDark: '#1A202C', // Texto para botões claros
    };
    const c = colors || defaultColors;

    const buttonBaseStyle = {
        width: '100%',
        height: '65px', // Ajustado
        fontSize: '1.6rem',
        fontWeight: 'bold',
        border: 'none',
        borderRadius: '0.75rem', // Mais arredondado
        transition: 'transform 0.1s ease, background-color 0.15s ease',
        boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
    };

    const handleKeyPress = (key) => {
        if (displayValue.length < maxDisplayLength) {
            setDisplayValue(displayValue + key);
        }
    };

    const handleConfirm = () => {
        if (displayValue && onConfirm) {
            onConfirm(displayValue);
            // setDisplayValue(""); // Decide se limpa após confirmar ou deixa para o componente pai
        }
    };

    const handleClearAction = () => {
        if (displayValue.length > 0) {
            setDisplayValue(displayValue.slice(0, -1));
        } else if (onClear) {
             onClear(); // Limpa tudo se já estiver vazio, chamando o onClear do pai
        }
    };
    
    const handleFullClear = () => {
        setDisplayValue("");
        if(onClear) onClear();
    }

    const keys = [
        "1", "2", "3",
        "4", "5", "6",
        "7", "8", "9",
        "LIMPAR", "0", "OK" // Alterado ✓ para OK, X para LIMPAR
    ];

    return (
        <motion.div 
            className='p-3 shadow-xl rounded-4'
            style={{ backgroundColor: c.cardBackgroundDark, border: `1px solid ${c.darkPrimary}`}}
            initial={{opacity:0, y:20}} animate={{opacity:1, y:0}} transition={{duration:0.4, ease: "circOut"}}
        >
            <div 
                className='d-flex align-items-center justify-content-end p-3 mb-3 rounded-3 text-end'
                style={{
                    height: "70px",
                    backgroundColor: c.darkPrimary,
                    color: c.textLight,
                    fontSize: '2.2rem',
                    fontWeight: 'bold',
                    letterSpacing: '0.1em',
                    overflow: 'hidden',
                    border: `2px solid ${c.accent}50`, // Borda sutil com cor de acento
                    fontFamily: "'Roboto Mono', monospace" // Fonte monoespaçada para o display
                }}
            >
                {displayValue || <span style={{color: c.textSubtleDarkBg}}>{'_'.repeat(maxDisplayLength)}</span>}
            </div>
            <div className='row row-cols-3 g-2'>
                {keys.map((key) => {
                    let btnStyle = { ...buttonBaseStyle, backgroundColor: c.mediumNeutral, color: c.buttonTextDark };
                    let action = () => handleKeyPress(key);
                    let motionProps = { whileTap: { scale: 0.95, backgroundColor: c.accent }};
                    let colClass = 'col p-1';

                    if (key === 'OK') {
                        btnStyle = { ...buttonBaseStyle, backgroundColor: c.success, color: c.darkPrimary, fontSize: '1.3rem' };
                        action = handleConfirm;
                        motionProps = { whileTap: { scale: 0.95 }};
                    } else if (key === 'LIMPAR') {
                        btnStyle = { ...buttonBaseStyle, backgroundColor: c.danger, color: c.textLight, fontSize: '0.9rem', lineHeight: '1.2' }; // Tamanho de fonte menor para LIMPAR
                        action = handleFullClear; // Limpa tudo
                        motionProps = { whileTap: { scale: 0.95 }};
                    } else if (key === '0') {
                         btnStyle = { ...buttonBaseStyle, backgroundColor: c.mediumNeutral, color: c.buttonTextDark };
                         motionProps = { whileTap: { scale: 0.95, backgroundColor: c.accent }};
                    }
                    
                    // Se o botão for LIMPAR, ele pode ocupar mais espaço ou ter um tratamento diferente.
                    // Para este layout de grid, mantemos o tamanho.

                    return (
                        <div className={colClass} key={key}>
                            <motion.button
                                className="btn w-100 h-100 d-flex align-items-center justify-content-center" // w-100 h-100 para preencher
                                style={btnStyle}
                                onClick={action}
                                {...motionProps}
                            >
                                {key}
                            </motion.button>
                        </div>
                    );
                })}
            </div>
        </motion.div>
    );
};

export default Numpad;