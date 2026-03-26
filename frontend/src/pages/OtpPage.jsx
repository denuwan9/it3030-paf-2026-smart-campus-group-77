import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { KeyRound, Timer } from 'lucide-react';
import toast from 'react-hot-toast';

const OtpPage = () => {
  const { verifyOtp } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const email = location.state?.email;

  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [timer, setTimer] = useState(60);
  const [loading, setLoading] = useState(false);

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

    setLoading(true);
    const result = await verifyOtp(email, otpCode);
    setLoading(false);
    
    if (result.success) {
      navigate('/dashboard');
    }
  };

  const handleResend = () => {
    // Logic for resending OTP would go here via auth context
    toast.success('Verification code resent');
    setTimer(60);
  };

  return (
    <div className="flex items-center justify-center p-4">
      <div className="w-full max-w-md glass p-8 rounded-2xl text-center">
        <div className="inline-flex items-center justify-center p-3 bg-primary-600/20 rounded-xl mb-4">
          <KeyRound className="w-8 h-8 text-primary-500" />
        </div>
        <h1 className="text-3xl font-bold">Verify Email</h1>
        <p className="text-slate-400 mt-2 mb-8">
          We've sent a 6-digit code to <br />
          <span className="text-white font-medium">{email}</span>
        </p>

        <form onSubmit={handleSubmit}>
          <div className="flex justify-between gap-2 mb-8">
            {otp.map((data, index) => (
              <input
                key={index}
                type="text"
                maxLength="1"
                className="w-12 h-14 text-center text-2xl font-bold bg-slate-800 border border-slate-700 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none transition-all"
                value={data}
                onChange={(e) => handleChange(e.target, index)}
                onFocus={(e) => e.target.select()}
              />
            ))}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary"
          >
            {loading ? 'Verifying...' : 'Verify & Continue'}
          </button>
        </form>

        <div className="mt-8 flex flex-col items-center gap-2">
          <div className="flex items-center gap-2 text-sm text-slate-400">
            <Timer className="w-4 h-4" />
            <span>Code expires in {timer}s</span>
          </div>
          
          <button
            onClick={handleResend}
            disabled={timer > 0}
            className="text-sm font-semibold text-primary-400 hover:text-primary-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Resend Verification Code
          </button>
        </div>
      </div>
    </div>
  );
};

export default OtpPage;
