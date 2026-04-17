import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Building2,
  Search,
  Filter,
  MapPin,
  Users,
  Package,
  ChevronDown,
  X,
  Loader2,
  Wifi,
  WifiOff,
  ArrowRight,
  Eye,
  LayoutGrid,
  List,
  Sparkles,
} from 'lucide-react';
import facilityService from '../../services/facilityService';
import resourceService from '../../services/resourceService';
import toast from 'react-hot-toast';

const statusColors = {
  AVAILABLE: { bg: 'bg-emerald-50', text: 'text-emerald-600', border: 'border-emerald-100', dot: 'bg-emerald-500' },
  MAINTENANCE: { bg: 'bg-amber-50', text: 'text-amber-600', border: 'border-amber-100', dot: 'bg-amber-500' },
  CLOSED: { bg: 'bg-rose-50', text: 'text-rose-600', border: 'border-rose-100', dot: 'bg-rose-500' },
};

const resourceStatusColors = {
  AVAILABLE: 'text-emerald-600 bg-emerald-50 border-emerald-100',
  IN_USE: 'text-blue-600 bg-blue-50 border-blue-100',
  MAINTENANCE: 'text-amber-600 bg-amber-50 border-amber-100',
  BROKEN: 'text-rose-600 bg-rose-50 border-rose-100',
};

const FacilitiesPage = () => {
  const [facilities, setFacilities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [selectedFacility, setSelectedFacility] = useState(null);
  const [facilityResources, setFacilityResources] = useState([]);
  const [loadingResources, setLoadingResources] = useState(false);
  const [viewMode, setViewMode] = useState('grid');

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

  const openFacilityDetails = async (facility) => {
    setSelectedFacility(facility);
    setLoadingResources(true);
    try {
      const res = await resourceService.getResourcesByFacilityId(facility.id);
      setFacilityResources(res.data || []);
    } catch (err) {
      toast.error('Failed to load resources');
      setFacilityResources([]);
    } finally {
      setLoadingResources(false);
    }
  };

  const filtered = facilities.filter((f) => {
    const matchesSearch =
      f.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      f.location?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || f.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-8 pb-20">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-600/20">
              <Building2 className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-black text-nexer-text-header tracking-tight">
                Facilities Catalogue
              </h1>
              <p className="text-slate-500 text-sm font-medium mt-0.5">
                Browse all campus buildings, labs, and rooms
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search facilities by name or location..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-100 rounded-xl text-sm font-medium outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 transition-all shadow-nexer-sm"
          />
        </div>
        <div className="relative">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="appearance-none w-full sm:w-44 pl-4 pr-10 py-2.5 bg-white border border-slate-100 rounded-xl text-sm font-bold outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 transition-all shadow-nexer-sm cursor-pointer text-slate-700"
          >
            <option value="ALL">All Status</option>
            <option value="AVAILABLE">Available</option>
            <option value="MAINTENANCE">Maintenance</option>
            <option value="CLOSED">Closed</option>
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
        </div>
        <div className="flex items-center bg-slate-50 p-1 rounded-xl border border-slate-100 self-start">
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
            {searchTerm || statusFilter !== 'ALL'
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
              onClick={() => setSelectedFacility(null)}
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
                  onClick={() => setSelectedFacility(null)}
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

                {/* Resources List */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-black text-slate-700 uppercase tracking-widest">Resources ({facilityResources.length})</h3>
                    <Package className="w-4 h-4 text-slate-300" />
                  </div>

                  {loadingResources && (
                    <div className="flex items-center justify-center py-10">
                      <Loader2 className="w-6 h-6 text-blue-600 animate-spin" />
                    </div>
                  )}

                  {!loadingResources && facilityResources.length === 0 && (
                    <div className="text-center py-10 bg-slate-50 rounded-2xl border border-slate-100">
                      <Package className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                      <p className="text-sm font-bold text-slate-400">No resources listed</p>
                      <p className="text-xs text-slate-300 mt-0.5">This facility has no equipment or resources yet.</p>
                    </div>
                  )}

                  {!loadingResources && facilityResources.length > 0 && (
                    <div className="space-y-3">
                      {facilityResources.map((res) => (
                        <div
                          key={res.id}
                          className="bg-white border border-slate-100 rounded-xl p-4 flex items-center gap-4 hover:bg-slate-50 transition-all"
                        >
                          <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center flex-shrink-0">
                            <Package className="w-4 h-4 text-blue-500" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-bold text-sm text-slate-800 truncate">{res.name}</p>
                            <div className="flex items-center gap-3 mt-0.5">
                              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{res.type}</span>
                              <span className="text-[10px] text-slate-300">•</span>
                              <span className="text-[10px] font-bold text-slate-400">Qty: {res.quantity}</span>
                            </div>
                          </div>
                          <div className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${resourceStatusColors[res.status] || 'text-slate-500 bg-slate-50 border-slate-100'}`}>
                            {res.status}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FacilitiesPage;
