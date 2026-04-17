import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Building2,
  MapPin,
  Users,
  X,
  Loader2,
  ArrowRight,
  Eye,
  LayoutGrid,
  List,
} from 'lucide-react';
import facilityService from '../../services/facilityService';
import bookingService from '../../services/bookingService';
import toast from 'react-hot-toast';

const statusColors = {
  AVAILABLE: { bg: 'bg-emerald-50', text: 'text-emerald-600', border: 'border-emerald-100', dot: 'bg-emerald-500' },
  MAINTENANCE: { bg: 'bg-amber-50', text: 'text-amber-600', border: 'border-amber-100', dot: 'bg-amber-500' },
  CLOSED: { bg: 'bg-rose-50', text: 'text-rose-600', border: 'border-rose-100', dot: 'bg-rose-500' },
};

const emptyBookingForm = {
  bookingDate: '',
  startTime: '',
  endTime: '',
  purpose: '',
  expectedAttendees: '',
};

const getTodayDateString = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const getFacilityType = (facility) => facility?.type || facility?.facilityType || facility?.category || '';

const FacilitiesPage = () => {
  const [facilities, setFacilities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('AVAILABLE');
  const [minCapacityFilter, setMinCapacityFilter] = useState('');
  const [selectedFacility, setSelectedFacility] = useState(null);
  const [viewMode, setViewMode] = useState('grid');
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [bookingForm, setBookingForm] = useState(emptyBookingForm);
  const [submittingBooking, setSubmittingBooking] = useState(false);

  const minBookingDate = useMemo(() => getTodayDateString(), []);

  const facilityTypes = useMemo(() => {
    const allTypes = facilities
      .map((facility) => getFacilityType(facility))
      .filter(Boolean);
    return [...new Set(allTypes)];
  }, [facilities]);

  useEffect(() => {
    fetchFacilities();
  }, []);

  const fetchFacilities = async () => {
    try {
      setLoading(true);
      const res = await facilityService.getAllFacilities();
      setFacilities(res.data || []);
    } catch (err) {
      toast.error('Failed to load facilities');
    } finally {
      setLoading(false);
    }
  };

  const openFacilityDetails = (facility) => {
    setSelectedFacility(facility);
    setBookingModalOpen(false);
  };

  const closeBookingModal = () => {
    setBookingModalOpen(false);
    setBookingForm(emptyBookingForm);
  };

  const openScheduleBookingModal = () => {
    if (!selectedFacility) {
      return;
    }

    if (selectedFacility.status !== 'AVAILABLE') {
      toast.error('This facility is currently not available for booking.');
      return;
    }

    setBookingModalOpen(true);
  };

  const handleBookResourceFromFacility = async (e) => {
    e.preventDefault();
    if (!selectedFacility) return;

    if (bookingForm.bookingDate < minBookingDate) {
      toast.error('Past dates are not allowed. Please select today or a future date.');
      return;
    }

    const maxAttendees = Number(selectedFacility.capacity || 0);
    const attendeesCount = bookingForm.expectedAttendees
      ? Number(bookingForm.expectedAttendees)
      : null;

    if (attendeesCount !== null && attendeesCount < 1) {
      toast.error('Attendees must be at least 1.');
      return;
    }

    if (attendeesCount !== null && maxAttendees > 0 && attendeesCount > maxAttendees) {
      toast.error(`Attendees cannot exceed the maximum capacity (${maxAttendees}).`);
      return;
    }

    try {
      setSubmittingBooking(true);
      const payload = {
        facilityId: selectedFacility.id,
        bookingDate: bookingForm.bookingDate,
        startTime: bookingForm.startTime,
        endTime: bookingForm.endTime,
        purpose: bookingForm.purpose,
      };

      if (attendeesCount !== null) {
        payload.expectedAttendees = attendeesCount;
      }

      await bookingService.createBooking(payload);
      toast.success('Booking request submitted for approval');
      closeBookingModal();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to submit booking request');
    } finally {
      setSubmittingBooking(false);
    }
  };

  const filtered = facilities.filter((f) => {
    const facilityType = getFacilityType(f);
    const minCapacity = minCapacityFilter === '' ? null : Number(minCapacityFilter);
    const facilityCapacity = Number(f.capacity);
    const matchesSearch =
      f.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      f.location?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = !typeFilter || facilityType === typeFilter;
    const matchesStatus = !statusFilter || f.status === statusFilter;
    const matchesMinCapacity = minCapacity === null || (!Number.isNaN(facilityCapacity) && facilityCapacity >= minCapacity);
    return matchesSearch && matchesType && matchesStatus && matchesMinCapacity;
  });

  return (
    <div className="space-y-8 pb-20">
      {/* Page Header */}
      <div className="bg-[#6B65FB] rounded-2xl p-6 sm:p-8 flex items-center gap-6 shadow-sm">
        <div className="hidden sm:flex bg-white/20 p-4 rounded-2xl shadow-inner">
          <Building2 className="w-10 h-10 text-white" />
        </div>
        <div className="text-white">
          <h1 className="text-3xl font-bold tracking-tight">Facilities Catalogue</h1>
          <p className="text-indigo-100 font-medium mt-1">Browse all campus buildings, labs, and rooms</p>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="bg-white rounded-3xl border border-slate-200 p-5 sm:p-6 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="space-y-1.5 flex flex-col">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Search Facilities</label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Enter facility name..."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-700 outline-none focus:ring-2 focus:ring-[#6B65FB]/20 focus:border-[#6B65FB] transition-all"
            />
          </div>

          <div className="space-y-1.5 flex flex-col">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Facility Type</label>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-700 outline-none focus:ring-2 focus:ring-[#6B65FB]/20 focus:border-[#6B65FB] transition-all appearance-none"
            >
              <option value="">All Types</option>
              {facilityTypes.map((type) => (
                <option key={type} value={type}>
                  {String(type).replaceAll('_', ' ')}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5 flex flex-col">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Status</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-700 outline-none focus:ring-2 focus:ring-[#6B65FB]/20 focus:border-[#6B65FB] transition-all appearance-none"
            >
              <option value="">All Status</option>
              <option value="AVAILABLE">AVAILABLE</option>
              <option value="MAINTENANCE">MAINTENANCE</option>
              <option value="CLOSED">CLOSED</option>
            </select>
          </div>

          <div className="space-y-1.5 flex flex-col">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Min Capacity</label>
            <input
              type="number"
              min="0"
              value={minCapacityFilter}
              onChange={(e) => setMinCapacityFilter(e.target.value)}
              placeholder="0"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-700 outline-none focus:ring-2 focus:ring-[#6B65FB]/20 focus:border-[#6B65FB] transition-all"
            />
          </div>
        </div>
        <div className="mt-4 flex items-center bg-slate-50 p-1 rounded-xl border border-slate-200 w-fit">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-2 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-400 hover:text-slate-600'}`}
          >
            <LayoutGrid className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`p-2 rounded-lg transition-all ${viewMode === 'list' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-400 hover:text-slate-600'}`}
          >
            <List className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
        </div>
      )}

      {/* Empty State */}
      {!loading && filtered.length === 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center py-20"
        >
          <div className="w-20 h-20 mx-auto bg-slate-50 rounded-3xl flex items-center justify-center mb-5 border border-slate-100">
            <Building2 className="w-9 h-9 text-slate-300" />
          </div>
          <h3 className="text-lg font-bold text-slate-700">No Facilities Found</h3>
          <p className="text-sm text-slate-400 mt-1 max-w-sm mx-auto">
            {searchTerm || typeFilter || statusFilter || minCapacityFilter
              ? 'Try adjusting your search or filters.'
              : 'No facilities have been added to the system yet.'}
          </p>
        </motion.div>
      )}

      {/* Grid View */}
      {!loading && filtered.length > 0 && viewMode === 'grid' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((facility, i) => {
            const sc = statusColors[facility.status] || statusColors.AVAILABLE;
            return (
              <motion.div
                key={facility.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                whileHover={{ y: -5 }}
                onClick={() => openFacilityDetails(facility)}
                className="bg-white border border-slate-100 rounded-[2rem] overflow-hidden shadow-nexer-sm hover:shadow-nexer-md transition-all cursor-pointer group"
              >
                {/* Image / Gradient Header */}
                <div className="relative h-40 overflow-hidden">
                  {facility.imageUrl ? (
                    <img src={facility.imageUrl} alt={facility.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-600 flex items-center justify-center">
                      <Building2 className="w-12 h-12 text-white/30" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                  {/* Status Badge */}
                  <div className="absolute top-4 left-4">
                    <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${sc.bg} ${sc.text} ${sc.border}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${sc.dot} animate-pulse`} />
                      {facility.status}
                    </div>
                  </div>

                  {/* Capacity Badge */}
                  {facility.capacity && (
                    <div className="absolute top-4 right-4">
                      <div className="inline-flex items-center gap-1 px-2.5 py-1 bg-white/20 backdrop-blur-md border border-white/30 rounded-full text-[10px] font-bold text-white">
                        <Users className="w-3 h-3" />
                        {facility.capacity}
                      </div>
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-6 space-y-4">
                  <div className="space-y-2">
                    <h3 className="text-lg font-black text-nexer-text-header group-hover:text-blue-600 transition-colors tracking-tight line-clamp-1">
                      {facility.name}
                    </h3>
                    {facility.location && (
                      <div className="flex items-center gap-2 text-slate-500 text-xs font-bold">
                        <div className="w-6 h-6 bg-slate-50 rounded-lg flex items-center justify-center text-slate-400 group-hover:text-blue-500 transition-colors">
                          <MapPin className="w-3 h-3" />
                        </div>
                        {facility.location}
                      </div>
                    )}
                    {facility.description && (
                      <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">{facility.description}</p>
                    )}
                  </div>

                  <button className="w-full py-3 bg-slate-50 hover:bg-blue-600 text-slate-500 hover:text-white font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-2 border border-slate-100 hover:border-transparent active:scale-95">
                    <Eye className="w-4 h-4" />
                    View Details & Resources
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* List View */}
      {!loading && filtered.length > 0 && viewMode === 'list' && (
        <div className="space-y-3">
          {filtered.map((facility, i) => {
            const sc = statusColors[facility.status] || statusColors.AVAILABLE;
            return (
              <motion.div
                key={facility.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.04 }}
                onClick={() => openFacilityDetails(facility)}
                className="bg-white border border-slate-100 rounded-2xl p-5 flex items-center gap-5 shadow-nexer-sm hover:shadow-nexer-md transition-all cursor-pointer group hover:border-blue-100"
              >
                <div className="w-14 h-14 flex-shrink-0 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-sm">
                  <Building2 className="w-6 h-6 text-white/80" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-nexer-text-header group-hover:text-blue-600 transition-colors truncate">{facility.name}</h3>
                  <div className="flex items-center gap-4 mt-1 text-xs text-slate-400 font-medium">
                    {facility.location && (
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" /> {facility.location}
                      </span>
                    )}
                    {facility.capacity && (
                      <span className="flex items-center gap-1">
                        <Users className="w-3 h-3" /> {facility.capacity} capacity
                      </span>
                    )}
                  </div>
                </div>
                <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${sc.bg} ${sc.text} ${sc.border}`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${sc.dot}`} />
                  {facility.status}
                </div>
                <ArrowRight className="w-5 h-5 text-slate-300 group-hover:text-blue-500 group-hover:translate-x-1 transition-all flex-shrink-0" />
              </motion.div>
            );
          })}
        </div>
      )}

      {/* ── Facility Details Sidebar ── */}
      <AnimatePresence>
        {selectedFacility && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => {
                setSelectedFacility(null);
                setBookingModalOpen(false);
              }}
              className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-50"
            />

            {/* Panel */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 bottom-0 w-full max-w-lg bg-white z-50 shadow-2xl overflow-y-auto"
            >
              {/* Header */}
              <div className="sticky top-0 bg-white/90 backdrop-blur-xl border-b border-slate-100 p-6 flex items-center justify-between z-10">
                <div>
                  <h2 className="text-xl font-black text-nexer-text-header tracking-tight">{selectedFacility.name}</h2>
                  <p className="text-xs text-slate-400 font-medium mt-0.5">{selectedFacility.location || 'No location set'}</p>
                </div>
                <button
                  onClick={() => {
                    setSelectedFacility(null);
                    setBookingModalOpen(false);
                  }}
                  className="p-2 hover:bg-slate-100 rounded-xl transition-colors text-slate-400"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 space-y-6">
                {/* Facility Info */}
                <div className="bg-slate-50 rounded-2xl p-5 space-y-4 border border-slate-100">
                  <h3 className="text-sm font-black text-slate-700 uppercase tracking-widest">Facility Info</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Status</p>
                      <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${statusColors[selectedFacility.status]?.bg} ${statusColors[selectedFacility.status]?.text} ${statusColors[selectedFacility.status]?.border}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${statusColors[selectedFacility.status]?.dot}`} />
                        {selectedFacility.status}
                      </div>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Capacity</p>
                      <p className="text-sm font-bold text-slate-800">{selectedFacility.capacity || '—'} people</p>
                    </div>
                  </div>
                  {selectedFacility.description && (
                    <div className="space-y-1">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Description</p>
                      <p className="text-sm text-slate-600 leading-relaxed">{selectedFacility.description}</p>
                    </div>
                  )}
                </div>

                {/* Booking */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-black text-slate-700 uppercase tracking-widest">Schedule Booking</h3>
                  </div>

                  <div className="bg-slate-50 rounded-2xl border border-slate-100 p-5 space-y-4">
                    <p className="text-sm text-slate-500">
                      Book this facility directly by choosing your schedule details.
                    </p>

                    <button
                      onClick={openScheduleBookingModal}
                      disabled={selectedFacility.status !== 'AVAILABLE'}
                      className={`w-full py-3 rounded-xl text-sm font-semibold transition-all ${
                        selectedFacility.status !== 'AVAILABLE'
                          ? 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200'
                          : 'bg-[#6B65FB]/5 text-[#6B65FB] hover:bg-[#6B65FB] hover:text-white border border-[#6B65FB]/20'
                      }`}
                    >
                      Schedule Booking
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {bookingModalOpen && selectedFacility && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-[24px] border border-slate-200 w-full max-w-xl p-8 shadow-2xl">
            <div className="flex items-center justify-between gap-4 mb-6">
              <div>
                <h2 className="text-2xl font-bold text-slate-900">Request Booking</h2>
                <p className="text-sm font-medium text-slate-500 mt-1">{selectedFacility.name} • {selectedFacility.location || 'No location set'}</p>
              </div>
              <button
                onClick={closeBookingModal}
                className="text-slate-400 hover:text-slate-700 bg-slate-50 hover:bg-slate-100 rounded-full p-2 transition-all"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleBookResourceFromFacility} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider pl-1">Booking Date</label>
                  <input
                    type="date"
                    value={bookingForm.bookingDate}
                    onChange={(e) => {
                      const selectedDate = e.target.value;
                      if (selectedDate && selectedDate < minBookingDate) {
                        toast.error('You cannot select a past date.');
                        return;
                      }
                      setBookingForm((prev) => ({ ...prev, bookingDate: selectedDate }));
                    }}
                    min={minBookingDate}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium text-slate-800 outline-none focus:ring-2 focus:ring-[#6B65FB]/20 focus:border-[#6B65FB] transition-all"
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider pl-1">
                    Attendees {Number(selectedFacility.capacity || 0) > 0 ? `(Max ${Number(selectedFacility.capacity || 0)})` : ''}
                  </label>
                  <input
                    type="number"
                    min="1"
                    max={Number(selectedFacility.capacity || 0) || undefined}
                    value={bookingForm.expectedAttendees}
                    onChange={(e) => setBookingForm((prev) => ({ ...prev, expectedAttendees: e.target.value }))}
                    placeholder="E.g., 30"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium text-slate-800 outline-none focus:ring-2 focus:ring-[#6B65FB]/20 focus:border-[#6B65FB] transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider pl-1">Start Time</label>
                  <input
                    type="time"
                    value={bookingForm.startTime}
                    onChange={(e) => setBookingForm((prev) => ({ ...prev, startTime: e.target.value }))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium text-slate-800 outline-none focus:ring-2 focus:ring-[#6B65FB]/20 focus:border-[#6B65FB] transition-all"
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider pl-1">End Time</label>
                  <input
                    type="time"
                    value={bookingForm.endTime}
                    onChange={(e) => setBookingForm((prev) => ({ ...prev, endTime: e.target.value }))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium text-slate-800 outline-none focus:ring-2 focus:ring-[#6B65FB]/20 focus:border-[#6B65FB] transition-all"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider pl-1">Booking Purpose</label>
                <textarea
                  value={bookingForm.purpose}
                  onChange={(e) => setBookingForm((prev) => ({ ...prev, purpose: e.target.value }))}
                  placeholder="Provide a brief reason for booking this resource..."
                  rows={3}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium text-slate-800 outline-none focus:ring-2 focus:ring-[#6B65FB]/20 focus:border-[#6B65FB] transition-all resize-none"
                  required
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={closeBookingModal}
                  className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-sm font-bold hover:bg-slate-50 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingBooking}
                  className="px-5 py-2.5 rounded-xl bg-[#6B65FB] text-white text-sm font-bold hover:bg-[#5a54da] disabled:bg-slate-300 transition-all shadow-sm shadow-[#6B65FB]/20"
                >
                  {submittingBooking ? 'Submitting...' : 'Submit Request'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default FacilitiesPage;
