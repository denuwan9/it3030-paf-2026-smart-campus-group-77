import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { CheckCircle2, QrCode, ShieldCheck, XCircle } from 'lucide-react';
import bookingService from '../../services/bookingService';

const formatDateTime = (value) => {
  if (!value) return 'N/A';
  try {
    return new Date(value).toLocaleString();
  } catch {
    return 'N/A';
  }
};

const formatBookingEndDateTime = (bookingDate, endTime) => {
  if (!bookingDate || !endTime) return 'N/A';
  return `${bookingDate} ${endTime}`;
};

const buildScanErrorMessage = (message) => {
  const normalized = (message || '').toLowerCase();
  if (normalized.includes('expired')) {
    return `Booking expired: ${message}`;
  }
  if (normalized.includes('not open yet')) {
    return `Scan too early: ${message}`;
  }
  return `Scan failed: ${message}`;
};

const AdminCheckInVerifyPage = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  const [loading, setLoading] = useState(true);
  const [verifying, setVerifying] = useState(false);
  const [details, setDetails] = useState(null);
  const [scanResult, setScanResult] = useState(null);
  const autoVerifyTriggeredRef = useRef(false);

  useEffect(() => {
    const load = async () => {
      if (!token) {
        setScanResult({
          type: 'error',
          message: 'Scan failed: no token provided in the URL.'
        });
        setLoading(false);
        return;
      }

      try {
        const response = await bookingService.lookupCheckInToken(token);
        const payload = response.data?.data || null;
        setDetails(payload);

        if (payload?.expired && payload?.checkedIn) {
          setScanResult({
            type: 'error',
            message: `Booking expired. Last checked time: ${formatDateTime(payload?.lastScannedAt || payload?.checkedInAt)}.`
          });
        } else if (payload?.expired) {
          setScanResult({
            type: 'error',
            message: `Booking expired. Ended at ${formatBookingEndDateTime(payload?.bookingDate, payload?.endTime)}.`
          });
        } else if (payload?.checkedIn) {
          setScanResult({
            type: 'success',
            message: 'Scan success: booking is already checked in.'
          });
        }
      } catch (error) {
        const errorMessage = error.response
          ? (error.response?.data?.message || 'Invalid or expired check-in token')
          : 'Verification service unavailable (network/auth redirect). Please restart backend and try again.';
        setScanResult({
          type: 'error',
          message: buildScanErrorMessage(errorMessage)
        });
        toast.error(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [token]);

  const handleVerify = useCallback(async ({ showToast = true } = {}) => {
    if (!token) return;

    try {
      setVerifying(true);
      const response = await bookingService.verifyCheckInToken(token);
      const payload = response.data?.data || null;
      setDetails(payload);
      setScanResult({
        type: 'success',
        message: 'Scan success: booking checked in successfully.'
      });

      if (showToast) {
        toast.success('Booking checked in successfully');
      }
    } catch (error) {
      const errorMessage = error.response
        ? (error.response?.data?.message || 'Failed to verify check-in')
        : 'Verification service unavailable (network/auth redirect). Please restart backend and try again.';
      setScanResult({
        type: 'error',
        message: buildScanErrorMessage(errorMessage)
      });

      if (showToast) {
        toast.error(errorMessage);
      }
    } finally {
      setVerifying(false);
    }
  }, [token]);

  useEffect(() => {
    if (
      loading ||
      !token ||
      !details ||
      details.expired ||
      verifying ||
      autoVerifyTriggeredRef.current
    ) {
      return;
    }

    autoVerifyTriggeredRef.current = true;
    setScanResult({
      type: 'pending',
      message: 'Token valid. Verifying check-in...'
    });
    handleVerify({ showToast: false });
  }, [loading, token, details, verifying, handleVerify]);

  const resultStyles = scanResult?.type === 'success'
    ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
    : scanResult?.type === 'pending'
      ? 'bg-amber-50 border-amber-200 text-amber-700'
      : 'bg-rose-50 border-rose-200 text-rose-700';

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="bg-gradient-to-r from-indigo-600 to-sky-600 rounded-2xl p-6 text-white shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
            <QrCode className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Booking Check-In Verification</h1>
            <p className="text-indigo-100 text-sm mt-1">Scan or open a QR token and verify approved booking check-in.</p>
          </div>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
        {scanResult && (
          <div className={`mb-4 rounded-xl border px-4 py-3 text-sm font-semibold ${resultStyles}`}>
            {scanResult.message}
          </div>
        )}

        {loading ? (
          <p className="text-slate-500 text-sm">Loading verification data...</p>
        ) : !token ? (
          <div className="flex items-center gap-2 text-rose-600">
            <XCircle className="w-5 h-5" />
            <p className="font-semibold">No token provided in URL.</p>
          </div>
        ) : !details ? (
          <div className="flex items-center gap-2 text-rose-600">
            <XCircle className="w-5 h-5" />
            <p className="font-semibold">Invalid or expired check-in token.</p>
          </div>
        ) : (
          <div className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-xs uppercase tracking-wider text-slate-400 font-bold">Resource</p>
                <p className="text-slate-900 font-semibold mt-1">{details.resourceName}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wider text-slate-400 font-bold">Requested By</p>
                <p className="text-slate-900 font-semibold mt-1">{details.requestedByName}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wider text-slate-400 font-bold">Date</p>
                <p className="text-slate-900 font-semibold mt-1">{details.bookingDate}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wider text-slate-400 font-bold">Time</p>
                <p className="text-slate-900 font-semibold mt-1">{details.startTime} - {details.endTime}</p>
              </div>
            </div>

            {details.expired ? (
              <div className="bg-rose-50 border border-rose-200 rounded-xl p-4">
                <div className="flex items-center gap-2 text-rose-700 font-semibold">
                  <XCircle className="w-5 h-5" />
                  Booking expired
                </div>
                <p className="text-sm text-rose-700 mt-1">
                  Booking ended at {formatBookingEndDateTime(details.bookingDate, details.endTime)}.
                </p>
                {details.checkedInAt && (
                  <p className="text-sm text-rose-700 mt-1">
                    Last checked time: {formatDateTime(details.lastScannedAt || details.checkedInAt)}
                  </p>
                )}
              </div>
            ) : details.checkedIn ? (
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4">
                <div className="flex items-center gap-2 text-emerald-700 font-semibold">
                  <CheckCircle2 className="w-5 h-5" />
                  Booking already checked in
                </div>
                <p className="text-sm text-emerald-700 mt-1">
                  Checked in by {details.checkedInByName || 'Admin'}
                </p>
                <p className="text-sm text-emerald-700 mt-1">
                  Last checked time: {formatDateTime(details.lastScannedAt || details.checkedInAt)}
                </p>
              </div>
            ) : (
              <button
                onClick={handleVerify}
                disabled={verifying}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-500 disabled:opacity-60 transition-colors"
              >
                <ShieldCheck className="w-4 h-4" />
                {verifying ? 'Verifying...' : scanResult?.type === 'error' ? 'Retry Check-In' : 'Confirm Check-In'}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminCheckInVerifyPage;
