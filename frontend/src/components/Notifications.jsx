import { Bell, X, Check, AlertCircle, Info } from 'lucide-react';

export default function Notifications() {
  const notifications = [
    {
      id: 1,
      title: "Welcome to SQL Agent!",
      message: "Start by connecting your database and asking your first question.",
      type: "info",
      time: "Just now"
    },
    {
      id: 2,
      title: "Query executed successfully",
      message: "Your query returned 15 rows in 45ms.",
      type: "success",
      time: "5 min ago"
    },
    {
      id: 3,
      title: "Database connected",
      message: "Successfully connected to PostgreSQL database.",
      type: "success",
      time: "10 min ago"
    }
  ];

  const getIcon = (type) => {
    switch(type) {
      case 'success': return Check;
      case 'error': return AlertCircle;
      case 'info': return Info;
      default: return Bell;
    }
  };

  const getColor = (type) => {
    switch(type) {
      case 'success': return 'text-emerald-400 bg-emerald-400/10';
      case 'error': return 'text-red-400 bg-red-400/10';
      case 'info': return 'text-blue-400 bg-blue-400/10';
      default: return 'text-gray-400 bg-gray-400/10';
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">Notifications</h2>
        <span className="text-xs text-gray-500">Mark all as read</span>
      </div>

      <div className="space-y-3">
        {notifications.map((notif) => {
          const Icon = getIcon(notif.type);
          return (
            <div key={notif.id} className="bg-[#1a1a2e] rounded-xl p-4 border border-gray-700 flex items-start gap-4">
              <div className={`p-2 rounded-xl ${getColor(notif.type)}`}>
                <Icon className="w-4 h-4" />
              </div>
              <div className="flex-1">
                <div className="flex items-start justify-between">
                  <h4 className="text-white font-medium">{notif.title}</h4>
                  <span className="text-xs text-gray-500">{notif.time}</span>
                </div>
                <p className="text-gray-400 text-sm mt-1">{notif.message}</p>
              </div>
              <button className="text-gray-500 hover:text-white transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}