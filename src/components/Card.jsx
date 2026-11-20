import React from 'react';
import PropTypes from 'prop-types';

const Card = ({ header, title, body, footer }) => {
  return (
    <div className="h-full flex flex-col">
      <div className="mb-4">
        <h3 className="mb-1 text-lg font-semibold text-[var(--accent-secondary)]">{header}</h3>
        {title && <h4 className="text-xl font-bold text-white">{title}</h4>}
      </div>

      <div className="flex-1 mb-6">
        <p className="leading-relaxed text-[var(--text-secondary)]/85">{body}</p>
      </div>

      {footer && (
        <div className="mt-auto border-t border-white/10 pt-4">
          <span className="flex items-center gap-2 text-sm font-medium text-[var(--text-tertiary)]">
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