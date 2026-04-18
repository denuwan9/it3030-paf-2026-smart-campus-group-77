import React, { useState, useEffect, useRef, useCallback, forwardRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { createPortal } from 'react-dom';
import {
  Bell,
  X,
  Check,
  CheckCheck,
  Trash2,
  Settings,
  Calendar,
  Ticket,
  Megaphone,
  Shield,
  Wrench,
  Loader2,
} from 'lucide-react';
import notificationService from '../../services/notificationService';
import toast from 'react-hot-toast';
import { playNotificationSound } from '../../assets/sounds';
import { useNotifications } from '../../context/NotificationContext';

// ─── Helpers ──────────────────────────────────────────────────────────────────

const POLL_INTERVAL_MS = 30_000; // 30 seconds

const TYPE_CONFIG = {
  BOOKING: {
    icon: Calendar,
    color: 'text-blue-500',
    bg: 'bg-blue-50',
    label: 'Booking',
  },
  TICKET: {
    icon: Ticket,
    color: 'text-amber-500',
    bg: 'bg-amber-50',
    label: 'Ticket',
  },
  ANNOUNCEMENT: {
    icon: Megaphone,
    color: 'text-purple-500',
    bg: 'bg-purple-50',
    label: 'Announcement',
  },
  SYSTEM: {
    icon: Shield,
    color: 'text-indigo-600',
    bg: 'bg-indigo-50',
    label: 'System',
  },
  SECURITY: {
    icon: Shield,
    color: 'text-red-600',
    bg: 'bg-red-50',
    label: 'Security',
  },
};

function getNotificationVisualConfig(notification) {
  const baseConfig = TYPE_CONFIG[notification?.type] || TYPE_CONFIG.SYSTEM;
  const bookingText = `${notification?.title || ''} ${notification?.message || ''}`.toLowerCase();
  const isNegativeBooking = notification?.type === 'BOOKING'
    && (bookingText.includes('reject') || bookingText.includes('cancel'));

  return {
    config: isNegativeBooking
      ? { ...baseConfig, color: 'text-rose-600', bg: 'bg-rose-50' }
      : baseConfig,
    isNegativeBooking,
  };
}

function getNotificationAccentClass(notification, isNegativeBooking) {
  if (isNegativeBooking) return 'bg-rose-500';

  switch (notification?.type) {
    case 'BOOKING':
      return 'bg-blue-500';
    case 'TICKET':
      return 'bg-amber-500';
    case 'ANNOUNCEMENT':
      return 'bg-purple-500';
    case 'SECURITY':
      return 'bg-red-500';
    case 'SYSTEM':
    default:
      return 'bg-indigo-500';
  }
}

function splitTimeRange(timeRange) {
  if (!timeRange) return { startTime: '', endTime: '' };
  const [startTime = '', endTime = ''] = timeRange.split('-').map((part) => part.trim());
  return { startTime, endTime };
}

function extractBookingDetails(notification) {
  const title = (notification?.title || '').trim();
  const message = (notification?.message || '').replace(/\s+/g, ' ').trim();
  const details = [];

  const addField = (label, value) => {
    if (value && String(value).trim()) {
      details.push({ label, value: String(value).trim() });
    }
  };

  if (/approved/i.test(title) || /has been approved/i.test(message)) {
    addField('Status', 'Approved');
  } else if (/rejected/i.test(title) || /has been rejected/i.test(message)) {
    addField('Status', 'Rejected');
  } else if (/updated/i.test(title) || /updated a pending booking request/i.test(message)) {
    addField('Status', 'Updated Request');
  } else if (/new booking request/i.test(title) || /requested a booking/i.test(message)) {
    addField('Status', 'New Request');
  } else if (/cancel/i.test(title) || /cancel/i.test(message)) {
    addField('Status', 'Cancelled');
  }

  const requestedPattern = /^(.+?) requested a booking for (.+?) on (\d{4}-\d{2}-\d{2}) \(([^)]+)\)\.?(?:\s*Purpose:\s*(.+))?$/i;
  const updatedPattern = /^(.+?) updated a pending booking request for (.+?) on (\d{4}-\d{2}-\d{2}) \(([^)]+)\)\.?(?:\s*Purpose:\s*(.+))?$/i;
  const userCancelledPattern = /^(.+?) cancelled a booking for (.+?) on (\d{4}-\d{2}-\d{2}) \(([^)]+)\)\.?(?:\s*Reason:\s*(.+))?$/i;
  const approvedPattern = /^Your booking for (.+?) on (\d{4}-\d{2}-\d{2}) \(([^)]+)\) has been approved\.?$/i;
  const rejectedPattern = /^Your booking for (.+?) on (\d{4}-\d{2}-\d{2}) \(([^)]+)\) has been rejected\.?\s*(?:Reason:\s*(.+))?$/i;
  const adminCancelledPattern = /^Your booking for (.+?) on (\d{4}-\d{2}-\d{2}) \(([^)]+)\) was cancelled by admin (.+?)\.?\s*(?:Reason:\s*(.+))?$/i;

  let match = message.match(requestedPattern);
  if (match) {
    const [, requestedBy, facility, bookingDate, timeRange, purpose] = match;
    const { startTime, endTime } = splitTimeRange(timeRange);
    addField('Requested By', requestedBy);
    addField('Facility', facility);
    addField('Booking Date', bookingDate);
    addField('Start Time', startTime);
    addField('End Time', endTime);
    addField('Purpose', purpose);
    return details;
  }

  match = message.match(updatedPattern);
  if (match) {
    const [, requestedBy, facility, bookingDate, timeRange, purpose] = match;
    const { startTime, endTime } = splitTimeRange(timeRange);
    addField('Requested By', requestedBy);
    addField('Facility', facility);
    addField('Booking Date', bookingDate);
    addField('Start Time', startTime);
    addField('End Time', endTime);
    addField('Purpose', purpose);
    return details;
  }

  match = message.match(userCancelledPattern);
  if (match) {
    const [, cancelledBy, facility, bookingDate, timeRange, reason] = match;
    const { startTime, endTime } = splitTimeRange(timeRange);
    addField('Cancelled By', cancelledBy);
    addField('Facility', facility);
    addField('Booking Date', bookingDate);
    addField('Start Time', startTime);
    addField('End Time', endTime);
    addField('Reason', reason);
    return details;
  }

  match = message.match(approvedPattern);
  if (match) {
    const [, facility, bookingDate, timeRange] = match;
    const { startTime, endTime } = splitTimeRange(timeRange);
    addField('Facility', facility);
    addField('Booking Date', bookingDate);
    addField('Start Time', startTime);
    addField('End Time', endTime);
    return details;
  }

  match = message.match(rejectedPattern);
  if (match) {
    const [, facility, bookingDate, timeRange, reason] = match;
    const { startTime, endTime } = splitTimeRange(timeRange);
    addField('Facility', facility);
    addField('Booking Date', bookingDate);
    addField('Start Time', startTime);
    addField('End Time', endTime);
    addField('Reason', reason);
    return details;
  }

  match = message.match(adminCancelledPattern);
  if (match) {
    const [, facility, bookingDate, timeRange, adminName, reason] = match;
    const { startTime, endTime } = splitTimeRange(timeRange);
    addField('Cancelled By', adminName);
    addField('Facility', facility);
    addField('Booking Date', bookingDate);
    addField('Start Time', startTime);
    addField('End Time', endTime);
    addField('Reason', reason);
    return details;
  }

  const facilityMatch = message.match(/for (.+?) on (\d{4}-\d{2}-\d{2}) \(([^)]+)\)/i);
  if (facilityMatch) {
    const [, facility, bookingDate, timeRange] = facilityMatch;
    const { startTime, endTime } = splitTimeRange(timeRange);
    addField('Facility', facility);
    addField('Booking Date', bookingDate);
    addField('Start Time', startTime);
    addField('End Time', endTime);
  }

  const purposeMatch = message.match(/Purpose:\s*(.+)$/i);
  const reasonMatch = message.match(/Reason:\s*(.+)$/i);
  addField('Purpose', purposeMatch?.[1]);
  addField('Reason', reasonMatch?.[1]);

  return details;
}

