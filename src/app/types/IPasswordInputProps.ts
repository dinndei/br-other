import { UseFormRegister, FieldValues, Path } from "react-hook-form";

export default interface PasswordInputProps <T extends FieldValues>{
    register: UseFormRegister<T>;  
    name: Path<T>;                    
    placeholder: string;             
    error?: string;                  
  }