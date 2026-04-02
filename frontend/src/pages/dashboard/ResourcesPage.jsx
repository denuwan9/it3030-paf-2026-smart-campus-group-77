import React, { useEffect, useMemo, useState } from 'react';
import { Search, Calendar, Landmark, Microscope, Users, Settings, BookOpen } from 'lucide-react';
import toast from 'react-hot-toast';
import bookingService from '../../services/bookingService';

const resourceTypes = ['', 'LECTURE_HALL', 'LAB', 'MEETING_ROOM', 'EQUIPMENT'];
const resourceStatuses = ['', 'ACTIVE', 'OUT_OF_SERVICE'];

const emptyBookingForm = {
  bookingDate: '',
  startTime: '',
  endTime: '',
  purpose: '',
  expectedAttendees: '',
};

const formatType = (type) => type?.replaceAll('_', ' ') || '-';

const getResourceIcon = (type) => {
  switch (type) {
    case 'LAB':
      return <Microscope className="w-6 h-6 text-indigo-500" />;
    case 'LECTURE_HALL':
      return <BookOpen className="w-6 h-6 text-indigo-500" />;
    case 'MEETING_ROOM':
      return <Users className="w-6 h-6 text-indigo-500" />;
    case 'EQUIPMENT':
      return <Settings className="w-6 h-6 text-indigo-500" />;
    default:
      return <Landmark className="w-6 h-6 text-indigo-500" />;
  }
};

