import React from 'react';
import { motion } from 'framer-motion';

const MenuItemCard = ({
    id,
    name,
    description,
    image,
    price,
    styles, // Objeto contendo todos os sub-estilos (cardStyle, imageStyle, etc.)
    selectAction, // Função para ação principal (ex: "Selecionar", "Adicionar")
    infoAction,   // Função para ação secundária (ex: "Detalhes")
    selectActionText = "Selecionar",
    infoActionText = "Detalhes"
}) => {

    const defaultColors = {
        darkPrimary: '#1A202C', accent: '#00C9A7', textLight: '#F7FAFC',
        textSubtleDarkBg: '#A0AEC0', cardBackgroundDark: '#2D3748',
        mediumNeutral: '#E2E8F0'
    };

    // Usa os estilos passados ou os padrões para evitar erros
    const s = {
        cardStyle: styles?.cardStyle || { backgroundColor: defaultColors.cardBackgroundDark, color: defaultColors.textLight, borderRadius: '1rem', overflow: 'hidden', border: `1px solid ${defaultColors.darkPrimary}` },
        imageStyle: styles?.imageStyle || { objectFit: 'cover', height: '200px', width: '100%' },
        titleStyle: styles?.titleStyle || { color: defaultColors.accent, fontSize: '1.15rem', fontWeight: 'bold' },
        descriptionStyle: styles?.descriptionStyle || { color: defaultColors.textSubtleDarkBg, fontSize: '0.875rem', minHeight: '60px' },
        priceStyle: styles?.priceStyle || { color: defaultColors.textLight, fontSize: '1.05rem', fontWeight: 'bold' },
        buttonStyle: styles?.buttonStyle || { backgroundColor: defaultColors.accent, color: defaultColors.darkPrimary, fontWeight: 'bold', borderColor: defaultColors.accent },
        infoButtonStyle: styles?.infoButtonStyle || { backgroundColor: 'transparent', color: defaultColors.accent, borderColor: defaultColors.accent, borderWidth: '2px' }
    };

    return (
        <motion.div
            className="card w-100 shadow-lg border-0 d-flex flex-column" // Assegura que o card ocupe a coluna e use flex
            style={s.cardStyle}
            whileHover={{ y: -7, boxShadow: `0 1rem 1.75rem rgba(0, 201, 167, 0.1), 0 0.5rem 0.75rem rgba(0,0,0,0.15)` }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
            <img src={image} className="card-img-top" alt={name} style={s.imageStyle} />
            <div className="card-body d-flex flex-column p-3 p-md-4">
                <h5 className="card-title" style={s.titleStyle}>{name}</h5>
                {description && (
                    <p className="card-text flex-grow-1 mb-3" style={s.descriptionStyle}>
                        {description}
                    </p>
                )}
                <p className="mb-3 fs-5" style={s.priceStyle}>R$ {price}</p>
                <div className="mt-auto"> {/* Empurra os botões para baixo */}
                    <div className="d-grid gap-2">
                        {selectAction && (
                            <button
                                type="button"
                                className="btn rounded-pill py-2"
                                onClick={() => selectAction(id, name)}
                                style={s.buttonStyle}
                            >
                                {selectActionText}
                            </button>
                        )}
                        {infoAction && (
                            <button
                                type="button"
                                className="btn rounded-pill py-2"
                                onClick={() => infoAction(id, name)}
                                style={s.infoButtonStyle}
                            >
                                {infoActionText}
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default MenuItemCard;