import React from 'react';
import PropTypes from 'prop-types';

const Card = ({ header, title, body, footer }) => {
  return (
    <div className="h-full flex flex-col">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-indigo-400 mb-1">{header}</h3>
        {title && <h4 className="text-xl font-bold text-white">{title}</h4>}
      </div>

      <div className="flex-1 mb-6">
        <p className="text-slate-300 leading-relaxed">{body}</p>
      </div>

      {footer && (
        <div className="pt-4 border-t border-white/10 mt-auto">
          <span className="text-sm font-medium text-slate-500 flex items-center gap-2">
            <i className="pi pi-calendar"></i>
            {footer}
          </span>
        </div>
      )}
    </div>
  );
};

Card.propTypes = {
  header: PropTypes.string.isRequired,
  title: PropTypes.string,
  body: PropTypes.string.isRequired,
  footer: PropTypes.string
};

export default Card;