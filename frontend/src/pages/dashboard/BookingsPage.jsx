import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { 
  Building2, 
  CalendarDays, 
  Clock, 
  Users, 
  CheckCircle2, 
  Pin, 
  MinusCircle,
  Plus,
  QrCode,
  X
} from 'lucide-react';
import bookingService from '../../services/bookingService';
import { useAuth } from '../../context/AuthContext';
import { format, parseISO } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import QRCode from 'qrcode';

const statuses = ['', 'PENDING', 'APPROVED', 'REJECTED', 'CANCELLED'];

const StatusBadge = ({ status }) => {
  const getStyles = (s) => {
    switch (s?.toUpperCase()) {
      case 'OPEN':
      case 'AVAILABLE':
      case 'ACTIVE':
      case 'APPROVED':
      case 'RESOLVED':
      case 'COMPLETED':
        return 'bg-emerald-50 text-emerald-600 border border-emerald-200';
      case 'IN_PROGRESS':
      case 'PENDING':
      case 'BOOKED':
        return 'bg-amber-50 text-amber-600 border border-amber-200';
      case 'REJECTED':
      case 'CLOSED':
      case 'CANCELLED':
      case 'OUT_OF_SERVICE':
        return 'bg-rose-50 text-rose-600 border border-rose-200';
      default:
        return 'bg-slate-50 text-slate-600 border border-slate-200';
    }
  };

  return (
    <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${getStyles(status)} tracking-wider uppercase`}>
      {status?.replace('_', ' ')}
    </span>
  );
};

const BookingsPage = () => {
  const { user } = useAuth();
  const isAdmin = user?.role === 'ROLE_ADMIN';
  const navigate = useNavigate();

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoadingId, setActionLoadingId] = useState(null);
  const [qrModalOpen, setQrModalOpen] = useState(false);
  const [qrLoading, setQrLoading] = useState(false);
  const [qrData, setQrData] = useState(null);
  const [qrImage, setQrImage] = useState('');
  
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [bookingToCancel, setBookingToCancel] = useState(null);
  const [cancelReason, setCancelReason] = useState('');

  const [filters, setFilters] = useState({
    status: '',
    fromDate: '',
    toDate: '',
  });

  useEffect(() => {
    let cancelled = false;

    const generateQr = async () => {
      if (!qrData?.verificationUrl) {
        setQrImage('');
        return;
      }

      try {
        const image = await QRCode.toDataURL(qrData.verificationUrl, {
          width: 240,
          margin: 1,
        });
        if (!cancelled) {
          setQrImage(image);
        }
      } catch (err) {
        if (!cancelled) {
          setQrImage('');
          toast.error('Failed to generate QR code image');
        }
      }
    };

    generateQr();
    return () => {
      cancelled = true;
    };
  }, [qrData]);

  const loadBookings = async () => {
    try {
      setLoading(true);
      const params = {};
      if (filters.status) params.status = filters.status;
      if (filters.fromDate) params.fromDate = filters.fromDate;
      if (filters.toDate) params.toDate = filters.toDate;

      const response = isAdmin
        ? await bookingService.getAllBookings(params)
        : await bookingService.getMyBookings(params);

      setBookings(response.data?.data || []);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to load bookings');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBookings();
  }, [isAdmin, filters.status, filters.fromDate, filters.toDate]);

  const handleDecision = async (bookingId, decision) => {
    try {
      setActionLoadingId(bookingId);
      let reason;
      if (decision === 'REJECTED') {
        reason = window.prompt('Please provide rejection reason:');
        if (!reason || !reason.trim()) {
          toast.error('Rejection reason is required');
          return;
        }
      }

      await bookingService.reviewBooking(bookingId, decision, reason);
      toast.success(`Booking ${decision.toLowerCase()} successfully`);
      await loadBookings();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update booking');
    } finally {
      setActionLoadingId(null);
    }
  };

  const openCancelModal = (bookingId) => {
    setBookingToCancel(bookingId);
    setCancelReason('');
    setCancelModalOpen(true);
  };

  const closeCancelModal = () => {
    setCancelModalOpen(false);
    setBookingToCancel(null);
    setCancelReason('');
  };

  const confirmCancellation = async () => {
    try {
      setActionLoadingId(bookingToCancel);
      closeCancelModal();
      await bookingService.cancelBooking(bookingToCancel, cancelReason);
      toast.success('Booking cancelled successfully');
      await loadBookings();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to cancel booking');
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleOpenQr = async (bookingId) => {
    try {
      setQrModalOpen(true);
      setQrLoading(true);
      setQrData(null);
      setQrImage('');

      const response = await bookingService.getCheckInQrData(bookingId);
      setQrData(response.data?.data || null);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to load check-in QR');
      setQrModalOpen(false);
    } finally {
      setQrLoading(false);
    }
  };

  const closeQrModal = () => {
    setQrModalOpen(false);
    setQrData(null);
    setQrImage('');
  };

  const formatDate = (dateStr) => {
    try {
      return format(parseISO(dateStr), 'eeee, d MMMM yyyy');
    } catch (e) {
      return dateStr;
    }
  };

  const formatTime = (timeStr) => {
    try {
      if (!timeStr) return '';
      const [hours, minutes] = timeStr.split(':');
      const h = parseInt(hours, 10);
      const ampm = h >= 12 ? 'PM' : 'AM';
      const formattedH = h % 12 || 12;
      return `${formattedH}:${minutes} ${ampm}`;
    } catch (e) {
      return timeStr;
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-white shadow-sm">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm shadow-inner">
            <CalendarDays className="w-7 h-7 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Booking Management</h1>
            <p className="text-indigo-100 text-sm mt-1">Manage your facility and equipment bookings with ease</p>
          </div>
        </div>
        <button 
          onClick={() => navigate('/resources')}
          className="bg-white text-indigo-600 px-5 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 hover:bg-slate-50 transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" />
          New Booking
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <select
          value={filters.status}
          onChange={(e) => setFilters((prev) => ({ ...prev, status: e.target.value }))}
          className="bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-indigo-500/20 w-48 shadow-sm text-slate-700"
        >
          <option value="">All Statuses</option>
          <option value="PENDING">Pending</option>
          <option value="APPROVED">Approved</option>
          <option value="REJECTED">Rejected</option>
          <option value="CANCELLED">Cancelled</option>
        </select>
      </div>

      {/* Bookings List */}
      <div className="space-y-4">
        {loading ? (
          <div className="p-10 text-center text-sm text-slate-500 bg-white rounded-2xl border border-indigo-100/50 shadow-sm">Loading bookings...</div>
        ) : bookings.length === 0 ? (
          <div className="p-10 text-center text-sm text-slate-500 bg-white rounded-2xl border border-indigo-100/50 shadow-sm">No bookings found.</div>
        ) : (
          bookings.map((booking) => {
            const canApprove = isAdmin && booking.status === 'PENDING';
            const canCancel = booking.status === 'APPROVED' || booking.status === 'PENDING';
            const isApproved = booking.status === 'APPROVED';
            const actionLoading = actionLoadingId === booking.id;

            return (
              <div key={booking.id} className="bg-white border border-indigo-100/60 rounded-2xl p-5 sm:p-6 shadow-sm hover:shadow-md transition-shadow">
                
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div className="flex items-center gap-3">
                    <div className="bg-slate-100 p-2.5 rounded-lg">
                      <Building2 className="w-5 h-5 text-slate-600" />
                    </div>
                    <div className="flex items-center gap-3 flex-wrap">
                      <h3 className="text-lg font-bold text-slate-900">{booking.resourceName}</h3>
                      <StatusBadge status={booking.status} />
                    </div>
                  </div>
                  
                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    {isApproved && (
                      <button
                        onClick={() => handleOpenQr(booking.id)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-indigo-200 text-indigo-600 text-sm font-bold hover:bg-indigo-50 transition-colors"
                      >
                        <QrCode className="w-4 h-4" />
                        Check-In QR
                      </button>
                    )}

                    {canCancel && (
                      <button
                        onClick={() => openCancelModal(booking.id)}
                        disabled={actionLoading}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-rose-100 text-rose-500 text-sm font-bold hover:bg-rose-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <MinusCircle className="w-4 h-4 text-rose-500" />
                        Cancel
                      </button>
                    )}
                    
                    {canApprove && (
                        <div className="flex gap-2">
                            <button
                                onClick={() => handleDecision(booking.id, 'APPROVED')}
                                disabled={actionLoading}
                                className="px-4 py-1.5 rounded-lg bg-emerald-600 text-white text-sm font-semibold hover:bg-emerald-500 disabled:opacity-50"
                            >
                                Approve
                            </button>
                            <button
                                onClick={() => handleDecision(booking.id, 'REJECTED')}
                                disabled={actionLoading}
                                className="px-4 py-1.5 rounded-lg bg-rose-600 text-white text-sm font-semibold hover:bg-rose-500 disabled:opacity-50"
                            >
                                Reject
                            </button>
                        </div>
                    )}
                  </div>
                </div>

                <div className="mt-4 pl-0 sm:pl-14 space-y-2.5">
                  {booking.purpose && (
                    <p className="text-slate-800 text-sm font-medium mb-3">{booking.purpose}</p>
                  )}

                  <div className="flex items-center gap-2.5 text-slate-500 text-sm font-medium">
                    <CalendarDays className="w-4 h-4 text-indigo-400" />
                    <span>{formatDate(booking.bookingDate)}</span>
                  </div>

                  <div className="flex items-center gap-2.5 text-slate-500 text-sm font-medium">
                    <Clock className="w-4 h-4 text-slate-400 font-bold" />
                    <span>{formatTime(booking.startTime)} – {formatTime(booking.endTime)}</span>
                  </div>

                  {booking.expectedAttendees > 0 && (
                    <div className="flex items-center gap-2.5 text-slate-500 text-sm font-medium">
                      <Users className="w-4 h-4 text-indigo-800" />
                      <span>{booking.expectedAttendees} attendees</span>
                    </div>
                  )}

                  {isAdmin && (
                    <div className="flex items-center gap-2.5 text-slate-500 text-sm mt-3 pt-3 border-t border-slate-100">
                       <span className="font-semibold text-slate-700">Requested by:</span> {booking.requestedByName} ({booking.requestedByEmail})
                    </div>
                  )}

                  {/* Checked in mockup element for approved bookings */}
                  {isApproved && (
                    <div className="flex items-center gap-2 text-emerald-600 font-bold text-sm mt-3">
                      <CheckCircle2 className="w-[18px] h-[18px]" />
                      <span>Last scanned time {(booking.lastScannedAt || booking.checkedInAt) ? new Date(booking.lastScannedAt || booking.checkedInAt).toLocaleString() : 'Not scanned yet'}</span>
                    </div>
                  )}
                </div>

                {/* Reason Section */}
                {(booking.reviewReason || booking.cancelReason) && (
                  <div className="mt-5 sm:ml-14 bg-[#fffdf0] border border-amber-200/60 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-1">
                      <Pin className="w-4 h-4 text-amber-700 fill-amber-700" />
                      <span className="text-sm font-bold text-amber-900">
                        {booking.cancelReason ? 'Cancellation Reason by User' : 'Note from Admin'}
                      </span>
                    </div>
                    <p className="text-sm text-amber-700 ml-6">
                      {booking.cancelReason || booking.reviewReason}
                    </p>
                  </div>
                )}

              </div>
            );
          })
        )}
      </div>

      {/* Cancel Modal */}
      {cancelModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="px-6 py-4 border-b border-rose-100 flex items-center justify-between bg-rose-50/50">
              <div>
                <h2 className="text-lg font-bold text-rose-700 tracking-tight">Cancel Booking</h2>
              </div>
              <button
                onClick={closeCancelModal}
                className="w-8 h-8 rounded-lg border border-transparent text-rose-500 hover:text-rose-700 hover:bg-rose-100 flex items-center justify-center transition-colors font-bold"
              >
                ✕
              </button>
            </div>

            <div className="p-6">
              <p className="text-sm font-medium text-slate-600 mb-4 px-1">
                Please provide a reason for cancelling this booking. This is optional but helps admins understand why the booking is no longer needed.
              </p>
              <textarea
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                placeholder="Cancellation reason (optional)..."
                rows="4"
                className="w-full bg-slate-50/50 border border-slate-200 text-sm font-medium rounded-xl px-4 py-3 text-slate-800 outline-none focus:bg-white focus:border-rose-400 focus:ring-4 focus:ring-rose-500/10 placeholder-slate-400 transition-all resize-none shadow-sm"
                autoFocus
              />
            </div>

            <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-3 rounded-b-2xl">
              <button
                onClick={closeCancelModal}
                className="px-5 py-2 min-w-[100px] text-center bg-white text-slate-600 hover:bg-slate-100 hover:text-slate-800 border border-slate-200 rounded-xl text-sm font-bold transition-all shadow-sm"
              >
                Go Back
              </button>
              <button
                onClick={confirmCancellation}
                disabled={actionLoadingId === bookingToCancel}
                className="px-5 py-2 min-w-[100px] text-center bg-rose-600 text-white hover:bg-rose-500 rounded-xl text-sm font-bold transition-all shadow-sm active:scale-[0.98] disabled:opacity-50 disabled:active:scale-100 disabled:cursor-not-allowed"
              >
                {actionLoadingId === bookingToCancel ? 'Cancelling...' : 'Confirm Cancel'}
              </button>
            </div>
          </div>
        </div>
      )}

      {qrModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white rounded-2xl border border-slate-200 shadow-xl">
            <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-slate-900">QR Check-In</h2>
                <p className="text-xs text-slate-500 mt-0.5">Scan at the verification desk to check in.</p>
              </div>
              <button
                onClick={closeQrModal}
                className="w-8 h-8 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 hover:text-slate-700"
              >
                <X className="w-4 h-4 mx-auto" />
              </button>
            </div>

            <div className="p-5 space-y-4">
              {qrLoading ? (
                <div className="text-sm text-slate-500">Loading QR code...</div>
              ) : qrData ? (
                <>
                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm">
                    <p className="font-semibold text-slate-900">{qrData.resourceName}</p>
                    <p className="text-slate-600 mt-1">{qrData.bookingDate} | {formatTime(qrData.startTime)} - {formatTime(qrData.endTime)}</p>
                  </div>

                  <div className="bg-white border border-slate-200 rounded-xl p-4 flex items-center justify-center">
                    {qrImage ? (
                      <img src={qrImage} alt="Booking check-in QR" className="w-56 h-56" />
                    ) : (
                      <div className="text-sm text-slate-500">Generating QR image...</div>
                    )}
                  </div>

                  <p className="text-xs text-slate-500 break-all">
                    Verification URL: {qrData.verificationUrl}
                  </p>
                </>
              ) : (
                <div className="text-sm text-rose-600">Unable to load QR code data.</div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingsPage;
