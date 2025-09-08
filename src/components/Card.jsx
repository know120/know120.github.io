import React, { useState } from 'react';

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
      className="w-2xl h-xl"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleMouseLeave}
    >
      <div
        className="rounded-2xl bg-neutral-900 p-2"
        style={{ transform }}
      >
        <div className="text-3xl p-2 font-bold text-purple-800">
          <h2>{header}</h2>
        </div>
        <div className="">
          {title && <h3 className="text-2xl p-2">{title}</h3>}
          <p className="p-2">{body}</p>
        </div>
        {footer && (
          <div className="p-2">
            <h4>{footer}</h4>
          </div>
        )}
        <div className="card-3d-shine"></div>
      </div>
    </div>
  );
};

export default Card;