import React from 'react';

const Input: React.FC<InputProps> = ({
    type,
    placeholder,
    value,
    onChange,
    className = '',
    disabled = false,
    name,
}) => {
    return (
        <input
            type={type}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            className={`w-full px-4 py-2 border rounded mb-4 ${className}`}
            disabled={disabled}
            name={name}
        />
    );
};

export default Input;
