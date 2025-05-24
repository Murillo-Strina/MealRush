import React from 'react'; // Importar React
import { motion } from "framer-motion";

const Food = ({ img, name, colors }) => { // Adicionado 'colors' como prop
    const defaultColors = {
        darkPrimary: '#1A202C', accent: '#00C9A7', textLight: '#F7FAFC',
        textDark: '#2D3748', textSubtleDarkBg: '#A0AEC0', cardBackgroundDark: '#2D3748',
    };
    const c = colors || defaultColors;

    // Determina a cor do texto com base no fundo da seção onde este componente será usado.
    // Supondo que será usado em uma seção com fundo 'cardBackgroundDark' ou 'darkPrimary'.
    const textColor = c.textLight;
    const nameColor = c.accent; // Nome com cor de destaque

    return (
        // Este componente é uma linha, então o fundo deve ser definido pelo seu contêiner pai.
        // Adicionando um padding e talvez um card sutil se for um item individual destacado.
        <div
            className="row align-items-center py-4 px-3 mb-4 shadow-sm rounded-3"
            style={{ backgroundColor: c.cardBackgroundDark, border: `1px solid ${c.darkPrimary}` }}
        >
            <motion.div
                className="col-12 col-md-4 d-flex justify-content-center justify-content-md-start mb-3 mb-md-0"
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.7, ease: "easeOut" }}
                viewport={{ once: true, amount: 0.3 }}
            >
                <img
                    src={img}
                    alt={name}
                    className="img-fluid rounded-3" // Adicionado rounded-3
                    style={{
                        maxWidth: "200px", // Ajustado para um tamanho razoável
                        maxHeight: "150px",
                        objectFit: 'cover',
                        boxShadow: `0 4px 15px rgba(0, 201, 167, 0.1)` // Sombra sutil com cor de accent
                    }}
                />
            </motion.div>

            <motion.div
                className="col-12 col-md-8 d-flex justify-content-center justify-content-md-start align-items-center text-center text-md-start"
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.7, ease: "easeOut" }}
                viewport={{ once: true, amount: 0.3 }}
            >
                <h3 className="px-md-3 m-0 fw-bold" style={{ color: nameColor, fontSize: '1.5rem' }}> {/* Ajustado para h3 */}
                    {name}
                </h3>
                {/* Você pode adicionar mais informações aqui, como descrição, preço, etc. */}
                {/* <p style={{color: textColor, fontSize: '1rem'}}>Descrição do alimento...</p> */}
            </motion.div>
        </div>
    );
};

export default Food;