import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, AlertCircle, AlertTriangle, Info, X } from 'lucide-react';

const icons = {
  success: <CheckCircle2 className="w-5 h-5 text-nexer-status-success" />,
  warning: <AlertTriangle className="w-5 h-5 text-nexer-status-warning" />,
  error: <AlertCircle className="w-5 h-5 text-nexer-status-error" />,
  info: <Info className="w-5 h-5 text-nexer-status-info" />,
};

const styles = {
  success: "bg-nexer-status-success/10 border-nexer-status-success/20 text-nexer-text-body",
  warning: "bg-nexer-status-warning/10 border-nexer-status-warning/20 text-nexer-text-body",
  error: "bg-nexer-status-error/10 border-nexer-status-error/20 text-nexer-text-body",
  info: "bg-nexer-status-info/10 border-nexer-status-info/20 text-nexer-text-body",
};

const Alert = ({ 
  type = 'info', 
  message, 
  onClose,
  showIcon = true,
  className = ""
}) => {
  return (
    <AnimatePresence>
      {message && (
        <motion.div
          initial={{ opacity: 0, y: -20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className={`
            flex items-center gap-4 p-4 rounded-2xl border shadow-nexer-sm
            ${styles[type]}
            ${className}
          `}
        >
          {showIcon && <div className="flex-shrink-0">{icons[type]}</div>}
          
          <div className="flex-grow font-semibold text-sm leading-relaxed">
            {message}
          </div>

          {onClose && (
            <button 
              onClick={onClose}
              className="flex-shrink-0 p-1 hover:bg-black/5 rounded-full transition-colors"
            >
              <X className="w-4 h-4 opacity-50" />
            </button>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Alert;
