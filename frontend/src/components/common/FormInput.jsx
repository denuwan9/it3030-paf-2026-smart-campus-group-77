import React, { useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { AlertCircle, CheckCircle2, Eye, EyeOff } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const FormInput = ({ 
  name, 
  label, 
  type = 'text', 
  placeholder, 
  validation = {},
  autoFocus = false,
  className = ""
}) => {
  const { 
    register, 
    formState: { errors, touchedFields },
    setFocus
  } = useFormContext();

  const [showPassword, setShowPassword] = useState(false);

  const isError = !!errors[name];
  const isTouched = !!touchedFields[name];
  const isValid = isTouched && !isError;

  const inputType = type === 'password' ? (showPassword ? 'text' : 'password') : type;

  return (
    <div className={`flex flex-col gap-1.5 w-full ${className}`}>
      {label && (
        <label 
          htmlFor={name} 
          className="text-xs sm:text-sm font-bold text-nexer-text-header ml-1"
        >
          {label}
        </label>
      )}
      
      <div className="relative group">
        <input
          {...register(name, validation)}
          id={name}
          type={inputType}
          autoFocus={autoFocus}
          placeholder={placeholder}
          className={`
            w-full px-4 py-2.5 sm:py-3 bg-nexer-bg-surface border rounded-2xl outline-none transition-all duration-200
            placeholder:text-slate-400 text-nexer-text-body text-sm sm:text-base pr-12
            group-hover:bg-white group-focus:bg-white
            ${isError 
              ? 'border-nexer-status-error ring-2 ring-nexer-status-error/10' 
              : isValid
                ? 'border-nexer-status-success ring-2 ring-nexer-status-success/5'
                : 'border-slate-200 focus:border-nexer-brand-primary focus:ring-4 focus:ring-nexer-brand-primary/10'
            }
          `}
        />
        
        <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
          {type === 'password' && (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="p-1 hover:bg-slate-100 rounded-full transition-colors text-slate-400 hover:text-nexer-brand-primary pointer-events-auto cursor-pointer"
              title={showPassword ? "Hide Password" : "Show Password"}
            >
              {showPassword ? (
                <EyeOff className="w-5 h-5" />
              ) : (
                <Eye className="w-5 h-5" />
              )}
            </button>
          )}

          <AnimatePresence mode="wait">
            {isError && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
              >
                <AlertCircle className="w-5 h-5 text-nexer-status-error" />
              </motion.div>
            )}
            {isValid && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
              >
                <CheckCircle2 className="w-5 h-5 text-nexer-status-success" />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <AnimatePresence>
        {isError && (
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="text-xs font-semibold text-nexer-status-error ml-1 flex items-center gap-1"
          >
            {errors[name]?.message}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FormInput;
