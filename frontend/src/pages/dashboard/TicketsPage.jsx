import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Plus, X, Search, ArrowRight, Pencil } from "lucide-react";
import StatusBadge from "../../components/StatusBadge";

const initialTickets = [
  {
    id: "TKT-001",
    title: "Projector not turning on",
    location: "Lecture Hall 2A",
    category: "Equipment",
    priority: "HIGH",
    status: "IN_PROGRESS",
    assignee: "Ashan Perera",
    created: "2026-04-07",
    contact: "ext. 4421",
    attachments: 2,
    comments: [
      {
        author: "Kavindu Silva",
        role: "USER",
        time: "Apr 7, 9:12 AM",
        text: "Tried the remote and direct button — no response at all.",
        own: false,
      },
      {
        author: "Ashan Perera",
        role: "TECHNICIAN",
        time: "Apr 8, 11:00 AM",
        text: "Checked fuse — blown. Replacement ordered, ETA 2 days.",
        own: true,
      },
    ],
  },
  {
    id: "TKT-002",
    title: "Water leak near server room door",
    location: "Server Room, Block C",
    category: "Plumbing",
    priority: "HIGH",
    status: "OPEN",
    assignee: null,
    created: "2026-04-08",
    contact: "dilruwan@sliit.lk",
    attachments: 3,
    comments: [
      {
        author: "Dilruwan Jayasekara",
        role: "USER",
        time: "Apr 8, 8:45 AM",
        text: "Water pooling on floor near door frame after last night’s rain.",
        own: false,
      },
    ],
  },
  {
    id: "TKT-003",
    title: "Air conditioning noise — Lab 5",
    location: "Computer Lab 5, Block B",
    category: "Electrical",
    priority: "MEDIUM",
    status: "OPEN",
    assignee: null,
    created: "2026-04-07",
    contact: "ext. 3301",
    attachments: 0,
    comments: [],
  },
  {
    id: "TKT-004",
    title: "Network port not working — Room 302",
    location: "Room 302, Block A",
    category: "Network",
    priority: "LOW",
    status: "RESOLVED",
    assignee: "Nilufar Rashidova",
    created: "2026-04-05",
    contact: "harini@sliit.lk",
    attachments: 1,
    comments: [
      {
        author: "Nilufar Rashidova",
        role: "TECHNICIAN",
        time: "Apr 6, 3:00 PM",
        text: "Port was disabled in switch config. Re-enabled and tested OK.",
        own: true,
      },
    ],
  },
  {
    id: "TKT-005",
    title: "Fire extinguisher mount broken",
    location: "Corridor 1, Block D",
    category: "Safety",
    priority: "HIGH",
    status: "CLOSED",
    assignee: "Dev Krishnamurthy",
    created: "2026-04-03",
    contact: "ext. 5010",
    attachments: 2,
    comments: [
      {
        author: "Dev Krishnamurthy",
        role: "TECHNICIAN",
        time: "Apr 4, 10:30 AM",
        text: "New bracket installed and load-tested.",
        own: true,
      },
      {
        author: "Admin",
        role: "ADMIN",
        time: "Apr 4, 2:00 PM",
        text: "Ticket closed — verified on site.",
        own: false,
      },
    ],
  },
];

const statuses = [
  { value: "", label: "All statuses" },
  { value: "OPEN", label: "Open" },
  { value: "IN_PROGRESS", label: "In progress" },
  { value: "RESOLVED", label: "Resolved" },
  { value: "CLOSED", label: "Closed" },
  { value: "REJECTED", label: "Rejected" },
];

const priorities = [
  { value: "", label: "All priorities" },
  { value: "HIGH", label: "High" },
  { value: "MEDIUM", label: "Medium" },
  { value: "LOW", label: "Low" },
];

const initialForm = {
  category: "Electrical",
  priority: "HIGH",
  location: "",
  description: "",
  contact: "",
  attachments: [],
};

