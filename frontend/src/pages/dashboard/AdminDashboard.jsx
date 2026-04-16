import React, { useState } from "react";
import { motion } from "framer-motion";
import StatCard from "../../components/StatCard";
import {
  Package,
  Calendar,
  Ticket,
  ArrowUpRight,
  TrendingUp,
  Users,
  X,
} from "lucide-react";
import StatusBadge from "../../components/StatusBadge";

const AdminDashboard = () => {
  const [showAddResourceModal, setShowAddResourceModal] = useState(false);
  const [newResource, setNewResource] = useState({
    name: "",
    type: "Venue",
    location: "",
    capacity: "",
    status: "ACTIVE",
    description: "",
    contact: "",
  });
  const [resourceImage, setResourceImage] = useState(null);
  const [errors, setErrors] = useState({});

  const validateResource = () => {
    const validationErrors = {};

    if (!newResource.name.trim()) {
      validationErrors.name = "Resource name is required.";
    }

    if (!newResource.location.trim()) {
      validationErrors.location = "Location is required.";
    }

    if (!newResource.capacity.toString().trim()) {
      validationErrors.capacity = "Capacity is required.";
    } else if (!/^[1-9]\d*$/.test(newResource.capacity.toString())) {
      validationErrors.capacity = "Capacity must be a positive whole number.";
    }

    if (!newResource.contact.trim()) {
      validationErrors.contact = "Contact details are required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newResource.contact.trim())) {
      validationErrors.contact = "Enter a valid email address.";
    }

    return validationErrors;
  };

  const handleResourceChange = (field) => (event) => {
    const value = event.target.value;
    setNewResource((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const handleImageChange = (event) => {
    const file = event.target.files?.[0] || null;
    setResourceImage(file);
  };

  const handleAddResource = () => {
    const validationErrors = validateResource();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    console.log("Create resource", { ...newResource, image: resourceImage });
    setShowAddResourceModal(false);
    setNewResource({
      name: "",
      type: "Venue",
      location: "",
      capacity: "",
      status: "ACTIVE",
      description: "",
      contact: "",
    });
    setResourceImage(null);
    setErrors({});
  };

  const stats = [
    {
      label: "Total Resources",
      value: "124",
      icon: Package,
      colorClass: "bg-primary-500",
      trend: 12,
    },
    {
      label: "Active Bookings",
      value: "42",
      icon: Calendar,
      colorClass: "bg-amber-500",
      trend: 5,
    },
    {
      label: "Pending Tickets",
      value: "8",
      icon: Ticket,
      colorClass: "bg-red-500",
      trend: -2,
    },
    {
      label: "Active Users",
      value: "1.2k",
      icon: Users,
      colorClass: "bg-emerald-500",
      trend: 8,
    },
  ];

  const recentActivities = [
    {
      id: 1,
      user: "John Doe",
      action: "Requested Booking",
      target: "Lab 3",
      time: "2 mins ago",
      status: "PENDING",
    },
    {
      id: 2,
      user: "Sarah Smith",
      action: "Reported Incident",
      target: "AC Fault - Hall B",
      time: "15 mins ago",
      status: "OPEN",
    },
    {
      id: 3,
      user: "System",
      action: "Maintenance Completed",
      target: "Server Room",
      time: "1 hour ago",
      status: "RESOLVED",
    },
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
            Operations Overview
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm mt-1">
            Real-time metrics and campus-wide management.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-4 py-2 bg-slate-800 text-slate-200 text-sm font-semibold rounded-lg hover:bg-slate-700 transition-colors">
            Generate Report
          </button>
          <button
            onClick={() => setShowAddResourceModal(true)}
            className="px-4 py-2 bg-primary-600 text-white text-sm font-semibold rounded-lg hover:bg-primary-500 shadow-lg shadow-primary-500/20 transition-all"
          >
            Add Resource
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <StatCard {...stat} />
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Activity Table */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-sm">
          <div className="p-6 border-b border-slate-800 flex justify-between items-center">
            <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-primary-500" />
              Recent Activity
            </h2>
            <button className="text-xs text-primary-400 hover:text-primary-300 font-semibold group flex items-center gap-1">
              View All{" "}
              <ArrowUpRight className="w-3 h-3 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </button>
          </div>
          <div className="table-responsive">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-800/30">
                  <th className="text-left px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">
                    User
                  </th>
                  <th className="text-left px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">
                    Activity
                  </th>
                  <th className="text-left px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">
                    Time
                  </th>
                  <th className="text-left px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {recentActivities.map((row) => (
                  <tr
                    key={row.id}
                    className="hover:bg-slate-800/20 transition-colors group"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-[10px] font-bold text-slate-400 border border-slate-700">
                          {row.user
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </div>
                        <span className="text-sm font-medium text-slate-200">
                          {row.user}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-slate-300">{row.action}</p>
                      <p className="text-xs text-slate-500 tracking-tight mt-0.5">
                        {row.target}
                      </p>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-500">
                      {row.time}
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={row.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick Actions / System Health */}
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-sm">
            <h2 className="text-lg font-bold text-slate-100 mb-4">
              System Tasks
            </h2>
            <div className="space-y-4">
              {[
                {
                  label: "Database Backup",
                  progress: 85,
                  status: "Processing",
                },
                { label: "Security Scan", progress: 100, status: "Completed" },
                { label: "Token Cleanup", progress: 30, status: "In Queue" },
              ].map((task, i) => (
                <div key={i}>
                  <div className="flex justify-between text-xs mb-1.5">
                    <span className="text-slate-300 font-medium">
                      {task.label}
                    </span>
                    <span className="text-slate-500">{task.status}</span>
                  </div>
                  <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${task.progress}%` }}
                      className="h-full bg-primary-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {showAddResourceModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="w-full max-w-3xl rounded-[2rem] bg-white shadow-2xl overflow-hidden"
          >
            <div className="p-8">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-black text-slate-900">
                    Add New Resource
                  </h2>
                  <p className="text-sm text-slate-500 mt-1">
                    Create a new campus resource entry for the operations
                    registry.
                  </p>
                </div>
                <button
                  onClick={() => setShowAddResourceModal(false)}
                  className="text-slate-400 hover:text-slate-600 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <label className="space-y-2">
                  <span className="text-xs font-black uppercase tracking-[0.2em] text-slate-500">
                    Resource Name
                  </span>
                  <input
                    value={newResource.name}
                    onChange={handleResourceChange("name")}
                    type="text"
                    placeholder="e.g. Project Lab 04"
                    className={`w-full rounded-2xl border px-4 py-3 text-sm text-slate-900 outline-none focus:ring-2 focus:ring-primary-100 ${
                      errors.name
                        ? "border-rose-500 bg-rose-50 focus:border-rose-500"
                        : "border-slate-200 bg-slate-50 focus:border-primary-500"
                    }`}
                  />
                  {errors.name && (
                    <p className="text-rose-500 text-xs mt-1">{errors.name}</p>
                  )}
                </label>
                <label className="space-y-2">
                  <span className="text-xs font-black uppercase tracking-[0.2em] text-slate-500">
                    Resource Type
                  </span>
                  <select
                    value={newResource.type}
                    onChange={handleResourceChange("type")}
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
                  >
                    <option value="Venue">Venue</option>
                    <option value="Lab">Lab</option>
                    <option value="Classroom">Classroom</option>
                    <option value="Collaborative">Collaborative</option>
                  </select>
                </label>
                <label className="space-y-2">
                  <span className="text-xs font-black uppercase tracking-[0.2em] text-slate-500">
                    Location
                  </span>
                  <input
                    value={newResource.location}
                    onChange={handleResourceChange("location")}
                    type="text"
                    placeholder="e.g. Block B, Floor 2"
                    className={`w-full rounded-2xl border px-4 py-3 text-sm text-slate-900 outline-none focus:ring-2 focus:ring-primary-100 ${
                      errors.location
                        ? "border-rose-500 bg-rose-50 focus:border-rose-500"
                        : "border-slate-200 bg-slate-50 focus:border-primary-500"
                    }`}
                  />
                  {errors.location && (
                    <p className="text-rose-500 text-xs mt-1">
                      {errors.location}
                    </p>
                  )}
                </label>
                <label className="space-y-2">
                  <span className="text-xs font-black uppercase tracking-[0.2em] text-slate-500">
                    Capacity
                  </span>
                  <input
                    value={newResource.capacity}
                    onChange={handleResourceChange("capacity")}
                    type="number"
                    placeholder="e.g. 40"
                    className={`w-full rounded-2xl border px-4 py-3 text-sm text-slate-900 outline-none focus:ring-2 focus:ring-primary-100 ${
                      errors.capacity
                        ? "border-rose-500 bg-rose-50 focus:border-rose-500"
                        : "border-slate-200 bg-slate-50 focus:border-primary-500"
                    }`}
                  />
                  {errors.capacity && (
                    <p className="text-rose-500 text-xs mt-1">
                      {errors.capacity}
                    </p>
                  )}
                </label>
                <label className="space-y-2">
                  <span className="text-xs font-black uppercase tracking-[0.2em] text-slate-500">
                    Status
                  </span>
                  <select
                    value={newResource.status}
                    onChange={handleResourceChange("status")}
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
                  >
                    <option value="ACTIVE">Active</option>
                    <option value="OUT_OF_SERVICE">Out of Service</option>
                    <option value="MAINTENANCE">Maintenance</option>
                  </select>
                </label>
                <label className="space-y-2 lg:col-span-2">
                  <span className="text-xs font-black uppercase tracking-[0.2em] text-slate-500">
                    Description
                  </span>
                  <textarea
                    value={newResource.description}
                    onChange={handleResourceChange("description")}
                    rows={4}
                    placeholder="Describe the facility, equipment, or supporting amenities."
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100 resize-none"
                  />
                </label>
                <label className="space-y-2 lg:col-span-2">
                  <span className="text-xs font-black uppercase tracking-[0.2em] text-slate-500">
                    Contact Details
                  </span>
                  <input
                    value={newResource.contact}
                    onChange={handleResourceChange("contact")}
                    type="text"
                    placeholder="e.g. manager@email.com"
                    className={`w-full rounded-2xl border px-4 py-3 text-sm text-slate-900 outline-none focus:ring-2 focus:ring-primary-100 ${
                      errors.contact
                        ? "border-rose-500 bg-rose-50 focus:border-rose-500"
                        : "border-slate-200 bg-slate-50 focus:border-primary-500"
                    }`}
                  />
                  {errors.contact && (
                    <p className="text-rose-500 text-xs mt-1">
                      {errors.contact}
                    </p>
                  )}
                </label>
                <div className="lg:col-span-2">
                  <span className="text-xs font-black uppercase tracking-[0.2em] text-slate-500">
                    Resource Image
                  </span>
                  <label className="mt-2 flex h-40 items-center justify-center rounded-[2rem] border-2 border-dashed border-slate-200 bg-slate-50 text-center text-sm text-slate-500 cursor-pointer transition-colors hover:border-primary-500 hover:text-primary-600">
                    <div>
                      <p className="font-black text-slate-700">
                        Drop images here or browse
                      </p>
                      <p className="text-[11px] text-slate-400 mt-1">
                        Up to 3 images
                      </p>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                      />
                    </div>
                  </label>
                  {resourceImage && (
                    <p className="mt-3 text-sm text-slate-600">
                      Selected: {resourceImage.name}
                    </p>
                  )}
                </div>
              </div>

              <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-end">
                <button
                  onClick={() => setShowAddResourceModal(false)}
                  className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-slate-100 text-slate-600 font-black text-xs uppercase tracking-widest hover:bg-slate-200 transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddResource}
                  disabled={Object.keys(validateResource()).length > 0}
                  className={`w-full sm:w-auto px-6 py-3 rounded-2xl text-white font-black text-xs uppercase tracking-widest shadow-lg transition-all ${
                    Object.keys(validateResource()).length > 0
                      ? "bg-slate-300 cursor-not-allowed shadow-none"
                      : "bg-primary-600 shadow-primary-500/20 hover:bg-primary-500"
                  }`}
                >
                  Create Resource
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
