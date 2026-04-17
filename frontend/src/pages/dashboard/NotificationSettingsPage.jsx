import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import {
  Bell,
  Calendar,
  Ticket,
  Megaphone,
  Shield,
  Loader2,
  Save,
  Volume2,
} from 'lucide-react';
import notificationService from '../../services/notificationService';
import toast from 'react-hot-toast';
import { useNotifications } from '../../context/NotificationContext';

import { playNotificationSound } from '../../assets/sounds';

// ─── Toggle Row ───────────────────────────────────────────────────────────────

const ToggleRow = ({ icon: Icon, iconColor, iconBg, label, description, checked, onChange, disabled, extra }) => (
  <div className={`flex items-center justify-between p-4 rounded-2xl border transition-all ${
    checked ? 'border-nexer-brand-primary/20 bg-nexer-brand-primary/[0.02]' : 'border-slate-100 bg-white'
  } ${disabled ? 'opacity-40' : ''}`}>
    <div className="flex items-center gap-4">
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${iconBg}`}>
        <Icon className={`w-4.5 h-4.5 ${iconColor}`} />
      </div>
      <div>
        <p className="text-sm font-bold text-nexer-text-header">{label}</p>
        <p className="text-xs text-slate-400 mt-0.5">{description}</p>
      </div>
    </div>

    {/* Toggle switch */}
    <div className="flex items-center gap-3">
      {extra}
      <button
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={() => !disabled && onChange(!checked)}
        className={`relative w-11 h-6 rounded-full transition-colors duration-200 flex-shrink-0 focus:outline-none focus:ring-2 focus:ring-nexer-brand-primary/30 ${
          checked ? 'bg-nexer-brand-primary' : 'bg-slate-200'
        }`}
      >
        <motion.span
          layout
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
          className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm ${
            checked ? 'left-6' : 'left-1'
          }`}
        />
      </button>
    </div>
  </div>
);

// ─── Main Page ────────────────────────────────────────────────────────────────

const NotificationSettingsPage = () => {

  const { refreshSettings } = useNotifications();
  const [settings, setSettings] = useState(null);
  const [loading, setLoading]   = useState(true);
  const [saving, setSaving]     = useState(false);

  const fetchSettings = useCallback(async () => {
    try {
      const res = await notificationService.getSettings();
      if (res.success) {
        setSettings(res.data);
      } else {
        // Use defaults so the page still renders; user can still toggle and save
        setSettings({ bookingAlerts: true, ticketAlerts: true, systemAlerts: true, announcementAlerts: true, soundEnabled: true });
        toast.error(res.message || 'Could not load notification settings');
      }
    } catch (error) {
      // Show the real backend error if available
      const msg = error?.response?.data?.message || error?.message || 'Could not load notification settings';
      toast.error(msg);
      // Use defaults so the page still renders
      setSettings({ bookingAlerts: true, ticketAlerts: true, systemAlerts: true, announcementAlerts: true, soundEnabled: true });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  const handleToggle = (field) => (value) => {
    setSettings(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    if (!settings) return;
    setSaving(true);
    try {
      const res = await notificationService.updateSettings(settings);
      if (res.success) {
        setSettings(res.data);
        refreshSettings();
        toast.success('Notification preferences saved!');
      } else {
        toast.error(res.message || 'Failed to save settings');
      }
    } catch (error) {
      // Show the actual backend error message for easier debugging
      const msg = error?.response?.data?.message || error?.message || 'Failed to save settings';
      toast.error(msg);
    } finally {
      setSaving(false);
    }
  };

  const playTestSound = () => {
    try {
      playNotificationSound(0.5);
      toast.success("Sound triggered successfully!");
    } catch (err) {
      console.error("Audio playback error:", err);
      toast.error("Failed to play sound.");
    }
  };

  const TOGGLES = [
    {
      field: 'bookingAlerts',
      icon: Calendar,
      iconColor: 'text-blue-500',
      iconBg: 'bg-blue-50',
      label: 'Booking Alerts',
      description: 'Get notified when a resource booking is confirmed, cancelled, or updated',
    },
    {
      field: 'ticketAlerts',
      icon: Ticket,
      iconColor: 'text-amber-500',
      iconBg: 'bg-amber-50',
      label: 'Incident Tickets',
      description: 'Receive updates when tickets are assigned, progressed, or resolved',
    },
    {
      field: 'systemAlerts',
      icon: Shield,
      iconColor: 'text-nexer-brand-primary',
      iconBg: 'bg-nexer-brand-primary/10',
      label: 'System Alerts',
      description: 'Platform updates, maintenance windows, and operational notices',
    },
    {
      field: 'securityAlerts',
      icon: Shield,
      iconColor: 'text-red-500',
      iconBg: 'bg-red-50',
      label: 'Security Alerts',
      description: 'Important account security notices, login alerts, and password changes',
    },
    {
      field: 'announcementAlerts',
      icon: Megaphone,
      iconColor: 'text-purple-500',
      iconBg: 'bg-purple-50',
      label: 'Announcements',
      description: 'Campus-wide announcements from administrators',
    },
    {
      field: 'soundEnabled',
      icon: Volume2,
      iconColor: 'text-indigo-500',
      iconBg: 'bg-indigo-50',
      label: 'Notification Sound',
      description: 'Play a sound alert when a new notification arrives',
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32 text-slate-400">
        <Loader2 className="w-6 h-6 animate-spin mr-3" />
        <span className="font-medium">Loading preferences…</span>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-8">

      {/* Page header */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex items-center gap-4 mb-2">
          <div className="w-12 h-12 bg-nexer-brand-primary/10 rounded-2xl flex items-center justify-center">
            <Bell className="w-5 h-5 text-nexer-brand-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-nexer-text-header">Notification Settings</h1>
            <p className="text-sm text-slate-400 mt-0.5">Manage how and when you are notified</p>
          </div>
        </div>
      </motion.div>


      {/* Alert categories section */}
      <motion.section
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
        className="space-y-3"
      >
        <h2 className="text-xs font-black text-slate-400 uppercase tracking-[0.18em] px-1">
          Alert Categories
        </h2>
        <div className="space-y-2">
          {TOGGLES.map(({ field, ...rest }) => (
            <ToggleRow
              key={field}
              {...rest}
              checked={settings?.[field] ?? true}
              onChange={handleToggle(field)}
              extra={field === 'soundEnabled' && (
                <button
                  title="Test Sound"
                  onClick={(e) => { e.stopPropagation(); playTestSound(); }}
                  className="p-1.5 rounded-lg bg-slate-50 text-slate-400 hover:text-indigo-500 hover:bg-indigo-50 transition-all active:scale-90"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                </button>
              )}
            />
          ))}
        </div>
      </motion.section>

      {/* Save button */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="flex justify-end pt-2"
      >
        <button
          id="save-notification-settings-btn"
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 bg-nexer-brand-primary text-white font-bold px-6 py-3 rounded-2xl shadow-nexer-sm hover:shadow-nexer-md transition-all active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {saving ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Save className="w-4 h-4" />
          )}
          {saving ? 'Saving…' : 'Save Preferences'}
        </button>
      </motion.div>

    </div>
  );
};

export default NotificationSettingsPage;
