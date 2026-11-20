import React from 'react';
import PropTypes from 'prop-types';

const Card = ({ header, title, body, footer }) => {
  return (
    <div className="flex h-full flex-col">
      <div className="mb-5">
        <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--accent-primary)]">
          {header}
        </span>
        {title && <h4 className="mt-2 text-xl font-bold tracking-tight text-[var(--text-primary)]">{title}</h4>}
      </div>

      <div className="mb-6 flex-1">
        <p className="text-sm leading-relaxed text-[var(--text-secondary)]">{body}</p>
      </div>

      {footer && (
        <div className="mt-auto flex items-center gap-2 border-t border-[var(--glass-border)] pt-4">
          <span className="h-1.5 w-1.5 bg-[var(--accent-primary)]" />
          <span className="font-mono text-[11px] uppercase tracking-wider text-[var(--text-tertiary)]">
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
  footer: PropTypes.string,
};

export default Card;
