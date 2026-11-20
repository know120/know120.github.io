import proptypes from 'prop-types'

export default function Button({ text, onClick, variant = 'primary', icon }) {
  return (
    <button
      type="button"
      className={variant === 'secondary' ? 'btn-secondary group' : 'btn-primary group'}
      onClick={onClick}
    >
      {icon && <i className={`pi ${icon} text-sm`} aria-hidden="true" />}
      <span>{text}</span>
    </button>
  )
}

Button.propTypes = {
  text: proptypes.string.isRequired,
  onClick: proptypes.func.isRequired,
  variant: proptypes.oneOf(['primary', 'secondary']),
  icon: proptypes.string,
}