const ResourcesPage = () => {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedResource, setSelectedResource] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [filters, setFilters] = useState({
    search: '',
    type: '',
    minCapacity: '',
    status: 'ACTIVE', // Default to ACTIVE based on UI
  });
  const [bookingForm, setBookingForm] = useState(emptyBookingForm);

  const queryParams = useMemo(() => {
    const params = {};
    if (filters.search) params.search = filters.search;
    if (filters.type) params.type = filters.type;
    if (filters.minCapacity) params.minCapacity = Number(filters.minCapacity);
    if (filters.status) params.status = filters.status;
    return params;
  }, [filters]);

  const loadResources = async () => {
    try {
      setLoading(true);
      const response = await bookingService.getResources(queryParams);
      setResources(response.data?.data || []);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to load resources');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadResources();
  }, [queryParams]); // trigger automatically on filter change to match typical modern UI

  const handleFilterChange = (field, value) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
  };

  const handleBookResource = async (e) => {
    e.preventDefault();
    if (!selectedResource) return;

    try {
      setSubmitting(true);
      const payload = {
        resourceId: selectedResource.id,
        bookingDate: bookingForm.bookingDate,
        startTime: bookingForm.startTime,
        endTime: bookingForm.endTime,
        purpose: bookingForm.purpose,
      };
      if (bookingForm.expectedAttendees) {
        payload.expectedAttendees = Number(bookingForm.expectedAttendees);
      }

      await bookingService.createBooking(payload);
      toast.success('Booking request submitted for approval');
      setSelectedResource(null);
      setBookingForm(emptyBookingForm);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to submit booking request');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-[#6B65FB] rounded-2xl p-6 sm:p-8 flex items-center gap-6 shadow-sm">
        <div className="hidden sm:flex bg-white/20 p-4 rounded-2xl shadow-inner">
          <Landmark className="w-10 h-10 text-white" />
        </div>
        <div className="text-white">
          <h1 className="text-3xl font-bold tracking-tight">Browse Resources</h1>
          <p className="text-indigo-100 font-medium mt-1">Discover and book campus facilities, labs, and equipment</p>
        </div>
      </div>

      {/* Filters Section */}
      <div className="bg-white rounded-3xl border border-slate-200 p-5 sm:p-6 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="space-y-1.5 flex flex-col">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Search Resources</label>
            <input
              type="text"
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              placeholder="Enter resource name..."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-700 outline-none focus:ring-2 focus:ring-[#6B65FB]/20 focus:border-[#6B65FB] transition-all"
            />
          </div>

          <div className="space-y-1.5 flex flex-col">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Resource Type</label>
            <select
              value={filters.type}
              onChange={(e) => handleFilterChange('type', e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-700 outline-none focus:ring-2 focus:ring-[#6B65FB]/20 focus:border-[#6B65FB] transition-all appearance-none"
            >
              {resourceTypes.map((type) => (
                <option key={type || 'all'} value={type}>
                  {type ? formatType(type) : 'All Types'}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5 flex flex-col">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Status</label>
            <select
              value={filters.status}
              onChange={(e) => handleFilterChange('status', e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-700 outline-none focus:ring-2 focus:ring-[#6B65FB]/20 focus:border-[#6B65FB] transition-all appearance-none"
            >
              {resourceStatuses.map((status) => (
                <option key={status || 'all'} value={status}>
                  {status ? status.replace('_', ' ') : 'All Status'}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5 flex flex-col">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Min Capacity</label>
            <input
              type="number"
              min="0"
              value={filters.minCapacity}
              onChange={(e) => handleFilterChange('minCapacity', e.target.value)}
              placeholder="0"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-700 outline-none focus:ring-2 focus:ring-[#6B65FB]/20 focus:border-[#6B65FB] transition-all"
            />
          </div>
        </div>
      </div>

      {loading ? (
        <div className="bg-white rounded-3xl border border-slate-200 p-10 text-center text-slate-500 text-sm">
          Loading resources...
        </div>
      ) : resources.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200 p-10 text-center text-slate-500 text-sm">
          No resources matched your filters.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {resources.map((resource, i) => (
            <div 
              key={resource.id} 
              className={`bg-white rounded-[24px] p-6 shadow-sm border transition-all hover:shadow-md group ${
                i === 0 ? 'border-[#6B65FB]/50' : 'border-slate-100 hover:border-[#6B65FB]/30'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="w-12 h-12 rounded-xl bg-[#6B65FB]/10 flex items-center justify-center">
                  {getResourceIcon(resource.type)}
                </div>
                <div className="px-3 py-1 rounded-full border border-rose-200 bg-white text-[10px] font-bold text-rose-500 tracking-wider">
                  {resource.status}
                </div>
              </div>

              <div className="mt-5">
                <h3 className={`text-xl font-bold transition-colors ${i === 0 ? 'text-[#6B65FB]' : 'text-slate-800 group-hover:text-[#6B65FB]'}`}>
                  {resource.name}
                </h3>
                <p className="text-sm text-slate-500 mt-2 line-clamp-2 h-10">
                  {resource.description || 'No description available for this resource.'}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 border-t border-slate-100 mt-5 pt-5">
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Capacity</p>
                  <p className={`text-lg font-bold mt-0.5 ${i === 0 ? 'text-[#6B65FB]' : 'text-slate-800'}`}>
                    {resource.capacity}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Location</p>
                  <p className="text-sm font-semibold text-slate-700 mt-0.5 line-clamp-2">
                    {resource.location}
                  </p>
                </div>
              </div>

              <div className="bg-slate-50 rounded-xl p-3 border border-slate-100 mt-5">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Available</p>
                <p className="text-sm font-bold text-slate-700">
                  {resource.availabilityStart} – {resource.availabilityEnd}
                </p>
              </div>

              <button
                onClick={() => setSelectedResource(resource)}
                disabled={resource.status !== 'ACTIVE'}
                className={`mt-4 w-full py-3 rounded-xl text-sm font-semibold transition-all ${
                  resource.status !== 'ACTIVE'
                    ? 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200'
                    : 'bg-[#6B65FB]/5 text-[#6B65FB] hover:bg-[#6B65FB] hover:text-white border border-[#6B65FB]/20'
                }`}
              >
                {resource.status !== 'ACTIVE' ? 'Out of Service' : 'Schedule Booking'}
              </button>
            </div>
          ))}
        </div>
      )}

      {selectedResource && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-[24px] border border-slate-200 w-full max-w-xl p-8 shadow-2xl">
            <div className="flex items-center justify-between gap-4 mb-6">
              <div>
                <h2 className="text-2xl font-bold text-slate-900">Request Booking</h2>
                <p className="text-sm font-medium text-slate-500 mt-1">{selectedResource.name} • {selectedResource.location}</p>
              </div>
              <button
                onClick={() => {
                  setSelectedResource(null);
                  setBookingForm(emptyBookingForm);
                }}
                className="text-slate-400 hover:text-slate-700 bg-slate-50 hover:bg-slate-100 rounded-full p-2 transition-all"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleBookResource} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider pl-1">Booking Date</label>
                  <input
                    type="date"
                    value={bookingForm.bookingDate}
                    onChange={(e) => setBookingForm((prev) => ({ ...prev, bookingDate: e.target.value }))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium text-slate-800 outline-none focus:ring-2 focus:ring-[#6B65FB]/20 focus:border-[#6B65FB] transition-all"
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider pl-1">Attendees (Max {selectedResource.capacity})</label>
                  <input
                    type="number"
                    min="1"
                    max={selectedResource.capacity}
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
                  onClick={() => {
                    setSelectedResource(null);
                    setBookingForm(emptyBookingForm);
                  }}
                  className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-sm font-bold hover:bg-slate-50 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2.5 rounded-xl bg-[#6B65FB] text-white text-sm font-bold hover:bg-[#5a54da] disabled:bg-slate-300 transition-all shadow-sm shadow-[#6B65FB]/20"
                >
                  {submitting ? 'Submitting...' : 'Submit Request'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResourcesPage;