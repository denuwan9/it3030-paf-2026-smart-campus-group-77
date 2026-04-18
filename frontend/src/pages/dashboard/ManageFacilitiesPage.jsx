import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Building2, Plus, Pencil, Trash2, Package, Search, X, Loader2, ChevronDown, MapPin, Users, ArrowLeft } from 'lucide-react';
import facilityService from '../../services/facilityService';
import resourceService from '../../services/resourceService';
import toast from 'react-hot-toast';

const statusOpts = ['AVAILABLE', 'MAINTENANCE', 'CLOSED'];
const resTypeOpts = ['EQUIPMENT', 'FURNITURE', 'CONSUMABLE', 'OTHER'];
const resStatusOpts = ['AVAILABLE', 'IN_USE', 'MAINTENANCE', 'BROKEN'];

const emptyFacility = { name: '', description: '', location: '', capacity: '', status: 'AVAILABLE', imageUrl: '' };
const emptyResource = { name: '', description: '', type: 'EQUIPMENT', quantity: 1, status: 'AVAILABLE' };

const InputField = ({ label, ...props }) => (
  <div className="space-y-1.5">
    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{label}</label>
    <input {...props} className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-medium outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 transition-all" />
  </div>
);

const SelectField = ({ label, options, ...props }) => (
  <div className="space-y-1.5">
    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{label}</label>
    <select {...props} className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-bold outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 transition-all appearance-none cursor-pointer">
      {options.map(o => <option key={o} value={o}>{o}</option>)}
    </select>
  </div>
);

