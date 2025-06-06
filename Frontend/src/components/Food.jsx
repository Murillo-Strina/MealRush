import { motion } from "framer-motion";

const Food = ({ img, name}) => { 
    const defaultColors = {
        darkPrimary: '#1A202C', accent: '#00C9A7', textLight: '#F7FAFC',
        textDark: '#2D3748', textSubtleDarkBg: '#A0AEC0', cardBackgroundDark: '#2D3748',
    };

    return (
        <div
            className="row align-items-center py-4 px-3 mb-4 shadow-sm rounded-3"
            style={{ backgroundColor: defaultColors.cardBackgroundDark, border: `1px solid ${defaultColors.darkPrimary}` }}
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
                    className="img-fluid rounded-3" 
                    style={{
                        maxWidth: "200px", 
                        maxHeight: "150px",
                        objectFit: 'cover',
                        boxShadow: `0 4px 15px rgba(0, 201, 167, 0.1)` 
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
                <h3 className="px-md-3 m-0 fw-bold" style={{ color: nameColor, fontSize: '1.5rem' }}> 
                    {name}
                </h3>
            </motion.div>
        </div>
    );
};

export default Food;