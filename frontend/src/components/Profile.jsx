import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  User, Mail, Key, Save, Edit2, X, Check, 
  Database, Clock, BarChart3, Calendar, RefreshCw,
  Lock, Eye, EyeOff
} from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { API_URL } from '../config';

export default function Profile() {
  const { user, token } = useAuth();
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  
  const [profileData, setProfileData] = useState({
    full_name: user?.full_name || '',
    email: user?.email || ''
  });
  
  const [passwordData, setPasswordData] = useState({
    current_password: '',
    new_password: '',
    confirm_password: ''
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/profile/stats`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setStats(res.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.put(
        `${API_URL}/api/profile/update`,
        profileData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success('Profile updated successfully! ✅');
      setIsEditing(false);
      window.location.reload();
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Failed to update profile');
    }
    setLoading(false);
  };

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    if (passwordData.new_password !== passwordData.confirm_password) {
      toast.error('Passwords do not match');
      return;
    }
    if (passwordData.new_password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
    
    setLoading(true);
    try {
      await axios.put(
        `${API_URL}/api/profile/password`,
        {
          current_password: passwordData.current_password,
          new_password: passwordData.new_password
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success('Password updated successfully! ✅');
      setIsChangingPassword(false);
      setPasswordData({ current_password: '', new_password: '', confirm_password: '' });
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Failed to update password');
    }
    setLoading(false);
  };

  const statCards = [
    { 
      icon: BarChart3, 
      label: 'Total Queries', 
      value: stats?.stats?.total_queries || 0,
      color: 'text-[#6C63FF]',
      bg: 'bg-[#6C63FF]/10'
    },
    { 
      icon: Database, 
      label: 'Connected DBs', 
      value: stats?.stats?.total_databases || 0,
      color: 'text-[#FF6584]',
      bg: 'bg-[#FF6584]/10'
    },
    { 
      icon: Clock, 
      label: 'Avg Response', 
      value: stats?.stats?.avg_execution_time ? `${Math.round(stats.stats.avg_execution_time)}ms` : '0ms',
      color: 'text-[#FF8906]',
      bg: 'bg-[#FF8906]/10'
    },
    { 
      icon: Calendar, 
      label: 'Member Since', 
      value: stats?.user?.created_at ? new Date(stats.user.created_at).toLocaleDateString() : 'Today',
      color: 'text-emerald-400',
      bg: 'bg-emerald-400/10'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold gradient-text">Profile</h2>
          <p className="text-gray-400 mt-1">Manage your account settings</p>
        </div>
        <button
          onClick={fetchStats}
          className="p-2 hover:bg-[#1a1a2e] rounded-xl transition-all text-gray-400 hover:text-white"
          title="Refresh"
        >
          <RefreshCw className="w-5 h-5" />
        </button>
      </div>

      <div className="bg-[#1a1a2e] rounded-2xl border border-gray-700 overflow-hidden">
        <div className="h-24 bg-gradient-to-r from-[#6C63FF] to-[#FF6584] opacity-50"></div>
        
        <div className="px-6 pb-6 -mt-12">
          <div className="flex flex-col md:flex-row items-start md:items-end gap-4">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#6C63FF] to-[#FF6584] flex items-center justify-center text-3xl font-bold text-white border-4 border-[#1a1a2e] shadow-xl">
              {user?.full_name?.[0] || user?.username?.[0] || 'U'}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3">
                <h3 className="text-2xl font-bold text-white">{user?.full_name || user?.username}</h3>
                <span className="text-xs bg-emerald-500/20 text-emerald-400 px-3 py-1 rounded-full border border-emerald-500/30">
                  Active
                </span>
              </div>
              <p className="text-gray-400">{user?.email}</p>
              <p className="text-xs text-gray-500">@{user?.username}</p>
            </div>
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="px-4 py-2 bg-[#6C63FF] hover:bg-[#5a52d5] rounded-xl text-white text-sm font-medium flex items-center gap-2 transition"
            >
              <Edit2 className="w-4 h-4" />
              Edit Profile
            </button>
          </div>
        </div>
      </div>

      {isEditing && (
        <div className="bg-[#1a1a2e] rounded-2xl border border-[#6C63FF]/30 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">Edit Profile</h3>
            <button
              onClick={() => setIsEditing(false)}
              className="text-gray-400 hover:text-white transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <form onSubmit={handleProfileUpdate} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Full Name</label>
              <div className="relative">
                <User className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                <input
                  type="text"
                  value={profileData.full_name}
                  onChange={(e) => setProfileData({ ...profileData, full_name: e.target.value })}
                  className="w-full pl-11 pr-4 py-3 bg-[#0F0E17] border border-gray-700 rounded-xl text-white placeholder:text-gray-500 focus:outline-none focus:border-[#6C63FF]"
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
              <div className="relative">
                <Mail className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                <input
                  type="email"
                  value={profileData.email}
                  onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                  className="w-full pl-11 pr-4 py-3 bg-[#0F0E17] border border-gray-700 rounded-xl text-white placeholder:text-gray-500 focus:outline-none focus:border-[#6C63FF]"
                  required
                />
              </div>
            </div>
            <div className="flex gap-3">
              <button
                type="submit"
                disabled={loading}
                className="bg-gradient-to-r from-[#6C63FF] to-[#FF6584] hover:opacity-90 disabled:opacity-50 text-white px-6 py-2.5 rounded-xl font-medium flex items-center gap-2 transition"
              >
                {loading ? 'Saving...' : <><Save className="w-4 h-4" /> Save Changes</>}
              </button>
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="bg-[#1a1a2e] hover:bg-[#2a2a4e] text-gray-300 px-6 py-2.5 rounded-xl font-medium transition"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {statCards.map((stat, index) => (
          <div key={index} className="bg-[#1a1a2e] rounded-xl p-5 border border-gray-700">
            <div className="flex items-center gap-3">
              <div className={`p-3 rounded-xl ${stat.bg}`}>
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{stat.value}</p>
                <p className="text-xs text-gray-400">{stat.label}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {stats?.stats?.recent_queries && stats.stats.recent_queries.length > 0 && (
        <div className="bg-[#1a1a2e] rounded-2xl border border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Recent Queries</h3>
          <div className="space-y-3">
            {stats.stats.recent_queries.slice(0, 5).map((query, index) => (
              <div key={index} className="bg-[#0F0E17] rounded-xl p-4 border border-gray-700/50">
                <p className="text-gray-300 text-sm">{query.prompt}</p>
                <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
                  <span>{new Date(query.created_at).toLocaleString()}</span>
                  {query.execution_time && (
                    <span>⚡ {query.execution_time}ms</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="bg-[#1a1a2e] rounded-2xl border border-gray-700 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Lock className="w-5 h-5 text-[#6C63FF]" />
            <div>
              <h3 className="text-lg font-semibold text-white">Password</h3>
              <p className="text-sm text-gray-400">Change your password</p>
            </div>
          </div>
          <button
            onClick={() => setIsChangingPassword(!isChangingPassword)}
            className="text-[#6C63FF] hover:text-[#FF6584] transition font-medium text-sm"
          >
            {isChangingPassword ? 'Cancel' : 'Change Password'}
          </button>
        </div>

        {isChangingPassword && (
          <form onSubmit={handlePasswordUpdate} className="mt-4 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Current Password</label>
              <div className="relative">
                <Key className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                <input
                  type={showCurrentPassword ? 'text' : 'password'}
                  value={passwordData.current_password}
                  onChange={(e) => setPasswordData({ ...passwordData, current_password: e.target.value })}
                  className="w-full pl-11 pr-12 py-3 bg-[#0F0E17] border border-gray-700 rounded-xl text-white placeholder:text-gray-500 focus:outline-none focus:border-[#6C63FF]"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition"
                >
                  {showCurrentPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">New Password</label>
              <div className="relative">
                <Lock className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                <input
                  type={showNewPassword ? 'text' : 'password'}
                  value={passwordData.new_password}
                  onChange={(e) => setPasswordData({ ...passwordData, new_password: e.target.value })}
                  className="w-full pl-11 pr-12 py-3 bg-[#0F0E17] border border-gray-700 rounded-xl text-white placeholder:text-gray-500 focus:outline-none focus:border-[#6C63FF]"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition"
                >
                  {showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Confirm New Password</label>
              <div className="relative">
                <Check className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                <input
                  type="password"
                  value={passwordData.confirm_password}
                  onChange={(e) => setPasswordData({ ...passwordData, confirm_password: e.target.value })}
                  className="w-full pl-11 pr-4 py-3 bg-[#0F0E17] border border-gray-700 rounded-xl text-white placeholder:text-gray-500 focus:outline-none focus:border-[#6C63FF]"
                  required
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="bg-gradient-to-r from-[#FF6584] to-[#e55575] hover:opacity-90 disabled:opacity-50 text-white px-6 py-2.5 rounded-xl font-medium flex items-center gap-2 transition"
            >
              {loading ? 'Updating...' : <><Save className="w-4 h-4" /> Update Password</>}
            </button>
          </form>
        )}
      </div>

      <div className="bg-[#1a1a2e] rounded-2xl border border-gray-700 p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Account Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div className="flex items-center justify-between py-2 border-b border-gray-700/50">
            <span className="text-gray-400">Username</span>
            <span className="text-white">{user?.username}</span>
          </div>
          <div className="flex items-center justify-between py-2 border-b border-gray-700/50">
            <span className="text-gray-400">User ID</span>
            <span className="text-gray-400 font-mono text-xs">{user?.id?.slice(0, 12)}...</span>
          </div>
          <div className="flex items-center justify-between py-2 border-b border-gray-700/50">
            <span className="text-gray-400">Member Since</span>
            <span className="text-white">{stats?.user?.created_at ? new Date(stats.user.created_at).toLocaleDateString() : 'N/A'}</span>
          </div>
          <div className="flex items-center justify-between py-2 border-b border-gray-700/50">
            <span className="text-gray-400">Total Queries</span>
            <span className="text-white">{stats?.stats?.total_queries || 0}</span>
          </div>
          <div className="flex items-center justify-between py-2 border-b border-gray-700/50">
            <span className="text-gray-400">Connected Databases</span>
            <span className="text-white">{stats?.stats?.total_databases || 0}</span>
          </div>
          <div className="flex items-center justify-between py-2 border-b border-gray-700/50">
            <span className="text-gray-400">Avg Response Time</span>
            <span className="text-white">{stats?.stats?.avg_execution_time ? `${Math.round(stats.stats.avg_execution_time)}ms` : 'N/A'}</span>
          </div>
        </div>
      </div>
    </div>
  );
}