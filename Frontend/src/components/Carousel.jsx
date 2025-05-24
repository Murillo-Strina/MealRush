import React from 'react';

const Carousel = ({ images, accentColor = '#00C9A7', itemsPerGroup = 1 }) => {
    if (!images || images.length === 0) {
        return <p className="text-center" style={{ color: '#718096' }}>Nenhuma imagem de parceiro disponível.</p>;
    }

    const carouselId = `partnerCarousel_${Math.random().toString(36).substring(2, 9)}`;

    const controlBaseStyle = {
        width: '3rem',
        height: '3rem',
        borderRadius: '50%',
        backgroundColor: `rgba(26, 32, 44, 0.3)`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'background-color 0.2s ease', 
    };

    const controlIconStyle = {
        filter: `drop-shadow(0 0 3px ${accentColor})`,
        width: '1.5rem',
        height: '1.5rem',
    };
    
    const validAccentColor = accentColor || '#00C9A7';

    return (
        <div id={carouselId} className="carousel slide" data-bs-ride="carousel">
            <div className="carousel-inner rounded-3">
                {images.map((imgSrc, index) => (
                    <div key={index} className={`carousel-item ${index === 0 ? 'active' : ''}`}>
                        <div className="d-flex justify-content-center align-items-center p-3" style={{minHeight: '150px'}}> 
                            <img
                                src={imgSrc}
                                className="d-block img-fluid"
                                alt={`Parceria ${index + 1}`}
                                style={{
                                    maxHeight: '150px', 
                                    width: 'auto', 
                                    objectFit: 'contain',
                                    transition: 'all 0.3s ease-out'
                                }}
                                onMouseOver={e => { e.currentTarget.style.filter = 'grayscale(0%) opacity(1)'; e.currentTarget.style.transform = 'scale(1.1)'; }}
                                onMouseOut={e => {e.currentTarget.style.transform = 'scale(1)'; }}
                            />
                        </div>
                    </div>
                ))}
            </div>

            {images.length > 1 && (
                <>
                    <button
                        className="carousel-control-prev"
                        type="button"
                        data-bs-target={`#${carouselId}`}
                        data-bs-slide="prev"
                        style={{ width: 'auto', left: '0px' }} // Ajustado para posicionamento
                        onMouseOver={e => e.currentTarget.querySelector('span > span').style.opacity = 1}
                        onMouseOut={e => e.currentTarget.querySelector('span > span').style.opacity = 0.7}
                    >
                        <span style={controlBaseStyle} aria-hidden="true">
                           <span style={{ ...controlIconStyle, backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' fill='${validAccentColor.replace('#', '%23')}'%3e%3cpath d='M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0z'/%3e%3c/svg%3e")` }}></span>
                        </span>
                        <span className="visually-hidden">Anterior</span>
                    </button>
                    <button
                        className="carousel-control-next"
                        type="button"
                        data-bs-target={`#${carouselId}`}
                        data-bs-slide="next"
                        style={{ width: 'auto', right: '0px' }} // Ajustado para posicionamento
                        onMouseOver={e => e.currentTarget.querySelector('span > span').style.opacity = 1}
                        onMouseOut={e => e.currentTarget.querySelector('span > span').style.opacity = 0.7}
                    >
                         <span style={controlBaseStyle} aria-hidden="true">
                            <span style={{ ...controlIconStyle, backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' fill='${validAccentColor.replace('#', '%23')}'%3e%3cpath d='M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z'/%3e%3c/svg%3e")` }}></span>
                        </span>
                        <span className="visually-hidden">Próximo</span>
                    </button>
                </>
            )}
        </div>
    );
};

export default Carousel;