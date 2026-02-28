import React, { useState } from "react";
import type { ChangeEvent } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";

type ValidatorFn = (value: string) => string | null;

type CustomInputProps = {
  label: string;
  type?: "text" | "password" | "textarea" | "number" | "date";
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  className?: string;
  required?: boolean;
  validators?: ValidatorFn[];
};

const CustomInput: React.FC<CustomInputProps> = ({
  label,
  type = "text",
  placeholder,
  value,
  onChange,
  className = "",
  required = false,
  validators = [],
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [touched, setTouched] = useState(false); // track if user interacted

  const runValidators = (val: string) => {
    for (const validator of validators) {
      const msg = validator(val);
      if (msg) return msg;
    }
    return null;
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const val = e.target.value;
    onChange(val);
    if (!touched) setTouched(true); // mark  touched
    const msg = runValidators(val);
    setError(msg);
  };

  const handleBlur = () => {
    if (!touched) setTouched(true);
    const msg = runValidators(value);
    setError(msg);
  };

  if (type === "textarea") {
    return (
      <div className={`mb-4 ${className}`}>
        <label className="text-[13px] text-[#8A8F98] font-medium">{label}</label>
        <textarea
          placeholder={placeholder}
          value={value}
          onChange={handleChange}
          onBlur={handleBlur}
          className={`mt-1 w-full rounded-[10px] border px-4 py-2 text-[14px] outline-none focus:border-[#3F51B5] focus:ring-2 focus:ring-[#3F51B5]/20 ${
            touched && error ? "border-red-500 focus:ring-red-300" : "border-[#D9DDE3]"
          }`}
          required={required}
        />
        {touched && error && <p className="text-red-500 text-sm mt-1">{error}</p>}
      </div>
    );
  }

  return (
    <div className={`relative mb-4 ${className}`}>
      <label className="text-[13px] text-[#8A8F98] font-medium">{label}</label>
      <div className="mt-1 relative">
        <input
          type={type === "password" ? (showPassword ? "text" : "password") : type}
          placeholder={placeholder}
          value={value}
          onChange={handleChange}
          onBlur={handleBlur}
          className={`w-full h-[48px] rounded-[10px] border px-4 pr-12 text-[14px] outline-none  ${
            touched && error ? "border-red-500 focus:ring-red-300" : "border-[#D9DDE3]"
          }`}
          required={required}
        />
        {type === "password" && (
          <div className="absolute top-0 right-0 h-full flex items-center pr-4">
            <button
              type="button"
              className="text-[#6C7278]"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
            </button>
          </div>
        )}
      </div>
      {touched && error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
};

export default CustomInput;