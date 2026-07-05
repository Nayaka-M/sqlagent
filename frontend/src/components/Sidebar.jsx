import { 
  Database, Sparkles, History, Server, 
  Zap, HelpCircle, MessageCircle, 
  LifeBuoy, Info, FileText, Shield,
  Settings, LogOut, User
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Sidebar({ activeTab, setActiveTab }) {
  const { user, logout } = useAuth();

  const mainItems = [
    { id: 'query', label: 'New Query', icon: Sparkles },
    { id: 'history', label: 'History', icon: History },
    { id: 'databases', label: 'Databases', icon: Server },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  const featureItems = [
    { id: 'features', label: 'Features', icon: Zap },
    { id: 'faq', label: 'FAQ', icon: HelpCircle },
  ];

  const supportItems = [
    { id: 'contact', label: 'Contact', icon: MessageCircle },
    { id: 'support', label: 'Support', icon: LifeBuoy },
    { id: 'about', label: 'About', icon: Info },
    { id: 'terms', label: 'Terms', icon: FileText },
    { id: 'privacy', label: 'Privacy', icon: Shield },
  ];

  return (
    <div className="w-64 min-h-screen bg-[#0F0E17] border-r border-gray-800 flex flex-col sticky top-0">
      <div className="px-4 py-6 border-b border-gray-800">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-r from-[#6C63FF] to-[#FF6584] p-2 rounded-xl">
            <Database className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-white">SQL Agent</h1>
            <p className="text-[10px] text-gray-400">AI-Powered SQL</p>
          </div>
        </div>
      </div>

      <div className="px-4 py-4 border-b border-gray-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[#6C63FF] to-[#FF6584] flex items-center justify-center text-white font-bold text-sm">
            {user?.full_name?.[0] || user?.username?.[0] || 'U'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">{user?.full_name || user?.username}</p>
            <p className="text-xs text-gray-400 truncate">{user?.email}</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 px-3 py-4 overflow-y-auto">
        <div className="mb-6">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-3 mb-2">Main</p>
          {mainItems.map((item) => (
            <SidebarItem
              key={item.id}
              icon={item.icon}
              label={item.label}
              active={activeTab === item.id}
              onClick={() => setActiveTab(item.id)}
            />
          ))}
        </div>

        <div className="mb-6">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-3 mb-2">Features</p>
          {featureItems.map((item) => (
            <SidebarItem
              key={item.id}
              icon={item.icon}
              label={item.label}
              active={activeTab === item.id}
              onClick={() => setActiveTab(item.id)}
            />
          ))}
        </div>

        <div className="mb-6">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-3 mb-2">Support</p>
          {supportItems.map((item) => (
            <SidebarItem
              key={item.id}
              icon={item.icon}
              label={item.label}
              active={activeTab === item.id}
              onClick={() => setActiveTab(item.id)}
            />
          ))}
        </div>

        <div className="border-t border-gray-800 pt-4">
          <SidebarItem
            icon={Settings}
            label="Settings"
            onClick={() => {}}
          />
          <SidebarItem
            icon={LogOut}
            label="Logout"
            onClick={logout}
            danger
          />
        </div>
      </nav>

      <div className="px-4 py-3 border-t border-gray-800">
        <p className="text-[10px] text-gray-500 text-center">Version 2.0.0</p>
      </div>
    </div>
  );
}

function SidebarItem({ icon: Icon, label, active, onClick, danger }) {
  return (
    <button
      onClick={onClick}
      className={`
        w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all
        ${active 
          ? 'bg-gradient-to-r from-[#6C63FF] to-[#FF6584] text-white shadow-lg shadow-[#6C63FF]/20' 
          : danger
            ? 'text-red-400 hover:bg-red-500/10 hover:text-red-300'
            : 'text-gray-400 hover:text-white hover:bg-[#1a1a2e]'
        }
      `}
    >
      <Icon className="w-5 h-5" />
      <span>{label}</span>
    </button>
  );
}