function extractNotificationDetails(notification) {
  if (!notification) return [];

  if (notification.type === 'BOOKING') {
    const bookingDetails = extractBookingDetails(notification);
    if (bookingDetails.length > 0) {
      return bookingDetails;
    }
  }

  if (!notification.message) {
    return [{ label: 'Message', value: 'No additional details available.' }];
  }

  const sentences = notification.message
    .split(/(?<=\.)\s+/)
    .map((part) => part.trim())
    .filter(Boolean);

  if (sentences.length <= 1) {
    return [{ label: 'Message', value: notification.message }];
  }

  return sentences.map((sentence, index) => ({
    label: `Detail ${index + 1}`,
    value: sentence,
  }));
}

function relativeTime(isoString) {
  if (!isoString) return '';
  const diff = Date.now() - new Date(isoString).getTime();
  const mins = Math.floor(diff / 60_000);
  if (mins < 1)  return 'Just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24)  return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}

// ─── Sub-components ───────────────────────────────────────────────────────────

const NotificationItem = forwardRef(({ notification, onMarkRead, onDelete, onOpen }, ref) => {
  const { config, isNegativeBooking } = getNotificationVisualConfig(notification);
  
  // Dynamic icon for System Alerts (Security vs Maintenance)
  let Icon = config.icon;
  if (notification.type === 'SYSTEM') {
    if (notification.title?.toLowerCase().includes('maintenance') || 
        notification.message?.toLowerCase().includes('maintenance')) {
      Icon = Wrench;
    }
  }

  const isUnread = !notification.isRead;

  return (
    <motion.div
      ref={ref}
      layout
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.2 }}
      role="button"
      tabIndex={0}
      onClick={() => onOpen(notification)}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          onOpen(notification);
        }
      }}
      className={`relative flex gap-3 p-4 rounded-2xl border transition-all group ${
        isUnread
          ? notification.isAnnouncement 
            ? 'bg-purple-500/[0.05] border-purple-500/20 shadow-sm shadow-purple-500/5'
            : isNegativeBooking
              ? 'bg-rose-500/[0.05] border-rose-500/20 shadow-sm shadow-rose-500/5'
              : 'bg-nexer-brand-primary/[0.03] border-nexer-brand-primary/10'
          : 'bg-white/50 border-slate-100 hover:border-slate-200'
      } backdrop-blur-sm cursor-pointer focus:outline-none focus:ring-2 focus:ring-nexer-brand-primary/20`}
    >
      {/* Unread indicator */}
      {isUnread && (
        <span className={`absolute top-4 right-4 w-2 h-2 rounded-full ${isNegativeBooking ? 'bg-rose-500' : 'bg-nexer-brand-primary'}`} />
      )}

      {/* Type icon */}
      <div className={`flex-shrink-0 w-9 h-9 rounded-xl flex items-center justify-center ${config.bg}`}>
        <Icon className={`w-4 h-4 ${config.color}`} />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0 pr-6">
        <p className={`text-sm font-bold leading-snug truncate ${isUnread ? 'text-nexer-text-header' : 'text-nexer-text-body'}`}>
          {notification.title}
        </p>
        <p className="text-xs text-slate-400 mt-0.5 line-clamp-2 leading-relaxed">
          {notification.message}
        </p>
        <div className="flex items-center gap-2 mt-1.5">
          <span className={`text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-md ${config.bg} ${config.color}`}>
            {config.label}
          </span>
          <span className="text-[10px] text-slate-400">
            {relativeTime(notification.createdAt)}
          </span>
        </div>
      </div>

      {/* Action buttons (visible on hover) */}
      <div className="absolute right-3 bottom-3 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        {isUnread && (
          <button
            onClick={(event) => {
              event.stopPropagation();
              onMarkRead(notification.id);
            }}
            title="Mark as read"
            className="p-1 rounded-lg hover:bg-nexer-brand-primary/10 text-slate-400 hover:text-nexer-brand-primary transition-colors"
          >
            <Check className="w-3.5 h-3.5" />
          </button>
        )}
        <button
          onClick={(event) => {
            event.stopPropagation();
            onDelete(notification.id);
          }}
          title="Delete"
          className="p-1 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-500 transition-colors"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>
    </motion.div>
  );
});

