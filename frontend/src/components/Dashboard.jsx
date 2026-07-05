import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { API_URL } from '../config';
import Sidebar from './Sidebar';
import QueryInterface from './QueryInterface';
import LogsPanel from './LogsPanel';
import DatabaseConnection from './DatabaseConnection';
import Profile from './Profile';
import About from './About';
import Terms from './Terms';
import Privacy from './Privacy';
import Features from './Features';
import FAQ from './FAQ';
import Contact from './Contact';
import Support from './Support';
import RealTimeNotifications from './RealTimeNotifications';
import axios from 'axios';

export default function Dashboard() {
  const { user, logout, token } = useAuth();
  const [activeTab, setActiveTab] = useState('query');
  const [databases, setDatabases] = useState([]);
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    fetchDatabases();
    fetchProfile();
  }, []);

  const fetchDatabases = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/databases`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setDatabases(res.data);
    } catch (error) {
      console.error('Error fetching databases:', error);
    }
  };

  const fetchProfile = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/profile`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProfile(res.data);
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  return (
    <div className="flex min-h-screen bg-[#0F0E17]">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      <div className="flex-1 overflow-auto">
        <header className="glass sticky top-0 z-50 border-b border-gray-800 px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-white">
                {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
              </h2>
              <p className="text-xs text-gray-400">
                {profile ? `${profile.total_queries || 0} total queries` : 'Loading...'}
              </p>
            </div>
            <div className="flex items-center gap-4">
              <RealTimeNotifications />
              <div className="flex items-center gap-2 text-xs text-gray-400">
                <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></span>
                Connected
              </div>
            </div>
          </div>
        </header>

        <div className="p-8">
          {activeTab === 'query' && <QueryInterface databases={databases} />}
          {activeTab === 'history' && <LogsPanel />}
          {activeTab === 'databases' && (
            <DatabaseConnection 
              databases={databases} 
              onRefresh={fetchDatabases}
            />
          )}
          {activeTab === 'profile' && <Profile />}
          {activeTab === 'features' && <Features />}
          {activeTab === 'faq' && <FAQ />}
          {activeTab === 'contact' && <Contact />}
          {activeTab === 'support' && <Support />}
          {activeTab === 'about' && <About />}
          {activeTab === 'terms' && <Terms />}
          {activeTab === 'privacy' && <Privacy />}
        </div>
      </div>
    </div>
  );
}