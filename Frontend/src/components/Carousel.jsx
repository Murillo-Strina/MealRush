import React from 'react';

const Carousel = ({ images }) => {
  return (
    <div id="carouselParcerias" className="carousel slide" data-bs-ride="carousel">
      <div className="carousel-inner">
        {images.map((img, index) => (
          <div key={index} className={`carousel-item ${index === 0 ? 'active' : ''}`}>
            <img src={img} className="d-block w-100" alt={`parceria-${index}`} style={{ maxHeight: 150, objectFit: 'contain', width: 'auto' }} />
          </div>
        ))}
      </div>

      <button className="carousel-control-prev" type="button" data-bs-target="#carouselParcerias" data-bs-slide="prev">
        <span className="carousel-control-prev-icon" aria-hidden="true"></span>
        <span className="visually-hidden">Anterior</span>
      </button>
      <button className="carousel-control-next" type="button" data-bs-target="#carouselParcerias" data-bs-slide="next">
        <span className="carousel-control-next-icon" aria-hidden="true"></span>
        <span className="visually-hidden">Próximo</span>
      </button>
    </div>
  );
};

export default Carousel;