NotificationItem.displayName = 'NotificationItem';

// ─── Main Panel Component ─────────────────────────────────────────────────────

const NotificationPanel = () => {
  const { settings } = useNotifications();
  const [isOpen, setIsOpen]                 = useState(false);
  const [notifications, setNotifications]   = useState([]);
  const [unreadCount, setUnreadCount]       = useState(0);
  const [loading, setLoading]               = useState(false);
  const [selectedNotification, setSelectedNotification] = useState(null);
  const panelRef                            = useRef(null);
  const prevCountRef                        = useRef(null);

  const formatDateTime = (isoString) => {
    if (!isoString) return '';
    try {
      return new Date(isoString).toLocaleString(undefined, {
        year: 'numeric',
        month: 'short',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return isoString;
    }
  };

  // ── Fetch unread count (for badge, polled) ──
  const fetchUnreadCount = useCallback(async () => {
    try {
      const res = await notificationService.getUnreadCount();
      if (res.success) setUnreadCount(res.data.count);
    } catch {
      // Silently ignore poll failures
    }
  }, []);

  // ── Fetch full notification list (on panel open) ──
  const fetchNotifications = useCallback(async () => {
    setLoading(true);
    try {
      const res = await notificationService.getNotifications();
      if (res.success) setNotifications(res.data);
    } catch {
      toast.error('Could not load notifications');
    } finally {
      setLoading(false);
    }
  }, []);

  // ── Poll unread count every 30 s ──
  useEffect(() => {
    fetchUnreadCount();
    const interval = setInterval(fetchUnreadCount, POLL_INTERVAL_MS);
    return () => clearInterval(interval);
  }, [fetchUnreadCount]);

  // ── Play sound when unread count increases ──
  useEffect(() => {
    if (prevCountRef.current !== null && unreadCount > prevCountRef.current) {
      if (settings?.soundEnabled) {
        console.log("Triggering notification sound. Count incremented from", prevCountRef.current, "to", unreadCount);
        playNotificationSound(0.5);
      }
    }
    prevCountRef.current = unreadCount;
  }, [unreadCount, settings?.soundEnabled]);

  // ── Load notifications when panel opens ──
  useEffect(() => {
    if (isOpen) fetchNotifications();
  }, [isOpen, fetchNotifications]);

  // ── Close on outside click ──
  useEffect(() => {
    if (!isOpen || selectedNotification) {
      return undefined;
    }

    const handleClick = (e) => {
      if (panelRef.current && !panelRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [isOpen, selectedNotification]);

  // ── Actions ──
  const handleMarkRead = async (id) => {
    try {
      await notificationService.markAsRead(id);
      setNotifications(prev =>
        prev.map(n => n.id === id ? { ...n, isRead: true } : n)
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch {
      toast.error('Failed to mark as read');
    }
  };

  const handleDelete = async (id) => {
    const wasUnread = notifications.find(n => n.id === id)?.isRead === false;
    try {
      await notificationService.deleteNotification(id);
      setNotifications(prev => prev.filter(n => n.id !== id));
      if (wasUnread) setUnreadCount(prev => Math.max(0, prev - 1));
    } catch {
      toast.error('Failed to delete notification');
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await notificationService.markAllAsRead();
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
      setUnreadCount(0);
      toast.success('All caught up!');
    } catch {
      toast.error('Failed to mark all as read');
    }
  };

  const handleOpenNotification = async (notification) => {
    setSelectedNotification(notification);
    if (!notification.isRead) {
      await handleMarkRead(notification.id);
    }
  };

  const handleCloseNotificationDetails = () => {
    setSelectedNotification(null);
  };

  useEffect(() => {
    if (!selectedNotification) return undefined;

    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        setSelectedNotification(null);
      }
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', handleEscape);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', handleEscape);
    };
  }, [selectedNotification]);

  const selectedVisual = selectedNotification
    ? getNotificationVisualConfig(selectedNotification)
    : { config: TYPE_CONFIG.SYSTEM, isNegativeBooking: false };
  const selectedConfig = selectedVisual.config;
  const selectedAccentClass = getNotificationAccentClass(selectedNotification, selectedVisual.isNegativeBooking);
  const selectedDetails = extractNotificationDetails(selectedNotification);
  const SelectedIcon = selectedConfig.icon;

  const displayCount = unreadCount > 99 ? '99+' : unreadCount;

  return (
    <div className="relative" ref={panelRef}>
      {/* ── Bell button ── */}
      <button
        id="notification-bell-btn"
        onClick={() => setIsOpen(o => !o)}
        className={`relative p-2.5 rounded-2xl transition-all border ${
          isOpen
            ? 'bg-nexer-brand-primary/10 text-nexer-brand-primary border-nexer-brand-primary/20'
            : 'text-slate-400 hover:bg-slate-50 hover:text-nexer-brand-primary border-transparent hover:border-slate-100'
        }`}
      >
        <motion.div
          animate={unreadCount > 0 ? { rotate: [0, -12, 12, -8, 8, 0] } : {}}
          transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 8 }}
        >
          <Bell className="w-5 h-5" />
        </motion.div>

        {/* Badge */}
        <AnimatePresence>
          {unreadCount > 0 && (
            <motion.span
              key="badge"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              className="absolute -top-1 -right-1 min-w-[18px] h-[18px] bg-nexer-status-error text-white text-[10px] font-black rounded-full flex items-center justify-center px-1 border-2 border-white shadow-sm"
            >
              {displayCount}
            </motion.span>
          )}
        </AnimatePresence>
      </button>

      {/* ── Dropdown panel ── */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            id="notification-panel"
            initial={{ opacity: 0, y: 8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.97 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
            className="absolute right-0 top-[calc(100%+12px)] w-[calc(100vw-32px)] sm:w-[400px] bg-white/80 backdrop-blur-xl rounded-[2.5rem] shadow-nexer-lg border border-white/20 z-50 overflow-hidden"
          >
            {/* Panel header */}
            <div className="flex items-center justify-between px-4 sm:px-5 pt-4 sm:pt-5 pb-3 border-b border-slate-50">
              <div>
                <h3 className="text-sm font-black text-nexer-text-header">Notifications</h3>
                {unreadCount > 0 && (
                  <p className="text-[11px] text-nexer-brand-primary font-bold mt-0.5">
                    {unreadCount} unread
                  </p>
                )}
              </div>
              <div className="flex items-center gap-1">
                {unreadCount > 0 && (
                  <button
                    onClick={handleMarkAllRead}
                    title="Mark all as read"
                    className="flex items-center gap-1.5 text-[11px] font-bold text-nexer-brand-primary hover:bg-nexer-brand-primary/5 px-2.5 py-1.5 rounded-xl transition-colors"
                  >
                    <CheckCheck className="w-3.5 h-3.5" />
                    All read
                  </button>
                )}
                <Link
                  to="/notifications/settings"
                  onClick={() => setIsOpen(false)}
                  className="p-2 rounded-xl text-slate-400 hover:bg-slate-50 hover:text-nexer-text-header transition-colors"
                  title="Notification settings"
                >
                  <Settings className="w-4 h-4" />
                </Link>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 rounded-xl text-slate-400 hover:bg-slate-50 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Notification list */}
            <div className="max-h-[420px] overflow-y-auto p-3 space-y-2">
              {loading ? (
                <div className="flex items-center justify-center py-12 text-slate-400">
                  <Loader2 className="w-5 h-5 animate-spin mr-2" />
                  <span className="text-sm font-medium">Loading…</span>
                </div>
              ) : notifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center mb-3">
                    <Bell className="w-6 h-6 text-slate-300" />
                  </div>
                  <p className="text-sm font-bold text-nexer-text-header">You're all caught up</p>
                  <p className="text-xs text-slate-400 mt-1">No notifications right now</p>
                </div>
              ) : (
                <AnimatePresence mode="popLayout">
                  {notifications.map(n => (
                    <NotificationItem
                      key={n.id}
                      notification={n}
                      onMarkRead={handleMarkRead}
                      onDelete={handleDelete}
                      onOpen={handleOpenNotification}
                    />
                  ))}
                </AnimatePresence>
              ) }
            </div>

            {/* Panel footer */}
            {notifications.length > 0 && (
              <div className="px-4 py-3 border-t border-slate-50 bg-slate-50/50">
                <Link
                  to="/notifications/settings"
                  onClick={() => setIsOpen(false)}
                  className="block text-center text-[11px] font-bold text-nexer-brand-primary hover:underline"
                >
                  Manage notification settings →
                </Link>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {typeof document !== 'undefined' && createPortal(
        <AnimatePresence>
          {selectedNotification && (
            <motion.div
              className="fixed inset-0 z-[120] bg-slate-900/50 backdrop-blur-sm grid place-items-center p-4 sm:p-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleCloseNotificationDetails}
            >
              <motion.div
                initial={{ opacity: 0, y: 24, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 24, scale: 0.97 }}
                transition={{ duration: 0.22, ease: 'easeOut' }}
                className="w-full max-w-xl bg-white rounded-[2rem] shadow-[0_30px_90px_rgba(15,23,42,0.3)] border border-slate-200 overflow-hidden"
                onClick={(event) => event.stopPropagation()}
              >
                <div className={`h-1.5 w-full ${selectedAccentClass}`} />

                <div className="px-6 sm:px-7 pt-6 pb-4 border-b border-slate-100 flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className={`w-11 h-11 rounded-2xl flex items-center justify-center ${selectedConfig.bg}`}>
                      <SelectedIcon className={`w-5 h-5 ${selectedConfig.color}`} />
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-lg font-black text-nexer-text-header leading-tight">{selectedNotification.title}</h4>
                      <p className="text-xs text-slate-500 mt-1">{formatDateTime(selectedNotification.createdAt)}</p>
                    </div>
                  </div>
                  <button
                    onClick={handleCloseNotificationDetails}
                    className="p-2 rounded-xl text-slate-400 hover:bg-slate-100 transition-colors"
                    title="Close"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="px-6 sm:px-7 py-5 space-y-4">
                  <span className={`inline-flex items-center text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md ${selectedConfig.bg} ${selectedConfig.color}`}>
                    {selectedConfig.label}
                  </span>

                  <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden divide-y divide-slate-100">
                    {selectedDetails.map((detail, index) => (
                      <div key={`${detail.label}-${index}`} className="px-4 sm:px-5 py-3 sm:py-3.5 grid grid-cols-1 sm:grid-cols-[130px_1fr] gap-1.5 sm:gap-4 items-start">
                        <p className="text-[10px] sm:text-[11px] font-bold uppercase tracking-widest text-slate-400">{detail.label}</p>
                        <p className="text-sm sm:text-[15px] leading-6 text-slate-700 whitespace-pre-wrap break-words">{detail.value}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="px-6 sm:px-7 py-4 border-t border-slate-100 bg-slate-50/60 flex items-center justify-end">
                  <button
                    onClick={handleCloseNotificationDetails}
                    className="px-5 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-700 text-sm font-bold hover:bg-slate-100 transition-colors"
                  >
                    Close
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </div>
  );
};

export default NotificationPanel;
