import React from 'react';
import { ButtonProps, InputProps } from '../types';

export const Input = ({
  type = 'text',
  name,
  placeholder,
  value,
  onBlur,
  onChange,
  error,
  label,
  required,
}: InputProps) => {
  return (
    <>
      <label>
        {label} {required && <span className='mandatory'> *</span>}
        {type === 'text' && (
          <input
            type={type}
            className="form-control"
            name={name}
            value={value as string}
            onChange={onChange}
            placeholder={placeholder}
            onBlur={onBlur}
          />
        )}
        {type === 'checkbox' && (
          <input
            type={type}
            className="form-control"
            name={name}
            checked={value as boolean}
            value={value as string}
            onChange={onChange}
            placeholder={placeholder}
            onBlur={onBlur}
          />
        )}
      </label>
      {error && <div className="error-message">{error}</div>}
    </>
  );
};

export const Button = ({
  text,
  className = 'btn',
  onClick,
  ...rest
}: ButtonProps & React.ButtonHTMLAttributes<HTMLButtonElement>) => {
  return (
    <button {...rest} onClick={onClick} className={`btnC ${className}`}>
      {text}
    </button>
  );
};

export default Input;
