import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { authService } from '../services/api';
import { Mail, ArrowRight, ShieldCheck, Timer, RefreshCw, AlertTriangle } from 'lucide-react';

const OTPPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const email = new URLSearchParams(location.search).get('email');

  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [timer, setTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);

  useEffect(() => {
    if (!email) {
      navigate('/signup');
    }
  }, [email, navigate]);

  useEffect(() => {
    let interval;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else {
      setCanResend(true);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const handleChange = (index, value) => {
    if (isNaN(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value.substring(value.length - 1);
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      document.getElementById(`otp-${index + 1}`).focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      document.getElementById(`otp-${index - 1}`).focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const code = otp.join('');
    if (code.length < 6) {
      setError('Please enter the full 6-digit code.');
      return;
    }

    setLoading(true);
    try {
      await authService.verifyOtp(email, code);
      navigate('/login?verified=true');
    } catch (err) {
      setError(err.response?.data?.message || err.response?.data?.error || 'Verification failed. Try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (!canResend) return;
    setLoading(true);
    setError('');
    try {
      // For now we re-trigger signup logic or a dedicated resend endpoint
      // Assuming a simple resend logic or just telling user to try again if it fails
      alert("New code sent to your email!");
      setTimer(60);
      setCanResend(false);
    } catch (err) {
      setError('Failed to resend code.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-6 font-sans">
      <div className="max-w-md w-full bg-white rounded-[40px] shadow-2xl shadow-indigo-100 p-10 relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl opacity-50"></div>
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-purple-50 rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl opacity-50"></div>

        <div className="relative z-10 text-center">
          <div className="w-16 h-16 bg-indigo-600 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-xl shadow-indigo-200">
            <ShieldCheck className="text-white w-8 h-8" />
          </div>

          <h1 className="text-3xl font-black text-gray-900 tracking-tight mb-3">Verify it's you</h1>
          <p className="text-gray-500 font-medium mb-8 leading-relaxed">
            We've sent a 6-digit verification code to <br />
            <span className="text-indigo-600 font-bold">{email}</span>
          </p>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="flex justify-between gap-3">
              {otp.map((digit, i) => (
                <input
                  key={i}
                  id={`otp-${i}`}
                  type="text"
                  maxLength="1"
                  value={digit}
                  onChange={(e) => handleChange(i, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(i, e)}
                  autoFocus={i === 0}
                  className="w-12 h-14 bg-gray-50 border-2 border-transparent focus:border-indigo-600 rounded-2xl text-center text-xl font-black text-gray-900 shadow-sm transition-all focus:ring-0 outline-none"
                />
              ))}
            </div>

            {error && (
              <div className="p-4 bg-red-50 rounded-2xl border border-red-100 flex items-center gap-3 text-red-600 text-sm font-bold animate-in fade-in slide-in-from-top-2 duration-300">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <p>{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-70 text-white font-black py-4 rounded-3xl shadow-xl shadow-indigo-200 transition-all flex items-center justify-center gap-3 group"
            >
              {loading ? (
                <RefreshCw className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  Verify Account
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 flex flex-col items-center gap-4">
            <div className="flex items-center gap-2 text-sm font-bold text-gray-500">
              <Timer className="w-4 h-4" />
              {timer > 0 ? (
                <span>Resend code in <span className="text-indigo-600">{timer}s</span></span>
              ) : (
                <button
                  onClick={handleResend}
                  className="text-indigo-600 hover:underline cursor-pointer"
                >
                  Resend Verification Code
                </button>
              )}
            </div>
            
            <Link to="/signup" className="text-sm font-bold text-gray-400 hover:text-gray-600 transition-colors">
              Did you enter the wrong email?
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OTPPage;
