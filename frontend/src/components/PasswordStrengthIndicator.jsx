import React from 'react';
import { motion } from 'framer-motion';

const PasswordStrengthIndicator = ({ password }) => {
  const getStrength = (pass) => {
    let score = 0;
    if (!pass) return 0;
    if (pass.length > 8) score++;
    if (/[A-Z]/.test(pass)) score++;
    if (/[a-z]/.test(pass)) score++;
    if (/[0-9]/.test(pass)) score++;
    if (/[^A-Za-z0-9]/.test(pass)) score++;
    return score;
  };

  const strength = getStrength(password);
  const labels = ['Too weak', 'Weak', 'Fair', 'Good', 'Strong'];
  const colors = ['bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-blue-500', 'bg-emerald-500'];

  return (
    <div className="mt-2">
      <div className="flex justify-between items-center mb-1">
        <span className="text-[10px] uppercase font-bold text-slate-500">Security Strength</span>
        <span className={`text-[10px] font-bold ${strength > 0 ? colors[strength-1].replace('bg-', 'text-') : 'text-slate-500'}`}>
          {strength > 0 ? labels[strength-1] : 'Empty'}
        </span>
      </div>
      <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden flex gap-1">
        {[1, 2, 3, 4, 5].map((level) => (
          <motion.div
            key={level}
            initial={{ width: 0 }}
            animate={{ width: strength >= level ? '20%' : '0%' }}
            className={`h-full ${strength >= level ? colors[strength-1] : 'bg-transparent'} transition-colors duration-300`}
          />
        ))}
      </div>
    </div>
  );
};

export default PasswordStrengthIndicator;
