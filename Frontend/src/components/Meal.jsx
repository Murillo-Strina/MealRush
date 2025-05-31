import React from "react";
import { motion } from "framer-motion";

const Meal = ({ foodId, name, img, price, stock, getInfo, selectFood, styles }) => {
    const isOutOfStock = stock === 0;

    const defaultStyles = { 
        cardStyle: { backgroundColor: '#2D3748', color: '#F7FAFC', borderRadius: '0.75rem', border: '1px solid #1A202C', overflow: 'hidden', position: 'relative', height: '230px', cursor: 'pointer', display: 'flex', flexDirection: 'column', justifyContent: 'space-between'},
        imageContainerStyle: { flexGrow: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0.5rem' },
        imageStyle: { objectFit: 'contain', maxHeight: '110px', maxWidth: '90%'},
        idStyle: { position: 'absolute', top: '10px', left: '10px', backgroundColor: '#00C9A7E6', color: '#1A202C', padding: '0.25rem 0.6rem', borderRadius: '0.3rem', fontSize: '0.85rem', fontWeight: 'bold', boxShadow: '0 2px 4px rgba(0,0,0,0.3)'},
        nameContainerStyle: { padding: '0.25rem 0.5rem', minHeight: '48px', display: 'flex', alignItems: 'center', justifyContent: 'center' },
        nameStyle: { color: '#F7FAFC', fontSize: '0.9rem', fontWeight: '600', lineHeight: '1.2', textAlign: 'center', maxHeight: '40px', overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical'},
        priceStyle: { backgroundColor: '#1A202C', color: '#00C9A7', padding: '0.5rem', fontSize: '1rem', fontWeight: 'bold', textAlign: 'center', borderBottomLeftRadius: '0.75rem', borderBottomRightRadius: '0.75rem'},
        infoButtonStyle: { position: 'absolute', top: '10px', right: '10px', width: '32px', height: '32px', padding: '0', backgroundColor: 'rgba(45, 55, 72, 0.8)', color: '#00C9A7', border: '1.5px solid #00C9A7', borderRadius: '50%'},
        outOfStockOverlayStyle: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(26, 32, 44, 0.9)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#E53E3E', fontWeight: 'bold', fontSize: '1rem', borderRadius: '0.75rem', textAlign: 'center', border: '2px dashed #E53E3E'}
    };

    const s = styles || defaultStyles; 

    return (
        <motion.div
            className="shadow-sm"
            style={{ ...s.cardStyle, opacity: isOutOfStock ? 0.5 : 1 }}
            onClick={!isOutOfStock && selectFood ? () => selectFood(foodId, name) : undefined}
            whileHover={!isOutOfStock ? { scale: 1.03, boxShadow: `0 0.5rem 1rem rgba(0, 201, 167, 0.2)` } : {}}
            transition={{ type: "spring", stiffness: 400, damping: 15 }}
        >
            <div style={s.idStyle}>{foodId}</div>
            
            {getInfo && (
                 <button
                    className="btn rounded-circle d-flex align-items-center justify-content-center"
                    style={s.infoButtonStyle}
                    onClick={(e) => { e.stopPropagation(); getInfo(foodId, name); }}
                    aria-label={`Informações sobre ${name}`}
                    title={`Informações sobre ${name}`}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-info-lg" viewBox="0 0 16 16">
                        <path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16zm.93-9.412-1 4.705c-.07.34.029.533.304.533.194 0 .487-.07.686-.246l-.088.416c-.287.346-.92.598-1.465.598-.703 0-1.002-.422-.808-1.319l.738-3.468c.064-.293.006-.399-.287-.47l-.451-.081.088-.416c.287-.346.92-.598 1.465-.598.703 0 1.002.422.808 1.319zM8 5.5a1 1 0 1 0 0-2 1 1 0 0 0 0 2z"/>
                    </svg>
                </button>
            )}

            <div style={s.imageContainerStyle}>
                <img
                    src={img}
                    alt={name}
                    className="img-fluid"
                    style={s.imageStyle}
                />
            </div>
            <div style={s.nameContainerStyle}>
                <h6 className="card-title m-0" style={s.nameStyle}>{name}</h6>
            </div>
            
            <div style={s.priceStyle}>
                R$ {price}
            </div>
        </motion.div>
    );
};

export default Meal;