const TicketsPage = () => {
  const [tickets, setTickets] = useState(initialTickets);
  const [selectedTicketId, setSelectedTicketId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("");
  const [showNewTicketModal, setShowNewTicketModal] = useState(false);
  const [ticketForm, setTicketForm] = useState(initialForm);
  const [nextTicketNumber, setNextTicketNumber] = useState(6);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editForm, setEditForm] = useState(null);

  const filteredTickets = useMemo(
    () =>
      tickets.filter((ticket) => {
        const matchesQuery =
          !searchQuery ||
          [ticket.title, ticket.location, ticket.category]
            .join(" ")
            .toLowerCase()
            .includes(searchQuery.toLowerCase());
        const matchesStatus = !statusFilter || ticket.status === statusFilter;
        const matchesPriority =
          !priorityFilter || ticket.priority === priorityFilter;
        return matchesQuery && matchesStatus && matchesPriority;
      }),
    [tickets, searchQuery, statusFilter, priorityFilter],
  );

  const selectedTicket = useMemo(
    () => tickets.find((ticket) => ticket.id === selectedTicketId) || null,
    [tickets, selectedTicketId],
  );

  const stats = useMemo(
    () => ({
      total: tickets.length,
      open: tickets.filter((ticket) => ticket.status === "OPEN").length,
      inProgress: tickets.filter((ticket) => ticket.status === "IN_PROGRESS")
        .length,
      resolved: tickets.filter((ticket) => ticket.status === "RESOLVED").length,
    }),
    [tickets],
  );

  const formatPriority = (priority) =>
    priority[0] + priority.slice(1).toLowerCase();

  const handleTicketUpdate = (updatedTicket) => {
    setTickets((prev) =>
      prev.map((ticket) =>
        ticket.id === updatedTicket.id
          ? { ...ticket, ...updatedTicket }
          : ticket,
      ),
    );
  };

  const handleEditOpen = () => {
    if (!selectedTicket) return;
    setEditForm({
      title: selectedTicket.title,
      location: selectedTicket.location,
      category: selectedTicket.category,
      priority: selectedTicket.priority,
      contact: selectedTicket.contact,
    });
    setShowEditModal(true);
  };

  const handleEditSave = () => {
    if (!selectedTicket || !editForm) return;
    handleTicketUpdate({ ...selectedTicket, ...editForm });
    setShowEditModal(false);
    setEditForm(null);
  };

  const handleCommentAdd = (text) => {
    if (!selectedTicket || !text.trim()) return;
    const updated = {
      ...selectedTicket,
      comments: [
        ...selectedTicket.comments,
        {
          author: "You",
          role: "USER",
          time: "Just now",
          text: text.trim(),
          own: true,
        },
      ],
    };
    handleTicketUpdate(updated);
  };

  const handleCommentEdit = (index) => {
    if (!selectedTicket) return;
    const comment = selectedTicket.comments[index];
    const updatedText = prompt("Edit comment:", comment.text);
    if (updatedText === null) return;
    const updated = {
      ...selectedTicket,
      comments: selectedTicket.comments.map((item, idx) =>
        idx === index ? { ...item, text: updatedText } : item,
      ),
    };
    handleTicketUpdate(updated);
  };

  const handleCommentDelete = (index) => {
    if (!selectedTicket) return;
    if (!window.confirm("Delete this comment?")) return;
    const updated = {
      ...selectedTicket,
      comments: selectedTicket.comments.filter((_, idx) => idx !== index),
    };
    handleTicketUpdate(updated);
  };

  const handleNewTicketSubmit = () => {
    const title = ticketForm.description
      ? ticketForm.description.substring(0, 50) +
        (ticketForm.description.length > 50 ? "…" : "")
      : `New ${ticketForm.category} ticket`;

    const newTicket = {
      id: `TKT-00${nextTicketNumber}`,
      title,
      location: ticketForm.location || "Unspecified",
      category: ticketForm.category,
      priority: ticketForm.priority,
      status: "OPEN",
      assignee: null,
      created: new Date().toISOString().slice(0, 10),
      contact: ticketForm.contact || "—",
      attachments: Math.min(ticketForm.attachments.length, 3),
      comments: [],
    };

    setTickets((prev) => [newTicket, ...prev]);
    setNextTicketNumber((value) => value + 1);
    setTicketForm(initialForm);
    setShowNewTicketModal(false);
  };

  return (
    <div className="space-y-8 pb-10">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight">
            Incident Tickets
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Real-time incident ticketing for campus maintenance and operations.
          </p>
        </div>

        <button
          onClick={() => setShowNewTicketModal(true)}
          className="inline-flex items-center gap-2 rounded-2xl bg-primary-600 px-5 py-3 text-sm font-black text-white shadow-lg shadow-primary-500/20 hover:bg-primary-500 transition-all"
        >
          <Plus className="w-4 h-4" />
          New ticket
        </button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[1.2fr_0.8fr] gap-8">
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6">
              <div className="text-xs text-slate-400">Total tickets</div>
              <div className="mt-4 text-3xl font-black text-white">
                {stats.total}
              </div>
            </div>
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6">
              <div className="text-xs text-slate-400">Open</div>
              <div className="mt-4 text-3xl font-black text-sky-400">
                {stats.open}
              </div>
            </div>
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6">
              <div className="text-xs text-slate-400">In progress</div>
              <div className="mt-4 text-3xl font-black text-amber-400">
                {stats.inProgress}
              </div>
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div>
                <p className="text-sm font-bold text-white">Tickets</p>
                <p className="text-xs text-slate-400 mt-1">
                  Showing {filteredTickets.length} ticket
                  {filteredTickets.length !== 1 ? "s" : ""}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full">
                <div className="flex items-center gap-3 rounded-2xl border border-slate-800 bg-slate-950 px-4 py-3">
                  <Search className="w-4 h-4 text-slate-400" />
                  <input
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search tickets…"
                    className="w-full bg-transparent text-sm text-slate-100 outline-none placeholder:text-slate-500"
                  />
                </div>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="rounded-2xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm text-slate-100 outline-none"
                >
                  {statuses.map((item) => (
                    <option
                      key={item.value}
                      value={item.value}
                      className="bg-slate-950"
                    >
                      {item.label}
                    </option>
                  ))}
                </select>
                <select
                  value={priorityFilter}
                  onChange={(e) => setPriorityFilter(e.target.value)}
                  className="rounded-2xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm text-slate-100 outline-none"
                >
                  {priorities.map((item) => (
                    <option
                      key={item.value}
                      value={item.value}
                      className="bg-slate-950"
                    >
                      {item.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-4">
              {filteredTickets.length === 0 ? (
                <div className="rounded-3xl bg-slate-950 border border-slate-800 p-8 text-center text-slate-500">
                  No tickets match your filters.
                </div>
              ) : (
                filteredTickets.map((ticket) => (
                  <button
                    key={ticket.id}
                    onClick={() => setSelectedTicketId(ticket.id)}
                    className={`w-full text-left rounded-3xl border p-6 shadow-sm transition-all ${
                      selectedTicketId === ticket.id
                        ? "border-primary-500 bg-slate-950"
                        : "border-slate-800 bg-slate-900 hover:border-slate-700"
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                      <div>
                        <div className="flex flex-wrap items-center gap-3">
                          <span className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-500">
                            {ticket.id}
                          </span>
                          <StatusBadge status={ticket.status} />
                        </div>
                        <h2 className="mt-3 text-xl font-bold text-white">
                          {ticket.title}
                        </h2>
                        <p className="mt-2 text-sm text-slate-400">
                          {ticket.location}
                        </p>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <span className="text-sm text-slate-400">
                          {ticket.category}
                        </span>
                        <span className="text-sm text-slate-300">
                          Priority: {formatPriority(ticket.priority)}
                        </span>
                        <span className="text-xs text-slate-500">
                          {ticket.comments.length} comment
                          {ticket.comments.length !== 1 ? "s" : ""}
                        </span>
                      </div>
                    </div>
                  </button>
                ))
              )}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-sm">
            <h3 className="text-lg font-bold text-white">Ticket Summary</h3>
            <div className="mt-6 grid gap-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-3xl bg-slate-950 border border-slate-800 p-5">
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
                    Open
                  </p>
                  <p className="mt-3 text-3xl font-black text-white">
                    {stats.open}
                  </p>
                </div>
                <div className="rounded-3xl bg-slate-950 border border-slate-800 p-5">
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
                    In progress
                  </p>
                  <p className="mt-3 text-3xl font-black text-white">
                    {stats.inProgress}
                  </p>
                </div>
              </div>
              <div className="rounded-3xl bg-slate-950 border border-slate-800 p-5">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
                  Resolved
                </p>
                <p className="mt-3 text-3xl font-black text-white">
                  {stats.resolved}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {selectedTicket && (
        <aside className="fixed right-0 top-0 z-40 h-full w-full max-w-xl bg-slate-950 border-l border-slate-800 shadow-2xl p-8 overflow-y-auto">
          <div className="flex items-start justify-between gap-4 mb-8">
            <div>
              <h2 className="text-2xl font-black text-white">
                {selectedTicket.id}
              </h2>
              <p className="mt-2 text-sm text-slate-400">
                {selectedTicket.title}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleEditOpen}
                className="rounded-full bg-slate-800 p-2 text-slate-400 hover:bg-primary-500 hover:text-white transition-colors"
                title="Edit ticket"
              >
                <Pencil className="w-4 h-4" />
              </button>
              <button
                onClick={() => setSelectedTicketId(null)}
                className="rounded-full bg-slate-800 p-2 text-slate-400 hover:bg-slate-700 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <div className="flex flex-wrap items-center gap-3 mb-4">
                {["OPEN", "IN_PROGRESS", "RESOLVED", "CLOSED"].map(
                  (status, index) => {
                    const order = ["OPEN", "IN_PROGRESS", "RESOLVED", "CLOSED"];
                    const isDone =
                      order.indexOf(status) <
                      order.indexOf(selectedTicket.status);
                    const isCurrent = status === selectedTicket.status;
                    return (
                      <div key={status} className="flex items-center gap-3">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-semibold ${
                            isCurrent
                              ? "bg-emerald-500 text-white"
                              : isDone
                                ? "bg-slate-800 text-slate-300"
                                : "bg-slate-900 text-slate-500"
                          }`}
                        >
                          {status.replace("_", " ")}
                        </span>
                        {index < 3 && (
                          <ArrowRight className="w-3.5 h-3.5 text-slate-500" />
                        )}
                      </div>
                    );
                  },
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="rounded-3xl bg-slate-900 border border-slate-800 p-4">
                <p className="text-xs text-slate-400 uppercase tracking-[0.2em]">
                  Location
                </p>
                <p className="mt-2 text-sm text-white">
                  {selectedTicket.location}
                </p>
              </div>
              <div className="rounded-3xl bg-slate-900 border border-slate-800 p-4">
                <p className="text-xs text-slate-400 uppercase tracking-[0.2em]">
                  Category
                </p>
                <p className="mt-2 text-sm text-white">
                  {selectedTicket.category}
                </p>
              </div>
              <div className="rounded-3xl bg-slate-900 border border-slate-800 p-4">
                <p className="text-xs text-slate-400 uppercase tracking-[0.2em]">
                  Priority
                </p>
                <p className="mt-2 text-sm text-white">
                  {formatPriority(selectedTicket.priority)}
                </p>
              </div>
              <div className="rounded-3xl bg-slate-900 border border-slate-800 p-4">
                <p className="text-xs text-slate-400 uppercase tracking-[0.2em]">
                  Created
                </p>
                <p className="mt-2 text-sm text-white">
                  {selectedTicket.created}
                </p>
              </div>
              <div className="rounded-3xl bg-slate-900 border border-slate-800 p-4">
                <p className="text-xs text-slate-400 uppercase tracking-[0.2em]">
                  Contact
                </p>
                <p className="mt-2 text-sm text-white">
                  {selectedTicket.contact}
                </p>
              </div>
              <div className="rounded-3xl bg-slate-900 border border-slate-800 p-4">
                <p className="text-xs text-slate-400 uppercase tracking-[0.2em]">
                  Assignee
                </p>
                <p className="mt-2 text-sm text-white">
                  {selectedTicket.assignee || "—"}
                </p>
              </div>
            </div>

            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-slate-500 mb-3">
                Attachments
              </p>
              <div className="flex gap-3 flex-wrap">
                {selectedTicket.attachments > 0 ? (
                  Array.from({ length: selectedTicket.attachments }).map(
                    (_, idx) => (
                      <div
                        key={idx}
                        className="rounded-3xl bg-slate-900 border border-slate-800 w-20 h-16 flex items-center justify-center text-slate-500 text-xs"
                      >
                        Image {idx + 1}
                      </div>
                    ),
                  )
                ) : (
                  <p className="text-sm text-slate-500">No attachments</p>
                )}
              </div>
            </div>

            <div className="space-y-4">
              <div className="rounded-3xl bg-slate-900 border border-slate-800 p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-500 mb-2">
                  Assign technician
                </p>
                <div className="flex gap-3">
                  <select
                    value={selectedTicket.assignee || ""}
                    onChange={(e) =>
                      handleTicketUpdate({
                        ...selectedTicket,
                        assignee: e.target.value || null,
                      })
                    }
                    className="flex-1 rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-slate-100 outline-none"
                  >
                    <option value="">— Unassigned —</option>
                    <option>Ashan Perera</option>
                    <option>Nilufar Rashidova</option>
                    <option>Dev Krishnamurthy</option>
                  </select>
                  <button className="rounded-2xl bg-slate-800 px-5 py-3 text-sm font-semibold text-white hover:bg-slate-700 transition-all">
                    Assign
                  </button>
                </div>
              </div>
              <div className="rounded-3xl bg-slate-900 border border-slate-800 p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-500 mb-2">
                  Update status
                </p>
                <div className="flex gap-3">
                  <select
                    value={selectedTicket.status}
                    onChange={(e) =>
                      handleTicketUpdate({
                        ...selectedTicket,
                        status: e.target.value,
                      })
                    }
                    className="flex-1 rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-slate-100 outline-none"
                  >
                    {statuses
                      .filter((item) => item.value)
                      .map((item) => (
                        <option key={item.value} value={item.value}>
                          {item.label}
                        </option>
                      ))}
                  </select>
                  <button className="rounded-2xl bg-slate-800 px-5 py-3 text-sm font-semibold text-white hover:bg-slate-700 transition-all">
                    Update
                  </button>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
                  Comments
                </p>
                <span className="text-xs text-slate-400">
                  {selectedTicket.comments.length} comment
                  {selectedTicket.comments.length !== 1 ? "s" : ""}
                </span>
              </div>
              <div className="space-y-3">
                {selectedTicket.comments.length === 0 ? (
                  <p className="text-sm text-slate-500">No comments yet.</p>
                ) : (
                  selectedTicket.comments.map((comment, idx) => (
                    <div
                      key={idx}
                      className="rounded-3xl bg-slate-900 border border-slate-800 p-4"
                    >
                      <div className="flex items-center gap-3 mb-3">
                        <div className="rounded-full bg-slate-800 text-slate-200 flex h-8 w-8 items-center justify-center text-xs font-bold">
                          {comment.author
                            .split(" ")
                            .map((part) => part[0])
                            .join("")}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-white">
                            {comment.author}
                          </p>
                          <p className="text-xs text-slate-500">
                            {comment.role} · {comment.time}
                          </p>
                        </div>
                      </div>
                      <p className="text-sm text-slate-300">{comment.text}</p>
                      {comment.own && (
                        <div className="mt-3 flex gap-3">
                          <button
                            onClick={() => handleCommentEdit(idx)}
                            className="text-xs font-bold uppercase tracking-[0.2em] text-sky-400"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleCommentDelete(idx)}
                            className="text-xs font-bold uppercase tracking-[0.2em] text-rose-400"
                          >
                            Delete
                          </button>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
              <div className="rounded-3xl bg-slate-900 border border-slate-800 p-4">
                <textarea
                  id="comment-input"
                  rows={4}
                  placeholder="Add a comment…"
                  className="w-full resize-none rounded-3xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm text-slate-100 outline-none"
                />
                <div className="mt-4 flex justify-end">
                  <button
                    onClick={() => {
                      const textarea = document.getElementById("comment-input");
                      if (textarea) {
                        handleCommentAdd(textarea.value);
                        textarea.value = "";
                      }
                    }}
                    className="inline-flex items-center gap-2 rounded-2xl bg-primary-600 px-4 py-3 text-sm font-bold text-white hover:bg-primary-500 transition-all"
                  >
                    Post
                  </button>
                </div>
              </div>
            </div>
          </div>
        </aside>
      )}

      {showNewTicketModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 20 }}
            className="w-full max-w-lg rounded-[2rem] bg-slate-900 border border-slate-800 shadow-2xl overflow-hidden"
          >
            <div className="p-5">
              <div className="flex items-start justify-between gap-4 mb-4">
                <div>
                  <h2 className="text-xl font-black text-white">
                    New incident ticket
                  </h2>
                  <p className="mt-2 text-sm text-slate-400">
                    Submit a new campus incident with location and contact
                    details.
                  </p>
                </div>
                <button
                  onClick={() => setShowNewTicketModal(false)}
                  className="rounded-full bg-slate-800 p-2 text-slate-400 hover:bg-slate-700 hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <label className="space-y-2">
                  <span className="text-xs font-black uppercase tracking-[0.25em] text-slate-500">
                    Category
                  </span>
                  <select
                    value={ticketForm.category}
                    onChange={(e) =>
                      setTicketForm((prev) => ({
                        ...prev,
                        category: e.target.value,
                      }))
                    }
                    className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20"
                  >
                    <option>Electrical</option>
                    <option>Plumbing</option>
                    <option>Equipment</option>
                    <option>Network</option>
                    <option>Safety</option>
                  </select>
                </label>
                <label className="space-y-2">
                  <span className="text-xs font-black uppercase tracking-[0.25em] text-slate-500">
                    Priority
                  </span>
                  <select
                    value={ticketForm.priority}
                    onChange={(e) =>
                      setTicketForm((prev) => ({
                        ...prev,
                        priority: e.target.value,
                      }))
                    }
                    className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20"
                  >
                    <option>HIGH</option>
                    <option>MEDIUM</option>
                    <option>LOW</option>
                  </select>
                </label>
              </div>

              <div className="space-y-3 mt-3">
                <label className="space-y-2">
                  <span className="text-xs font-black uppercase tracking-[0.25em] text-slate-500">
                    Resource / location
                  </span>
                  <input
                    value={ticketForm.location}
                    onChange={(e) =>
                      setTicketForm((prev) => ({
                        ...prev,
                        location: e.target.value,
                      }))
                    }
                    type="text"
                    placeholder="e.g. Lab 3B, Building A"
                    className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20"
                  />
                </label>

                <label className="space-y-2">
                  <span className="text-xs font-black uppercase tracking-[0.25em] text-slate-500">
                    Description
                  </span>
                  <textarea
                    value={ticketForm.description}
                    onChange={(e) =>
                      setTicketForm((prev) => ({
                        ...prev,
                        description: e.target.value,
                      }))
                    }
                    rows={3}
                    placeholder="Describe the issue…"
                    className="w-full rounded-3xl border border-slate-700 bg-slate-950 px-4 py-4 text-sm text-white outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 resize-none"
                  />
                </label>

                <label className="space-y-2">
                  <span className="text-xs font-black uppercase tracking-[0.25em] text-slate-500">
                    Contact details
                  </span>
                  <input
                    value={ticketForm.contact}
                    onChange={(e) =>
                      setTicketForm((prev) => ({
                        ...prev,
                        contact: e.target.value,
                      }))
                    }
                    type="text"
                    placeholder="Phone or email"
                    className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20"
                  />
                </label>

                <label className="space-y-2">
                  <span className="text-xs font-black uppercase tracking-[0.25em] text-slate-500">
                    Attachments
                  </span>
                  <label className="group flex h-20 items-center justify-center rounded-2xl border-2 border-dashed border-slate-700 bg-slate-950 text-center px-4 py-2 text-sm text-slate-400 hover:border-primary-500 hover:text-primary-400 transition-colors cursor-pointer">
                    <div>
                      <p className="font-black text-slate-100">
                        Drop images here or browse
                      </p>
                      <p className="text-xs text-slate-500 mt-2">
                        Up to 3 images
                      </p>
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={(e) =>
                          setTicketForm((prev) => ({
                            ...prev,
                            attachments: Array.from(e.target.files || []),
                          }))
                        }
                        className="hidden"
                      />
                    </div>
                  </label>
                  {ticketForm.attachments.length > 0 && (
                    <p className="text-xs text-slate-400 mt-2">
                      {ticketForm.attachments.length} file(s) selected
                    </p>
                  )}
                </label>
              </div>

              <div className="mt-4 flex items-center gap-3 justify-end">
                <button
                  onClick={() => setShowNewTicketModal(false)}
                  className="rounded-2xl border border-slate-700 bg-slate-950 px-5 py-2.5 text-sm font-bold text-slate-300 hover:bg-slate-900 transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={handleNewTicketSubmit}
                  className="rounded-2xl bg-primary-600 px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-primary-500/20 hover:bg-primary-500 transition-all"
                >
                  Submit ticket
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {showEditModal && editForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 20 }}
            className="w-full max-w-md rounded-[1.5rem] bg-slate-900 border border-slate-800 shadow-2xl overflow-hidden"
          >
            <div className="p-4">
              <div className="flex items-center justify-between gap-3 mb-4">
                <div>
                  <h2 className="text-base font-black text-white">Edit Ticket</h2>
                  <p className="mt-0.5 text-xs text-slate-400">
                    {selectedTicket?.id} — update the details below.
                  </p>
                </div>
                <button
                  onClick={() => setShowEditModal(false)}
                  className="rounded-full bg-slate-800 p-1.5 text-slate-400 hover:bg-slate-700 hover:text-white transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-3">
                <label className="block space-y-1">
                  <span className="text-xs font-black uppercase tracking-[0.2em] text-slate-500">Title</span>
                  <input
                    value={editForm.title}
                    onChange={(e) => setEditForm((prev) => ({ ...prev, title: e.target.value }))}
                    type="text"
                    placeholder="Short description of the issue"
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20"
                  />
                </label>

                <label className="block space-y-1">
                  <span className="text-xs font-black uppercase tracking-[0.2em] text-slate-500">Location</span>
                  <input
                    value={editForm.location}
                    onChange={(e) => setEditForm((prev) => ({ ...prev, location: e.target.value }))}
                    type="text"
                    placeholder="e.g. Lab 3B, Building A"
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20"
                  />
                </label>

                <div className="grid grid-cols-2 gap-3">
                  <label className="block space-y-1">
                    <span className="text-xs font-black uppercase tracking-[0.2em] text-slate-500">Category</span>
                    <select
                      value={editForm.category}
                      onChange={(e) => setEditForm((prev) => ({ ...prev, category: e.target.value }))}
                      className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20"
                    >
                      <option>Electrical</option>
                      <option>Plumbing</option>
                      <option>Equipment</option>
                      <option>Network</option>
                      <option>Safety</option>
                    </select>
                  </label>

                  <label className="block space-y-1">
                    <span className="text-xs font-black uppercase tracking-[0.2em] text-slate-500">Priority</span>
                    <select
                      value={editForm.priority}
                      onChange={(e) => setEditForm((prev) => ({ ...prev, priority: e.target.value }))}
                      className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20"
                    >
                      <option>HIGH</option>
                      <option>MEDIUM</option>
                      <option>LOW</option>
                    </select>
                  </label>
                </div>

                <label className="block space-y-1">
                  <span className="text-xs font-black uppercase tracking-[0.2em] text-slate-500">Contact</span>
                  <input
                    value={editForm.contact}
                    onChange={(e) => setEditForm((prev) => ({ ...prev, contact: e.target.value }))}
                    type="text"
                    placeholder="Phone or email"
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20"
                  />
                </label>
              </div>

              <div className="mt-4 flex items-center gap-2 justify-end">
                <button
                  onClick={() => setShowEditModal(false)}
                  className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-2 text-sm font-bold text-slate-300 hover:bg-slate-900 transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={handleEditSave}
                  className="rounded-xl bg-primary-600 px-4 py-2 text-sm font-bold text-white shadow-lg shadow-primary-500/20 hover:bg-primary-500 transition-all"
                >
                  Save changes
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default TicketsPage;
