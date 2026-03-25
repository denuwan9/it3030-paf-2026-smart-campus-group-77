import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  LayoutDashboard, 
  BookOpen, 
  Settings, 
  AlertCircle, 
  User as UserIcon, 
  Bell, 
  Search, 
  ChevronRight,
  ClipboardList,
  CheckCircle2,
  Clock,
  Menu,
  X
} from 'lucide-react';

const UserDashboard = () => {
  const { user } = useAuth();
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [showNotifications, setShowNotifications] = useState(false);

  const userName = user?.user_metadata?.full_name || user?.user_metadata?.name || 'Student';

  const stats = [
    { label: 'Active Bookings', value: '3', icon: CheckCircle2, color: 'text-green-600', bg: 'bg-green-100' },
    { label: 'Pending Requests', value: '2', icon: Clock, color: 'text-yellow-600', bg: 'bg-yellow-100' },
    { label: 'Open Incidents', value: '1', icon: AlertCircle, color: 'text-red-600', bg: 'bg-red-100' },
  ];

  const recentActivity = [
    { id: 1, type: 'Booking', title: 'Study Room 4B', date: '2026-03-25', status: 'APPROVED' },
    { id: 2, type: 'Incident', title: 'Library AC Malfunction', date: '2026-03-24', status: 'PENDING' },
    { id: 3, type: 'Booking', title: 'Main Auditorium', date: '2026-03-22', status: 'APPROVED' },
    { id: 4, type: 'Booking', title: 'Lab 2 Table 5', date: '2026-03-21', status: 'REJECTED' },
    { id: 5, type: 'Incident', title: 'Broken Window - Block C', date: '2026-03-20', status: 'PENDING' },
  ];

  const notifications = [
    { id: 1, text: 'Booking Approved: Study Room 4B', time: '2h ago', unread: true },
    { id: 2, text: 'Technician assigned to your ticket #1204', time: '4h ago', unread: true },
    { id: 3, text: 'New resource available: Smart Display X2', time: '1d ago', unread: false },
  ];

  const sidebarLinks = [
    { name: 'Dashboard', icon: LayoutDashboard, active: true },
    { name: 'Available Resources', icon: BookOpen },
    { name: 'My Bookings', icon: ClipboardList },
    { name: 'Report an Incident', icon: AlertCircle },
    { name: 'Profile', icon: UserIcon },
  ];

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden font-sans">
      {/* Sidebar */}
      <aside className={`${isSidebarOpen ? 'w-64' : 'w-20'} bg-white border-r border-gray-200 transition-all duration-300 ease-in-out fixed inset-y-0 z-50`}>
        <div className="flex flex-col h-full">
          <div className="h-16 flex items-center px-6 border-b border-gray-100">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center mr-3">
              <span className="text-white font-bold">SC</span>
            </div>
            {isSidebarOpen && <span className="font-bold text-gray-800 text-lg">SmartCampus</span>}
          </div>

          <nav className="flex-1 py-6 space-y-1">
            {sidebarLinks.map((link) => (
              <a 
                key={link.name}
                href="#" 
                className={`flex items-center px-6 py-3 text-sm font-medium transition-colors ${
                  link.active ? 'bg-indigo-50 text-indigo-700 border-r-4 border-indigo-600' : 'text-gray-600 hover:bg-gray-50 hover:text-indigo-600'
                }`}
              >
                <link.icon className={`h-5 w-5 ${link.active ? 'text-indigo-600' : 'text-gray-400'} ${isSidebarOpen ? 'mr-3' : ''}`} />
                {isSidebarOpen && link.name}
              </a>
            ))}
          </nav>

          <div className="p-4 border-t border-gray-100">
            <button
              onClick={() => setSidebarOpen(!isSidebarOpen)}
              className="w-full flex items-center justify-center p-2 rounded-lg hover:bg-gray-100 text-gray-500"
            >
              {isSidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className={`flex-1 transition-all duration-300 ${isSidebarOpen ? 'ml-64' : 'ml-20'} flex flex-col h-full`}>
        {/* Top Navbar */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8 sticky top-0 z-40">
          <div className="flex-1 max-w-md">
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </span>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-gray-50 placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="Search resources, bookings..."
              />
            </div>
          </div>

          <div className="flex items-center space-x-6">
            <div className="relative">
              <button 
                onClick={() => setShowNotifications(!showNotifications)}
                className="p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none relative"
              >
                <Bell className="h-6 w-6" />
                <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-white"></span>
              </button>
              
              {/* Notification Overlay */}
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-50">
                  <div className="px-4 py-2 border-b border-gray-100 flex justify-between items-center">
                    <span className="font-semibold text-gray-800">Recent Notifications</span>
                    <button className="text-xs text-indigo-600 hover:underline">Mark all as read</button>
                  </div>
                  <div className="max-h-64 overflow-y-auto">
                    {notifications.map((notif) => (
                      <div key={notif.id} className={`px-4 py-3 hover:bg-gray-50 cursor-pointer ${notif.unread ? 'bg-indigo-50/30' : ''}`}>
                        <p className="text-sm text-gray-800">{notif.text}</p>
                        <p className="text-xs text-gray-500 mt-1">{notif.time}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="text-right">
                <p className="text-sm font-semibold text-gray-800">{userName}</p>
                <p className="text-xs text-gray-500 uppercase tracking-wider">User role</p>
              </div>
              <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center border-2 border-indigo-200">
                <UserIcon className="h-6 w-6 text-indigo-600" />
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard Content scrolling area */}
        <div className="flex-1 overflow-y-auto p-8">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900">Welcome back, {userName}!</h1>
            <p className="text-gray-500 mt-1">Here's what's happening at the campus hub today.</p>
          </div>

          {/* stats cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {stats.map((stat) => (
              <div key={stat.label} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex items-center space-x-4">
                <div className={`${stat.bg} p-3 rounded-lg`}>
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Recent Activity Section */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
              <h2 className="text-lg font-bold text-gray-800">Recent Activity</h2>
              <button className="text-sm text-indigo-600 font-medium hover:underline flex items-center">
                View All <ChevronRight className="h-4 w-4 ml-1" />
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-gray-50/50 text-gray-500 text-xs uppercase tracking-wider font-semibold">
                  <tr>
                    <th className="px-6 py-3">Reference</th>
                    <th className="px-6 py-3">Type</th>
                    <th className="px-6 py-3">Date</th>
                    <th className="px-6 py-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {recentActivity.map((activity) => (
                    <tr key={activity.id} className="hover:bg-gray-50 transition-colors cursor-pointer text-sm">
                      <td className="px-6 py-4 font-semibold text-gray-800">{activity.title}</td>
                      <td className="px-6 py-4 text-gray-600">{activity.type}</td>
                      <td className="px-6 py-4 text-gray-600">{activity.date}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                          activity.status === 'APPROVED' ? 'bg-green-100 text-green-700' : 
                          activity.status === 'PENDING' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'
                        }`}>
                          {activity.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default UserDashboard;
