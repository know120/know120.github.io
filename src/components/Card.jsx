import React, { useState } from 'react';
import './Card.css';

const Card = ({ header, title, body, footer }) => {
  const [transform, setTransform] = useState('');

  const handleMouseMove = (e) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const rotateX = (y - centerY) / 10;
    const rotateY = (centerX - x) / 10;
    
    setTransform(`perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(20px)`);
  };

  const handleMouseLeave = () => {
    setTransform('perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0px)');
  };

  const handleTouchMove = (e) => {
    if (e.touches.length === 1) {
      const touch = e.touches[0];
      const card = e.currentTarget;
      const rect = card.getBoundingClientRect();
      const x = touch.clientX - rect.left;
      const y = touch.clientY - rect.top;
      
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      const rotateX = (y - centerY) / 15; // Gentler effect for touch
      const rotateY = (centerX - x) / 15;
      
      setTransform(`perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(15px)`);
    }
  };

  return (
    <div
      className="card-3d-container h-100"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleMouseLeave}
    >
      <div
        className="card card-3d h-100"
        style={{ transform }}
      >
        <div className="card-header card-3d-header">
          <h2>{header}</h2>
        </div>
        <div className="card-body card-3d-body">
          {title && <h3 className="card-title">{title}</h3>}
          <p className="card-text">{body}</p>
        </div>
        {footer && (
          <div className="card-footer card-3d-footer">
            <h4>{footer}</h4>
          </div>
        )}
        <div className="card-3d-shine"></div>
      </div>
    </div>
  );
};

export default Card;