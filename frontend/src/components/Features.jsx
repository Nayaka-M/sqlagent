import { 
  Zap, Database, Shield, Globe, FileSpreadsheet, Clock, 
  Sparkles, BarChart3, Download, RefreshCw, Bell
} from 'lucide-react';

export default function Features() {
  const features = [
    { 
      icon: Sparkles, 
      title: "AI-Powered SQL", 
      desc: "Natural language to SQL using Google Gemini AI",
      color: "text-purple-400",
      badge: "AI"
    },
    { 
      icon: Database, 
      title: "Any Database", 
      desc: "Connect to PostgreSQL, MySQL and more",
      color: "text-blue-400",
      badge: "New"
    },
    { 
      icon: Globe, 
      title: "Global Access", 
      desc: "Access your data from anywhere in the world",
      color: "text-emerald-400",
      badge: "New"
    },
    { 
      icon: FileSpreadsheet, 
      title: "Export to Excel", 
      desc: "Export query results to Excel with one click",
      color: "text-green-400",
      badge: "Popular"
    },
    { 
      icon: Download, 
      title: "Data Export", 
      desc: "Download data in CSV, Excel, and JSON formats",
      color: "text-cyan-400",
      badge: "New"
    },
    { 
      icon: Shield, 
      title: "Secure & Private", 
      desc: "Your data stays with you. Encrypted connections",
      color: "text-red-400",
      badge: "Secure"
    },
    { 
      icon: Clock, 
      title: "Query History", 
      desc: "All queries saved automatically. Review and reuse",
      color: "text-yellow-400",
      badge: "History"
    },
    { 
      icon: RefreshCw, 
      title: "Real-Time Updates", 
      desc: "Live notifications and real-time query execution",
      color: "text-indigo-400",
      badge: "Live"
    },
    { 
      icon: Bell, 
      title: "Instant Notifications", 
      desc: "Get real-time alerts for query status and updates",
      color: "text-pink-400",
      badge: "New"
    },
  ];

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold gradient-text">Features</h2>
        <p className="text-gray-400 mt-2">Everything you need to query your database with AI</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {features.map((feature, index) => (
          <div 
            key={index} 
            className="bg-[#1a1a2e] rounded-xl p-6 border border-gray-700 hover:border-[#6C63FF]/50 transition-all group"
          >
            <div className="flex items-center justify-between mb-3">
              <div className={`p-3 rounded-xl ${feature.color} bg-opacity-10`}>
                <feature.icon className={`w-6 h-6 ${feature.color}`} />
              </div>
              {feature.badge && (
                <span className="text-[10px] bg-[#6C63FF]/20 text-[#6C63FF] px-2 py-1 rounded-full">
                  {feature.badge}
                </span>
              )}
            </div>
            <h3 className="text-lg font-semibold text-white">{feature.title}</h3>
            <p className="text-gray-400 text-sm mt-2">{feature.desc}</p>
          </div>
        ))}
      </div>

      {/* Export Data Section */}
      <div className="bg-gradient-to-r from-[#6C63FF]/10 to-[#FF6584]/10 rounded-2xl p-6 border border-[#6C63FF]/20 mt-6">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-[#6C63FF]/20 rounded-xl">
            <FileSpreadsheet className="w-8 h-8 text-[#6C63FF]" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">Export Data in Multiple Formats</h3>
            <p className="text-gray-400 text-sm">
              Download your query results as Excel (.xlsx), CSV, or JSON with one click
            </p>
            <div className="flex gap-3 mt-3">
              <span className="text-xs bg-green-500/20 text-green-400 px-3 py-1 rounded-full">Excel</span>
              <span className="text-xs bg-blue-500/20 text-blue-400 px-3 py-1 rounded-full">CSV</span>
              <span className="text-xs bg-yellow-500/20 text-yellow-400 px-3 py-1 rounded-full">JSON</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}