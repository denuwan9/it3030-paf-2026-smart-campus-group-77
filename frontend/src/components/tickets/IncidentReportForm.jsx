import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { AlertCircle, CheckCircle2, Loader2, MapPin, Phone, Send } from 'lucide-react';
import MultiImageUploader from './MultiImageUploader';
import ticketService from '../../services/ticketService';
import toast from 'react-hot-toast';

const reportSchema = z.object({
  category: z.string().min(1, "Category is required"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  priority: z.enum(["LOW", "MEDIUM", "HIGH", "URGENT"]),
  location: z.string().min(5, "Location must be at least 5 characters"),
  contactDetails: z.string().optional(),
});

const IncidentReportForm = ({ onSuccess }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [attachmentUrls, setAttachmentUrls] = useState([]);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(reportSchema),
    defaultValues: {
      priority: 'MEDIUM',
    }
  });

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      const payload = {
        ...data,
        attachmentUrls
      };
      await ticketService.createTicket(payload);
      toast.success('Incident reported successfully!');
      reset();
      setAttachmentUrls([]);
      if (onSuccess) onSuccess();
    } catch (err) {
      console.error('Submission error:', err);
      toast.error('Failed to report incident. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Category */}
        <div className="space-y-2">
          <label className="text-xs font-black text-nexer-text-header uppercase tracking-widest pl-1">Category</label>
          <select 
            {...register('category')}
            className={`w-full px-5 py-3 rounded-2xl bg-slate-50 border border-slate-200 focus:bg-white focus:ring-4 focus:ring-nexer-brand-primary/10 focus:border-nexer-brand-primary transition-all text-sm font-bold ${errors.category ? 'border-red-500' : ''}`}
          >
            <option value="">Select Category</option>
            <option value="IT Support">IT Support</option>
            <option value="Electrical">Electrical</option>
            <option value="Plumbing">Plumbing</option>
            <option value="HVAC">HVAC / Cooling</option>
            <option value="Security">Security / Access</option>
            <option value="General Maintenance">General Maintenance</option>
          </select>
          {errors.category && <p className="text-[10px] text-red-500 font-bold flex items-center gap-1 pl-1"><AlertCircle className="w-3 h-3" /> {errors.category.message}</p>}
        </div>

        {/* Priority */}
        <div className="space-y-2">
          <label className="text-xs font-black text-nexer-text-header uppercase tracking-widest pl-1">Priority</label>
          <select 
            {...register('priority')}
            className="w-full px-5 py-3 rounded-2xl bg-slate-50 border border-slate-200 focus:bg-white focus:ring-4 focus:ring-nexer-brand-primary/10 focus:border-nexer-brand-primary transition-all text-sm font-bold"
          >
            <option value="LOW">Low</option>
            <option value="MEDIUM">Medium</option>
            <option value="HIGH">High</option>
            <option value="URGENT">Urgent / Emergency</option>
          </select>
        </div>
      </div>

      {/* Location */}
      <div className="space-y-2">
        <label className="text-xs font-black text-nexer-text-header uppercase tracking-widest pl-1">Exact Location</label>
        <div className="relative">
          <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input 
            {...register('location')}
            placeholder="e.g., Level 3, Lab Room 302"
            className={`w-full pl-11 pr-5 py-3 rounded-2xl bg-slate-50 border border-slate-200 focus:bg-white focus:ring-4 focus:ring-nexer-brand-primary/10 focus:border-nexer-brand-primary transition-all text-sm font-bold ${errors.location ? 'border-red-500' : ''}`}
          />
        </div>
        {errors.location && <p className="text-[10px] text-red-500 font-bold flex items-center gap-1 pl-1"><AlertCircle className="w-3 h-3" /> {errors.location.message}</p>}
      </div>

      {/* Description */}
      <div className="space-y-2">
        <label className="text-xs font-black text-nexer-text-header uppercase tracking-widest pl-1">Describe the Issue</label>
        <textarea 
          {...register('description')}
          rows={4}
          placeholder="Please provide details about what happened..."
          className={`w-full px-5 py-3 rounded-2xl bg-slate-50 border border-slate-200 focus:bg-white focus:ring-4 focus:ring-nexer-brand-primary/10 focus:border-nexer-brand-primary transition-all text-sm font-bold ${errors.description ? 'border-red-500' : ''}`}
        />
        {errors.description && <p className="text-[10px] text-red-500 font-bold flex items-center gap-1 pl-1"><AlertCircle className="w-3 h-3" /> {errors.description.message}</p>}
      </div>

      {/* Image Upload */}
      <div className="space-y-2">
        <label className="text-xs font-black text-nexer-text-header uppercase tracking-widest pl-1">Photos (Optional)</label>
        <MultiImageUploader onImagesChange={setAttachmentUrls} />
      </div>

      {/* Contact Details */}
      <div className="space-y-2">
        <label className="text-xs font-black text-nexer-text-header uppercase tracking-widest pl-1">Contact for follow-up</label>
        <div className="relative">
          <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input 
            {...register('contactDetails')}
            placeholder="Phone number or extension (optional)"
            className="w-full pl-11 pr-5 py-3 rounded-2xl bg-slate-50 border border-slate-200 focus:bg-white focus:ring-4 focus:ring-nexer-brand-primary/10 focus:border-nexer-brand-primary transition-all text-sm font-bold"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full py-4 bg-nexer-brand-primary text-white rounded-2xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-2 hover:bg-opacity-90 shadow-nexer-lg shadow-nexer-brand-primary/20 transition-all active:scale-[0.98] disabled:opacity-50"
      >
        {isSubmitting ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <>
            <Send className="w-4 h-4" />
            Submit Incident Report
          </>
        )}
      </button>
    </form>
  );
};

export default IncidentReportForm;
