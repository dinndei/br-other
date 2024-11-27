import { useState } from 'react';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import PasswordInputProps from '../types/IPasswordInputProps';

const PasswordInput : React.FC<PasswordInputProps> = ({ register, name, placeholder, error }) => {
  const [showPassword, setShowPassword] = useState(false); 

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword); // הופך בין true ל-false
  };

  return (
    <div className="relative w-full">
      <input
        type={showPassword ? 'text' : 'password'}
        placeholder={placeholder}
        {...register(name)}
        className={`w-full px-4 py-2 border rounded mb-4 pr-10 ${error ? 'border-red-500' : ''}`}
      />
      <button
        type="button"
        onClick={togglePasswordVisibility}
        className="absolute inset-y-0 right-0 flex items-center pr-3"
      >
        {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
      </button>
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
};

export default PasswordInput;
