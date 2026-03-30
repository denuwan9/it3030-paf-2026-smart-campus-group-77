import React from 'react';
import { useFormContext } from 'react-hook-form';
import { AlertCircle, CheckCircle2 } from 'lucide-react';
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

  const isError = !!errors[name];
  const isTouched = !!touchedFields[name];
  const isValid = isTouched && !isError;

  return (
    <div className={`flex flex-col gap-1.5 w-full ${className}`}>
      {label && (
        <label 
          htmlFor={name} 
          className="text-xs sm:text-sm font-bold text-nexar-text-header ml-1"
        >
          {label}
        </label>
      )}
      
      <div className="relative group">
        <input
          {...register(name, validation)}
          id={name}
          type={type}
          autoFocus={autoFocus}
          placeholder={placeholder}
          className={`
            w-full px-4 py-2.5 sm:py-3 bg-nexar-bg-surface border rounded-2xl outline-none transition-all duration-200
            placeholder:text-slate-400 text-nexar-text-body text-sm sm:text-base
            group-hover:bg-white group-focus:bg-white
            ${isError 
              ? 'border-nexar-status-error ring-2 ring-nexar-status-error/10' 
              : isValid
                ? 'border-nexar-status-success ring-2 ring-nexar-status-success/5'
                : 'border-slate-200 focus:border-nexar-brand-primary focus:ring-4 focus:ring-nexar-brand-primary/10'
            }
          `}
        />
        
        <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center pointer-events-none">
          <AnimatePresence mode="wait">
            {isError && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
              >
                <AlertCircle className="w-5 h-5 text-nexar-status-error" />
              </motion.div>
            )}
            {isValid && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
              >
                <CheckCircle2 className="w-5 h-5 text-nexar-status-success" />
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
            className="text-xs font-semibold text-nexar-status-error ml-1 flex items-center gap-1"
          >
            {errors[name]?.message}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FormInput;
