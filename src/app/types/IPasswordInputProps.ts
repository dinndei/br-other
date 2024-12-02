import { UseFormRegister, FieldValues } from "react-hook-form";

export default interface PasswordInputProps <T extends FieldValues>{
    register: UseFormRegister<T>;  
    name: keyof T;                    
    placeholder: string;             
    error?: string;                  
  }