import React from 'react';
import { ButtonProps } from '../types/props/ButtonProps';


const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  type = 'button', // ערך ברירת מחדל
  disabled = false,
  className = '',
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`px-4 py-2 rounded-md bg-blue-500 text-white hover:bg-blue-600 disabled:bg-gray-400 ${className}`}
    >
      {children}
    </button>
  );
};

export default Button;
