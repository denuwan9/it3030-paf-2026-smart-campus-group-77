import React, { useEffect, useState } from 'react';
import { userService } from '../services/api';
import { useAuth } from '../context/AuthContext';

const ProfilePage = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [preferences, setPreferences] = useState({ theme: 'light', notificationsEnabled: true });
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  useEffect(() => {
    userService.getCurrentUser()
      .then(res => {
        setProfile(res.data);
        if (res.data.preferences) {
          setPreferences(res.data.preferences);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const handleUpdatePreferences = (e) => {
    e.preventDefault();
    userService.updatePreferences(preferences)
      .then(() => setMessage('Preferences updated successfully!'))
      .catch(() => setMessage('Failed to update preferences.'));
  };

  if (loading) return <div className="p-8">Loading profile...</div>;

  return (
    <div className="max-w-2xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">Your Profile</h1>
      
      {profile && (
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <p className="text-gray-600"><strong>Name:</strong> {profile.name}</p>
          <p className="text-gray-600"><strong>Email:</strong> {profile.email}</p>
          <p className="text-gray-600"><strong>Role:</strong> {profile.role}</p>
        </div>
      )}

      <h2 className="text-2xl font-semibold mb-4">User Preferences</h2>
      <form onSubmit={handleUpdatePreferences} className="space-y-4 bg-gray-50 p-6 rounded-lg">
        <div>
          <label className="block text-sm font-medium text-gray-700">Theme</label>
          <select 
            value={preferences.theme}
            onChange={(e) => setPreferences({...preferences, theme: e.target.value})}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="light">Light</option>
            <option value="dark">Dark</option>
          </select>
        </div>

        <div className="flex items-center">
          <input 
            type="checkbox"
            checked={preferences.notificationsEnabled}
            onChange={(e) => setPreferences({...preferences, notificationsEnabled: e.target.checked})}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label className="ml-2 block text-sm text-gray-900">Enable Notifications</label>
        </div>

        <button 
          type="submit"
          className="w-full py-2 px-4 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition"
        >
          Save Preferences
        </button>
      </form>

      {message && <p className="mt-4 text-center font-medium text-green-600">{message}</p>}
    </div>
  );
};

export default ProfilePage;
