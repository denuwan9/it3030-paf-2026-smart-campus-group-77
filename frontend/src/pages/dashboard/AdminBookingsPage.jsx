import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';
import bookingService from '../../services/bookingService';
import { format, parseISO } from 'date-fns';

const StatusBadge = ({ status }) => {
  const getStyles = (s) => {
    switch (s?.toUpperCase()) {
      case 'OPEN':
      case 'AVAILABLE':
      case 'ACTIVE':
      case 'APPROVED':
      case 'RESOLVED':
      case 'COMPLETED':
        return 'bg-emerald-50 text-emerald-600 border border-emerald-200/60';
      case 'IN_PROGRESS':
      case 'PENDING':
      case 'BOOKED':
        return 'bg-amber-50 text-amber-600 border border-amber-200/60';
      case 'REJECTED':
      case 'CLOSED':
      case 'CANCELLED':
      case 'OUT_OF_SERVICE':
        return 'bg-rose-50 text-rose-600 border border-rose-200/60';
      default:
        return 'bg-slate-50 text-slate-600 border border-slate-200';
    }
  };

  return (
    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${getStyles(status)}`}>
      {status?.replace('_', ' ')}
    </span>
  );
};

const AdminBookingsPage = () => {
  const { user } = useAuth();
  const isAdmin = user?.role === 'ROLE_ADMIN' || user?.role === 'ADMIN';

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoadingId, setActionLoadingId] = useState(null);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [bookingToReject, setBookingToReject] = useState(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [approveModalOpen, setApproveModalOpen] = useState(false);
  const [bookingToApprove, setBookingToApprove] = useState(null);
  const [filters, setFilters] = useState({
    status: 'All Statuses',
    search: '',
  });

  const loadBookings = async () => {
    try {
      setLoading(true);
      const params = {};
      if (filters.status && filters.status !== 'All Statuses') params.status = filters.status;

      const response = await bookingService.getAllBookings(params);
      setBookings(response.data?.data || []);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to load bookings');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBookings();
  }, [filters.status]);

  const handleDecision = async (bookingId, decision, reason = null) => {
    try {
      setActionLoadingId(bookingId);
      await bookingService.reviewBooking(bookingId, decision, reason);
      toast.success(`Booking ${decision.toLowerCase()} successfully`);
      await loadBookings();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update booking');
    } finally {
      setActionLoadingId(null);
    }
  };

  const openRejectModal = (bookingId) => {
    setBookingToReject(bookingId);
    setRejectionReason('');
    setRejectModalOpen(true);
  };

  const closeRejectModal = () => {
    setRejectModalOpen(false);
    setBookingToReject(null);
    setRejectionReason('');
  };

  const confirmRejection = async () => {
    if (!rejectionReason.trim()) {
      toast.error('Rejection reason is required');
      return;
    }
    
    closeRejectModal();
    await handleDecision(bookingToReject, 'REJECTED', rejectionReason);
  };

  const openApproveModal = (bookingId) => {
    setBookingToApprove(bookingId);
    setApproveModalOpen(true);
  };

  const closeApproveModal = () => {
    setApproveModalOpen(false);
    setBookingToApprove(null);
  };

  const confirmApproval = async () => {
    closeApproveModal();
    await handleDecision(bookingToApprove, 'APPROVED');
  };

  const openDetails = (booking) => {
    setSelectedBooking(booking);
  };

  const closeDetails = () => {
    setSelectedBooking(null);
  };

  const formatDate = (dateStr) => {
    try {
      return format(parseISO(dateStr), 'dd MMM yyyy');
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

  const stats = {
    pending: bookings.filter(b => b.status === 'PENDING').length,
    approved: bookings.filter(b => b.status === 'APPROVED').length,
    rejected: bookings.filter(b => b.status === 'REJECTED').length,
    total: bookings.length
  };

  return (
    <div className="bg-transparent min-h-[calc(100vh-80px)] font-sans text-slate-600">
      <div className="max-w-[1600px] mx-auto space-y-6">
        
        {/* Header */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 mb-1">Booking Management</h1>
          <p className="text-slate-500 text-sm">Review, approve, or reject booking requests from users.</p>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="rounded-xl p-5 border border-amber-200 bg-gradient-to-br from-amber-50 to-white shadow-sm flex flex-col justify-between h-28">
            <h3 className="text-[11px] font-bold text-amber-700 uppercase tracking-widest">Pending</h3>
            <p className="text-4xl font-extrabold text-amber-800">{stats.pending}</p>
          </div>
          <div className="rounded-xl p-5 border border-emerald-200 bg-gradient-to-br from-emerald-50 to-white shadow-sm flex flex-col justify-between h-28">
            <h3 className="text-[11px] font-bold text-emerald-700 uppercase tracking-widest">Approved</h3>
            <p className="text-4xl font-extrabold text-emerald-800">{stats.approved}</p>
          </div>
          <div className="rounded-xl p-5 border border-rose-200 bg-gradient-to-br from-rose-50 to-white shadow-sm flex flex-col justify-between h-28">
            <h3 className="text-[11px] font-bold text-rose-700 uppercase tracking-widest">Rejected</h3>
            <p className="text-4xl font-extrabold text-rose-800">{stats.rejected}</p>
          </div>
          <div className="rounded-xl p-5 border border-indigo-200 bg-gradient-to-br from-indigo-50 to-white shadow-sm flex flex-col justify-between h-28">
            <h3 className="text-[11px] font-bold text-indigo-700 uppercase tracking-widest">Total</h3>
            <p className="text-4xl font-extrabold text-indigo-800">{stats.total}</p>
          </div>
        </div>

        {/* Table Area */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
          {/* Filters Bar */}
          <div className="p-4 border-b border-slate-200 flex flex-col flex-wrap sm:flex-row gap-4 items-center justify-between bg-white">
            <input 
              type="text" 
              placeholder="Search resource, user, or purpose..." 
              value={filters.search}
              onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
              className="bg-slate-50 border border-slate-200 text-sm rounded-xl px-4 py-2.5 w-full sm:w-96 text-slate-800 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 placeholder-slate-400 transition-all font-medium"
            />
            <select
              value={filters.status}
              onChange={(e) => setFilters((prev) => ({ ...prev, status: e.target.value }))}
              className="bg-slate-50 border border-slate-200 text-sm rounded-xl px-4 py-2.5 w-full sm:w-48 text-slate-800 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 font-medium transition-all"
            >
              <option value="All Statuses">All Statuses</option>
              <option value="PENDING">Pending</option>
              <option value="APPROVED">Approved</option>
              <option value="REJECTED">Rejected</option>
              <option value="CANCELLED">Cancelled</option>
            </select>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-slate-50/50 text-slate-500 font-bold text-[11px] tracking-wider uppercase border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4">Resource</th>
                  <th className="px-6 py-4">Requested By</th>
                  <th className="px-6 py-4">Date & Time</th>
                  <th className="px-6 py-4">Purpose</th>
                  <th className="px-6 py-4 text-center">Attendees</th>
                  <th className="px-6 py-4 text-center">Status</th>
                  <th className="px-6 py-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {loading ? (
                  <tr>
                    <td colSpan="7" className="px-6 py-8 text-center text-slate-500 font-medium">Loading bookings...</td>
                  </tr>
                ) : bookings.length === 0 ? (
                   <tr>
                    <td colSpan="7" className="px-6 py-8 text-center text-slate-500 font-medium">No bookings found.</td>
                  </tr>
                ) : (
                  bookings
                  .filter(b => {
                    const term = filters.search.toLowerCase();
                    if (!term) return true;
                    return b.resourceName?.toLowerCase().includes(term) || b.requestedByName?.toLowerCase().includes(term) || b.purpose?.toLowerCase().includes(term);
                  })
                  .map((booking) => (
                    <tr key={booking.id} className="hover:bg-slate-50/80 transition-colors group">
                      <td className="px-6 py-4">
                        <p className="font-bold text-slate-900 text-sm">{booking.resourceName}</p>
                        <p className="text-xs text-slate-500 mt-1">{booking.resourceLocation || 'Campus Hub'}</p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="font-bold text-slate-900 text-sm max-w-[160px] truncate">{booking.requestedByName}</p>
                        <p className="text-xs text-slate-500 mt-1 max-w-[160px] truncate">{booking.requestedByEmail}</p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-slate-700 font-medium text-sm">{formatDate(booking.bookingDate)}</p>
                        <p className="text-xs text-slate-500 mt-1">{formatTime(booking.startTime)} - {formatTime(booking.endTime)}</p>
                      </td>
                      <td className="px-6 py-4">
                         <p className="max-w-[180px] truncate text-slate-600 text-sm font-medium">{booking.purpose || '—'}</p>
                      </td>
                      <td className="px-6 py-4 text-center text-slate-600 font-medium">
                        {booking.expectedAttendees || '—'}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <StatusBadge status={booking.status} />
                      </td>
                      <td className="px-6 py-4 text-center">
                        <div className="flex items-center justify-center gap-2 flex-wrap">
                          {booking.status === 'PENDING' ? (
                            <>
                              <button
                                onClick={() => openApproveModal(booking.id)}
                                disabled={actionLoadingId === booking.id}
                                className="px-4 py-1.5 bg-emerald-50 text-emerald-600 hover:bg-emerald-500 hover:text-white border border-emerald-200 rounded-lg text-[11px] font-bold uppercase tracking-wide transition-all shadow-sm disabled:opacity-50"
                              >
                                Approve
                              </button>
                              <button
                                onClick={() => openRejectModal(booking.id)}
                                disabled={actionLoadingId === booking.id}
                                className="px-4 py-1.5 bg-rose-50 text-rose-600 hover:bg-rose-500 hover:text-white border border-rose-200 rounded-lg text-[11px] font-bold uppercase tracking-wide transition-all shadow-sm disabled:opacity-50"
                              >
                                Reject
                              </button>
                            </>
                          ) : (
                            <button
                              onClick={() => openDetails(booking)}
                              className="px-4 py-1.5 bg-white text-slate-600 hover:bg-slate-50 hover:text-indigo-600 hover:border-indigo-200 border border-slate-200 rounded-lg text-[11px] font-bold uppercase tracking-wide transition-all shadow-sm"
                            >
                              Details
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {selectedBooking && (
          <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="w-full max-w-2xl bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-slate-900">Booking Details</h2>
                  <p className="text-xs text-slate-500 mt-0.5">Request ID: {selectedBooking.id}</p>
                </div>
                <button
                  onClick={closeDetails}
                  className="w-8 h-8 rounded-lg border border-slate-200 text-slate-500 hover:text-slate-700 hover:bg-slate-50"
                >
                  X
                </button>
              </div>

              <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-xs uppercase tracking-wider text-slate-400 font-bold">Resource</p>
                  <p className="text-slate-900 font-semibold mt-1">{selectedBooking.resourceName || '-'}</p>
                  <p className="text-slate-500 mt-1">{selectedBooking.resourceLocation || 'Campus Hub'}</p>
                </div>

                <div>
                  <p className="text-xs uppercase tracking-wider text-slate-400 font-bold">Requested By</p>
                  <p className="text-slate-900 font-semibold mt-1">{selectedBooking.requestedByName || '-'}</p>
                  <p className="text-slate-500 mt-1 break-all">{selectedBooking.requestedByEmail || '-'}</p>
                </div>

                <div>
                  <p className="text-xs uppercase tracking-wider text-slate-400 font-bold">Date</p>
                  <p className="text-slate-900 font-semibold mt-1">{formatDate(selectedBooking.bookingDate)}</p>
                </div>

                <div>
                  <p className="text-xs uppercase tracking-wider text-slate-400 font-bold">Time</p>
                  <p className="text-slate-900 font-semibold mt-1">
                    {formatTime(selectedBooking.startTime)} - {formatTime(selectedBooking.endTime)}
                  </p>
                </div>

                <div>
                  <p className="text-xs uppercase tracking-wider text-slate-400 font-bold">Attendees</p>
                  <p className="text-slate-900 font-semibold mt-1">{selectedBooking.expectedAttendees || '-'}</p>
                </div>

                <div>
                  <p className="text-xs uppercase tracking-wider text-slate-400 font-bold">Status</p>
                  <div className="mt-1">
                    <StatusBadge status={selectedBooking.status} />
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <p className="text-xs uppercase tracking-wider text-slate-400 font-bold">Purpose</p>
                  <p className="text-slate-700 mt-1">{selectedBooking.purpose || '-'}</p>
                </div>

                {selectedBooking.reviewReason && (
                  <div className="sm:col-span-2">
                    <p className="text-xs uppercase tracking-wider text-slate-400 font-bold">Admin Note</p>
                    <p className="text-slate-700 mt-1">{selectedBooking.reviewReason}</p>
                  </div>
                )}

                {selectedBooking.cancelReason && (
                  <div className="sm:col-span-2">
                    <p className="text-xs uppercase tracking-wider text-slate-400 font-bold">Cancellation Reason by User</p>
                    <p className="text-slate-700 mt-1">{selectedBooking.cancelReason}</p>
                  </div>
                )}
              </div>

              <div className="px-6 py-4 border-t border-slate-200 flex justify-end">
                <button
                  onClick={closeDetails}
                  className="px-4 py-2 rounded-lg bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-500 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Rejection Modal */}
        {rejectModalOpen && (
          <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="w-full max-w-md bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden animate-in fade-in duration-200 flex flex-col">
              <div className="px-6 py-4 border-b border-rose-100 flex items-center justify-between bg-rose-50/50">
                <h2 className="text-lg font-bold text-rose-700 tracking-tight">Reject Booking</h2>
                <button
                  onClick={closeRejectModal}
                  className="w-8 h-8 rounded-lg border border-transparent text-rose-500 hover:text-rose-700 hover:bg-rose-100 flex items-center justify-center transition-colors font-bold"
                >
                  ✕
                </button>
              </div>

              <div className="p-6">
                <p className="text-sm font-medium text-slate-600 mb-4 px-1">
                  Please provide a reason for rejecting this booking. The user will be able to see this reason.
                </p>
                <textarea
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  placeholder="Enter rejection reason..."
                  rows="4"
                  className="w-full bg-slate-50/50 border border-slate-200 text-sm font-medium rounded-xl px-4 py-3 text-slate-800 outline-none focus:bg-white focus:border-rose-400 focus:ring-4 focus:ring-rose-500/10 placeholder-slate-400 transition-all resize-none shadow-sm"
                  autoFocus
                />
              </div>

              <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-3 rounded-b-2xl">
                <button
                  onClick={closeRejectModal}
                  className="px-5 py-2 min-w-[100px] text-center bg-white text-slate-600 hover:bg-slate-100 hover:text-slate-800 border border-slate-200 rounded-xl text-sm font-bold transition-all shadow-sm"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmRejection}
                  disabled={!rejectionReason.trim()}
                  className="px-5 py-2 min-w-[100px] text-center bg-rose-600 text-white hover:bg-rose-500 rounded-xl text-sm font-bold transition-all shadow-sm active:scale-[0.98] disabled:opacity-50 disabled:active:scale-100 disabled:cursor-not-allowed"
                >
                  Confirm
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Approve Modal */}
        {approveModalOpen && (
          <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="w-full max-w-sm bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden animate-in fade-in duration-200 flex flex-col">
              <div className="px-6 py-4 border-b border-emerald-100 flex items-center justify-between bg-emerald-50/50">
                <h2 className="text-lg font-bold text-emerald-700 tracking-tight">Approve Booking</h2>
                <button
                  onClick={closeApproveModal}
                  className="w-8 h-8 rounded-lg border border-transparent text-emerald-500 hover:text-emerald-700 hover:bg-emerald-100 flex items-center justify-center transition-colors font-bold"
                >
                  ✕
                </button>
              </div>

              <div className="p-6">
                <p className="text-sm font-medium text-slate-600 px-1 text-center">
                  Are you sure you want to approve this booking request? The user will be notified of the approval.
                </p>
              </div>

              <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-3 rounded-b-2xl">
                <button
                  onClick={closeApproveModal}
                  className="px-5 py-2 min-w-[100px] text-center bg-white text-slate-600 hover:bg-slate-100 hover:text-slate-800 border border-slate-200 rounded-xl text-sm font-bold transition-all shadow-sm"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmApproval}
                  className="px-5 py-2 min-w-[100px] text-center bg-emerald-600 text-white hover:bg-emerald-500 rounded-xl text-sm font-bold transition-all shadow-sm active:scale-[0.98]"
                >
                  Approve
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default AdminBookingsPage;