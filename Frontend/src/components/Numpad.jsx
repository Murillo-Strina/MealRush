import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const Numpad = ({ onConfirm, onClear, initialValue = "", maxDisplayLength = 2 }) => {
    const [displayValue, setDisplayValue] = useState(initialValue);

    useEffect(() => {
        setDisplayValue(initialValue); 
    }, [initialValue]);

    const defaultColors = {
        darkPrimary: '#1A202C', accent: '#00C9A7', cardBackgroundDark: '#2D3748',
        textLight: '#F7FAFC', mediumNeutral: '#E2E8F0', textDark: '#2D3748',
        danger: '#D32F2F', 
        success: '#00C9A7', 
        buttonTextDark: '#1A202C', 
    };


    const buttonBaseStyle = {
        width: '100%',
        height: '65px', 
        fontSize: '1.6rem',
        fontWeight: 'bold',
        border: 'none',
        borderRadius: '0.75rem',
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
            setDisplayValue("");
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
        "LIMPAR","OK" 
    ];

    return (
        <motion.div 
            className='p-3 shadow-xl rounded-4'
            style={{ backgroundColor: defaultColors.cardBackgroundDark, border: `1px solid ${defaultColors.darkPrimary}`}}
            initial={{opacity:0, y:20}} animate={{opacity:1, y:0}} transition={{duration:0.4, ease: "circOut"}}
        >
            <div 
                className='d-flex align-items-center justify-content-end p-3 mb-3 rounded-3 text-end'
                style={{
                    height: "70px",
                    backgroundColor: defaultColors.darkPrimary,
                    color: defaultColors.textLight,
                    fontSize: '2.2rem',
                    fontWeight: 'bold',
                    letterSpacing: '0.1em',
                    overflow: 'hidden',
                    border: `2px solid ${defaultColors.accent}50`, 
                    fontFamily: "'Roboto Mono', monospace" 
                }}
            >
                {displayValue || ""}
            </div>
            <div className='row row-cols-3 g-2'>
                {keys.map((key) => {
                    let btnStyle = { ...buttonBaseStyle, backgroundColor: defaultColors.mediumNeutral, color: defaultColors.buttonTextDark };
                    let action = () => handleKeyPress(key);
                    let motionProps = { whileTap: { scale: 0.95, backgroundColor: defaultColors.accent }};
                    let colClass = 'col p-1';

                    if (key === 'OK') {
                        btnStyle = { ...buttonBaseStyle, backgroundColor: defaultColors.success, color: defaultColors.darkPrimary, fontSize: '1.3rem' };
                        action = handleConfirm;
                        motionProps = { whileTap: { scale: 0.95 }};
                    } else if (key === 'LIMPAR') {
                        btnStyle = { ...buttonBaseStyle, backgroundColor: defaultColors.danger, color: defaultColors.textLight, fontSize: '0.9rem', lineHeight: '1.2' }; 
                        action = handleFullClear; 
                        motionProps = { whileTap: { scale: 0.95 }};
                    } else if (key === '0') {
                         btnStyle = { ...buttonBaseStyle, backgroundColor: defaultColors.mediumNeutral, color: defaultColors.buttonTextDark };
                         motionProps = { whileTap: { scale: 0.95, backgroundColor: defaultColors.accent }};
                    }
                    

                    return (
                        <div className={colClass} key={key}>
                            <motion.button
                                className="btn w-100 h-100 d-flex align-items-center justify-content-center"
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