const ManageFacilitiesPage = () => {
  const [facilities, setFacilities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  // Facility modal
  const [showFacilityModal, setShowFacilityModal] = useState(false);
  const [editingFacility, setEditingFacility] = useState(null);
  const [facilityForm, setFacilityForm] = useState(emptyFacility);
  const [saving, setSaving] = useState(false);

  // Resource panel
  const [selectedFacility, setSelectedFacility] = useState(null);
  const [resources, setResources] = useState([]);
  const [loadingRes, setLoadingRes] = useState(false);
  const [showResModal, setShowResModal] = useState(false);
  const [editingRes, setEditingRes] = useState(null);
  const [resForm, setResForm] = useState(emptyResource);
  const [savingRes, setSavingRes] = useState(false);

  useEffect(() => { fetchFacilities(); }, []);

  const fetchFacilities = async () => {
    try { setLoading(true); const r = await facilityService.getAllFacilities(); setFacilities(r.data || []); }
    catch { toast.error('Failed to load facilities'); }
    finally { setLoading(false); }
  };

  const fetchResources = async (fid) => {
    try { setLoadingRes(true); const r = await resourceService.getResourcesByFacilityId(fid); setResources(r.data || []); }
    catch { toast.error('Failed to load resources'); }
    finally { setLoadingRes(false); }
  };

  // ── Facility CRUD ──
  const openAddFacility = () => { setEditingFacility(null); setFacilityForm(emptyFacility); setShowFacilityModal(true); };
  const openEditFacility = (f) => { setEditingFacility(f); setFacilityForm({ name: f.name || '', description: f.description || '', location: f.location || '', capacity: f.capacity || '', status: f.status || 'AVAILABLE', imageUrl: f.imageUrl || '' }); setShowFacilityModal(true); };

  const saveFacility = async () => {
    if (!facilityForm.name.trim()) { toast.error('Facility name is required'); return; }
    setSaving(true);
    try {
      const payload = { ...facilityForm, capacity: facilityForm.capacity ? parseInt(facilityForm.capacity) : null };
      if (editingFacility) { await facilityService.updateFacility(editingFacility.id, payload); toast.success('Facility updated'); }
      else { await facilityService.createFacility(payload); toast.success('Facility created'); }
      setShowFacilityModal(false); fetchFacilities();
    } catch { toast.error('Failed to save facility'); }
    finally { setSaving(false); }
  };

  const deleteFacility = async (id) => {
    if (!confirm('Delete this facility and all its resources?')) return;
    try {
      await facilityService.deleteFacility(id);
      toast.success('Facility deleted');
      fetchFacilities();
      if (selectedFacility?.id === id) setSelectedFacility(null);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete facility');
    }
  };

  // ── Resource CRUD ──
  const openManageResources = (f) => { setSelectedFacility(f); fetchResources(f.id); };
  const openAddRes = () => { setEditingRes(null); setResForm(emptyResource); setShowResModal(true); };
  const openEditRes = (r) => { setEditingRes(r); setResForm({ name: r.name || '', description: r.description || '', type: r.type || 'EQUIPMENT', quantity: r.quantity || 1, status: r.status || 'AVAILABLE' }); setShowResModal(true); };

  const saveResource = async () => {
    if (!resForm.name.trim()) { toast.error('Resource name is required'); return; }
    setSavingRes(true);
    try {
      const payload = { ...resForm, quantity: parseInt(resForm.quantity) || 1 };
      if (editingRes) { await resourceService.updateResource(editingRes.id, payload); toast.success('Resource updated'); }
      else { await resourceService.createResource(selectedFacility.id, payload); toast.success('Resource added'); }
      setShowResModal(false); fetchResources(selectedFacility.id);
    } catch { toast.error('Failed to save resource'); }
    finally { setSavingRes(false); }
  };

  const deleteResource = async (id) => {
    if (!confirm('Delete this resource?')) return;
    try {
      await resourceService.deleteResource(id);
      toast.success('Resource deleted');
      fetchResources(selectedFacility.id);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete resource');
    }
  };

  const filtered = facilities.filter(f => f.name?.toLowerCase().includes(search.toLowerCase()) || f.location?.toLowerCase().includes(search.toLowerCase()));

  const statusColor = (s) => {
    if (s === 'AVAILABLE') return 'text-emerald-600 bg-emerald-50 border-emerald-100';
    if (s === 'MAINTENANCE') return 'text-amber-600 bg-amber-50 border-amber-100';
    if (s === 'CLOSED') return 'text-rose-600 bg-rose-50 border-rose-100';
    if (s === 'IN_USE') return 'text-blue-600 bg-blue-50 border-blue-100';
    if (s === 'BROKEN') return 'text-rose-600 bg-rose-50 border-rose-100';
    return 'text-slate-500 bg-slate-50 border-slate-100';
  };

  // ── Resource Management View ──
  if (selectedFacility) {
    return (
      <div className="space-y-6 pb-20">
        <div className="flex items-center gap-4">
          <button onClick={() => setSelectedFacility(null)} className="p-2 hover:bg-slate-100 rounded-xl transition-colors text-slate-400"><ArrowLeft className="w-5 h-5" /></button>
          <div>
            <h1 className="text-2xl font-black text-nexer-text-header tracking-tight">{selectedFacility.name}</h1>
            <p className="text-sm text-slate-400 font-medium">Manage resources for this facility</p>
          </div>
          <button onClick={openAddRes} className="ml-auto px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl transition-all active:scale-95 flex items-center gap-2 shadow-lg shadow-blue-600/20">
            <Plus className="w-4 h-4" /> Add Resource
          </button>
        </div>

        {loadingRes && <div className="flex justify-center py-16"><Loader2 className="w-7 h-7 text-blue-600 animate-spin" /></div>}

        {!loadingRes && resources.length === 0 && (
          <div className="text-center py-16 bg-white rounded-2xl border border-slate-100">
            <Package className="w-10 h-10 text-slate-300 mx-auto mb-3" />
            <p className="font-bold text-slate-500">No resources yet</p>
            <p className="text-sm text-slate-400 mt-1">Add equipment, furniture, or supplies to this facility.</p>
          </div>
        )}

        {!loadingRes && resources.length > 0 && (
          <div className="bg-white border border-slate-100 rounded-2xl overflow-hidden shadow-nexer-sm">
            <table className="w-full">
              <thead><tr className="border-b border-slate-50 bg-slate-50/50">
                <th className="text-left px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Name</th>
                <th className="text-left px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Type</th>
                <th className="text-left px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Qty</th>
                <th className="text-left px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                <th className="text-right px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Actions</th>
              </tr></thead>
              <tbody className="divide-y divide-slate-50">
                {resources.map(r => (
                  <tr key={r.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4"><p className="font-bold text-sm text-slate-800">{r.name}</p>{r.description && <p className="text-xs text-slate-400 mt-0.5 line-clamp-1">{r.description}</p>}</td>
                    <td className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">{r.type}</td>
                    <td className="px-6 py-4 text-sm font-bold text-slate-700">{r.quantity}</td>
                    <td className="px-6 py-4"><span className={`inline-flex px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${statusColor(r.status)}`}>{r.status}</span></td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => openEditRes(r)} className="p-2 hover:bg-blue-50 rounded-lg text-slate-400 hover:text-blue-600 transition-all"><Pencil className="w-4 h-4" /></button>
                        <button onClick={() => deleteResource(r.id)} className="p-2 hover:bg-rose-50 rounded-lg text-slate-400 hover:text-rose-600 transition-all"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Resource Modal */}
        <AnimatePresence>{showResModal && (
          <><motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} onClick={()=>setShowResModal(false)} className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-50"/>
          <motion.div initial={{opacity:0,scale:0.95}} animate={{opacity:1,scale:1}} exit={{opacity:0,scale:0.95}} className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-7 space-y-5" onClick={e=>e.stopPropagation()}>
              <div className="flex items-center justify-between"><h2 className="text-lg font-black text-slate-900">{editingRes ? 'Edit' : 'Add'} Resource</h2><button onClick={()=>setShowResModal(false)} className="p-2 hover:bg-slate-100 rounded-xl"><X className="w-5 h-5 text-slate-400"/></button></div>
              <InputField label="Name" placeholder="e.g. Projector" value={resForm.name} onChange={e=>setResForm({...resForm,name:e.target.value})}/>
              <InputField label="Description" placeholder="Optional description" value={resForm.description} onChange={e=>setResForm({...resForm,description:e.target.value})}/>
              <div className="grid grid-cols-2 gap-4">
                <SelectField label="Type" options={resTypeOpts} value={resForm.type} onChange={e=>setResForm({...resForm,type:e.target.value})}/>
                <InputField label="Quantity" type="number" min="1" value={resForm.quantity} onChange={e=>setResForm({...resForm,quantity:e.target.value})}/>
              </div>
              <SelectField label="Status" options={resStatusOpts} value={resForm.status} onChange={e=>setResForm({...resForm,status:e.target.value})}/>
              <div className="flex gap-3 pt-2">
                <button onClick={()=>setShowResModal(false)} className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-sm rounded-xl transition-all">Cancel</button>
                <button onClick={saveResource} disabled={savingRes} className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl transition-all disabled:opacity-50 flex items-center justify-center gap-2">
                  {savingRes && <Loader2 className="w-4 h-4 animate-spin"/>}{editingRes ? 'Update' : 'Add'}
                </button>
              </div>
            </div>
          </motion.div></>
        )}</AnimatePresence>
      </div>
    );
  }

  // ── Main Facilities List View ──
  return (
    <div className="space-y-8 pb-20">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-600/20">
            <Building2 className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-nexer-text-header tracking-tight">Manage Facilities</h1>
            <p className="text-sm text-slate-400 font-medium">Create, edit, and manage campus facilities & resources</p>
          </div>
        </div>
        <button onClick={openAddFacility} className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl transition-all active:scale-95 flex items-center gap-2 shadow-lg shadow-blue-600/20 self-start">
          <Plus className="w-4 h-4" /> New Facility
        </button>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input type="text" placeholder="Search facilities..." value={search} onChange={e=>setSearch(e.target.value)} className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-100 rounded-xl text-sm font-medium outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 transition-all shadow-nexer-sm"/>
      </div>

      {loading && <div className="flex justify-center py-16"><Loader2 className="w-7 h-7 text-blue-600 animate-spin"/></div>}

      {!loading && filtered.length === 0 && (
        <div className="text-center py-16"><Building2 className="w-10 h-10 text-slate-300 mx-auto mb-3"/><p className="font-bold text-slate-500">No facilities found</p></div>
      )}

      {!loading && filtered.length > 0 && (
        <div className="bg-white border border-slate-100 rounded-2xl overflow-hidden shadow-nexer-sm">
          <table className="w-full">
            <thead><tr className="border-b border-slate-50 bg-slate-50/50">
              <th className="text-left px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Facility</th>
              <th className="text-left px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Location</th>
              <th className="text-left px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Capacity</th>
              <th className="text-left px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
              <th className="text-right px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Actions</th>
            </tr></thead>
            <tbody className="divide-y divide-slate-50">
              {filtered.map(f => (
                <tr key={f.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-6 py-4"><p className="font-bold text-sm text-slate-800">{f.name}</p>{f.description && <p className="text-xs text-slate-400 mt-0.5 line-clamp-1 max-w-xs">{f.description}</p>}</td>
                  <td className="px-6 py-4 text-sm text-slate-500">{f.location || '—'}</td>
                  <td className="px-6 py-4 text-sm font-bold text-slate-700">{f.capacity || '—'}</td>
                  <td className="px-6 py-4"><span className={`inline-flex px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${statusColor(f.status)}`}>{f.status}</span></td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button onClick={()=>openManageResources(f)} className="p-2 hover:bg-blue-50 rounded-lg text-slate-400 hover:text-blue-600 transition-all" title="Manage Resources"><Package className="w-4 h-4"/></button>
                      <button onClick={()=>openEditFacility(f)} className="p-2 hover:bg-blue-50 rounded-lg text-slate-400 hover:text-blue-600 transition-all" title="Edit"><Pencil className="w-4 h-4"/></button>
                      <button onClick={()=>deleteFacility(f.id)} className="p-2 hover:bg-rose-50 rounded-lg text-slate-400 hover:text-rose-600 transition-all" title="Delete"><Trash2 className="w-4 h-4"/></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Facility Modal */}
      <AnimatePresence>{showFacilityModal && (
        <><motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} onClick={()=>setShowFacilityModal(false)} className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-50"/>
        <motion.div initial={{opacity:0,scale:0.95}} animate={{opacity:1,scale:1}} exit={{opacity:0,scale:0.95}} className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-7 space-y-5" onClick={e=>e.stopPropagation()}>
            <div className="flex items-center justify-between"><h2 className="text-lg font-black text-slate-900">{editingFacility ? 'Edit' : 'New'} Facility</h2><button onClick={()=>setShowFacilityModal(false)} className="p-2 hover:bg-slate-100 rounded-xl"><X className="w-5 h-5 text-slate-400"/></button></div>
            <InputField label="Name *" placeholder="e.g. Main Auditorium" value={facilityForm.name} onChange={e=>setFacilityForm({...facilityForm,name:e.target.value})}/>
            <InputField label="Description" placeholder="Brief description" value={facilityForm.description} onChange={e=>setFacilityForm({...facilityForm,description:e.target.value})}/>
            <div className="grid grid-cols-2 gap-4">
              <InputField label="Location" placeholder="e.g. Block A" value={facilityForm.location} onChange={e=>setFacilityForm({...facilityForm,location:e.target.value})}/>
              <InputField label="Capacity" type="number" placeholder="e.g. 100" value={facilityForm.capacity} onChange={e=>setFacilityForm({...facilityForm,capacity:e.target.value})}/>
            </div>
            <SelectField label="Status" options={statusOpts} value={facilityForm.status} onChange={e=>setFacilityForm({...facilityForm,status:e.target.value})}/>
            <InputField label="Image URL" placeholder="https://..." value={facilityForm.imageUrl} onChange={e=>setFacilityForm({...facilityForm,imageUrl:e.target.value})}/>
            <div className="flex gap-3 pt-2">
              <button onClick={()=>setShowFacilityModal(false)} className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-sm rounded-xl transition-all">Cancel</button>
              <button onClick={saveFacility} disabled={saving} className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl transition-all disabled:opacity-50 flex items-center justify-center gap-2">
                {saving && <Loader2 className="w-4 h-4 animate-spin"/>}{editingFacility ? 'Update' : 'Create'}
              </button>
            </div>
          </div>
        </motion.div></>
      )}</AnimatePresence>
    </div>
  );
};

export default ManageFacilitiesPage;
