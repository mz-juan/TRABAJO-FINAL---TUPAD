import React from 'react';

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  type = 'button',
  onClick,
  disabled = false,
  fullWidth = false,
  icon = null,
  iconPosition = 'left',
  className = '',
  style = {},
  ...props
}) {
  const baseStyle = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem',
    fontWeight: '600',
    borderRadius: 'var(--radius-md, 8px)',
    transition: 'all var(--transition-normal, 0.2s ease)',
    cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.6 : 1,
    width: fullWidth ? '100%' : 'auto',
    textAlign: 'center',
    fontFamily: 'inherit',
    outline: 'none',
    border: '1px solid transparent',
  };

  const sizes = {
    sm: { padding: '0.4rem 0.85rem', fontSize: '0.875rem' },
    md: { padding: '0.65rem 1.25rem', fontSize: '0.95rem' },
    lg: { padding: '0.85rem 1.75rem', fontSize: '1.05rem' },
  };

  const variants = {
    primary: {
      backgroundColor: 'var(--primary-600)',
      color: '#ffffff',
      boxShadow: 'var(--shadow-sm)',
    },
    secondary: {
      backgroundColor: 'var(--primary-50)',
      color: 'var(--primary-700)',
      borderColor: 'var(--primary-200)',
    },
    outline: {
      backgroundColor: 'transparent',
      color: 'var(--primary-600)',
      borderColor: 'var(--primary-600)',
    },
    white: {
      backgroundColor: '#ffffff',
      color: 'var(--primary-700)',
      boxShadow: 'var(--shadow-md)',
      borderColor: '#ffffff',
    },
    ghost: {
      backgroundColor: 'transparent',
      color: 'var(--neutral-700)',
    },
    danger: {
      backgroundColor: 'var(--danger)',
      color: '#ffffff',
    },
    teal: {
      backgroundColor: 'var(--accent-teal)',
      color: '#ffffff',
      boxShadow: 'var(--shadow-sm)',
    },
  };

  const currentSize = sizes[size] || sizes.md;
  const currentVariant = variants[variant] || variants.primary;

  const combinedStyle = {
    ...baseStyle,
    ...currentSize,
    ...currentVariant,
    ...style,
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      style={combinedStyle}
      className={`btn btn-${variant} btn-${size} ${className}`}
      {...props}
    >
      {icon && iconPosition === 'left' && <span className="btn-icon">{icon}</span>}
      {children}
      {icon && iconPosition === 'right' && <span className="btn-icon">{icon}</span>}
    </button>
  );
}
