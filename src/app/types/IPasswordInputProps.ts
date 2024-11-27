import { UseFormRegister } from "react-hook-form";

export default interface PasswordInputProps {
    register: UseFormRegister<any>;  
    name: string;                    
    placeholder: string;             
    error?: string;                  
  }