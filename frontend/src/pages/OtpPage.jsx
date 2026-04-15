import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { KeyRound, Timer } from 'lucide-react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

const OtpPage = () => {
  const { verifyOtp, loading } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const email = location.state?.email;

  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [timer, setTimer] = useState(60);

  useEffect(() => {
    if (!email) {
      navigate('/register');
      return;
    }
    const countdown = setInterval(() => {
      setTimer((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(countdown);
  }, [email, navigate]);

  const handleChange = (element, index) => {
    if (isNaN(element.value)) return false;

    setOtp([...otp.map((d, idx) => (idx === index ? element.value : d))]);

    // Focus next input
    if (element.nextSibling && element.value) {
      element.nextSibling.focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const otpCode = otp.join('');
    if (otpCode.length !== 6) {
      toast.error('Please enter 6-digit code');
      return;
    }

    const result = await verifyOtp(email, otpCode);
    if (result.success) {
      navigate('/dashboard');
    }
  };

  const handleResend = () => {
    toast.success('Verification code resent');
    setTimer(60);
  };

  return (
    <div className="flex items-center justify-center min-h-[85vh] p-4 sm:p-6">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md bg-white/70 backdrop-blur-xl border border-white/20 p-6 sm:p-10 rounded-[2rem] sm:rounded-[2.5rem] shadow-nexer-lg text-center relative overflow-hidden"
      >
        <div className="absolute top-0 left-0 w-full h-1.5 sm:h-2 bg-gradient-to-r from-nexer-brand-primary to-nexer-brand-secondary" />
        
        <div className="inline-flex items-center justify-center p-3 sm:p-4 bg-nexer-brand-primary/10 rounded-2xl sm:rounded-3xl mb-5 sm:mb-6 border border-nexer-brand-primary/5">
          <KeyRound className="w-6 h-6 sm:w-8 sm:h-8 text-nexer-brand-primary" />
        </div>
        
        <h1 className="text-xl sm:text-3xl font-black text-slate-900 tracking-tight">Verify Identity</h1>
        <p className="text-slate-500 text-xs sm:text-sm font-medium mt-2 sm:mt-3 mb-6 sm:mb-8 px-2">
          We've sent a 6-digit verification code to <br className="hidden sm:block" />
          <span className="text-nexer-brand-primary font-black mt-1 inline-block">{email}</span>
        </p>

        <form onSubmit={handleSubmit}>
          <div className="flex justify-between gap-1.5 sm:gap-2 mb-6 sm:mb-8">
            {otp.map((data, index) => (
              <input
                key={index}
                type="text"
                maxLength="1"
                className="w-10 h-12 sm:w-14 sm:h-16 text-center text-xl sm:text-2xl font-black bg-slate-50 border border-slate-100 rounded-xl sm:rounded-2xl focus:ring-4 focus:ring-nexer-brand-primary/5 focus:border-nexer-brand-primary outline-none transition-all text-slate-800"
                value={data}
                onChange={(e) => handleChange(e.target, index)}
                onFocus={(e) => e.target.select()}
              />
            ))}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full flex items-center justify-center gap-2 h-11 sm:h-12 text-xs sm:text-sm font-black transition-all active:scale-[0.98]"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Validating...</span>
              </>
            ) : (
              <>
                <span>Verify & Unlock</span>
              </>
            )}
          </button>
        </form>

        <div className="mt-8 flex flex-col items-center gap-3">
          <div className="flex items-center gap-2 text-[10px] sm:text-xs font-black uppercase tracking-widest text-slate-400">
            <Timer className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-nexer-brand-secondary" />
            <span>Code expires in {timer}s</span>
          </div>
          
          <button
            onClick={handleResend}
            disabled={timer > 0}
            className="text-[11px] sm:text-xs font-black text-nexer-brand-primary hover:text-nexer-brand-secondary disabled:opacity-30 disabled:cursor-not-allowed uppercase tracking-widest transition-colors"
          >
            Resend Verification Token
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default OtpPage;
