import { useState, useEffect } from 'react';
import axios from 'axios';
import { History, RefreshCw, Search, Clock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const API_URL = 'http://localhost:3001';

export default function LogsPanel() {
  const { token } = useAuth();
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/logs`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setLogs(res.data);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const filteredLogs = logs.filter(log => 
    log.prompt.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.sqlQuery.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-white">Query History</h2>
          <p className="text-sm text-gray-400">{logs.length} queries executed</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
            <input
              type="text"
              placeholder="Search queries..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 pr-4 py-2 bg-[#1a1a2e] border border-gray-700 rounded-xl text-sm text-white placeholder:text-gray-500 focus:outline-none focus:border-[#6C63FF]"
            />
          </div>
          <button
            onClick={fetchLogs}
            className="p-2 hover:bg-[#1a1a2e] rounded-xl transition-all text-gray-400 hover:text-white"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="w-8 h-8 border-2 border-[#6C63FF] border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-gray-400 mt-4">Loading history...</p>
        </div>
      ) : filteredLogs.length === 0 ? (
        <div className="text-center py-12">
          <History className="w-12 h-12 mx-auto text-gray-600" />
          <p className="text-gray-400 mt-4">No queries yet</p>
          <p className="text-sm text-gray-500">Start by asking a question</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredLogs.map((log, index) => (
            <div key={index} className="bg-[#1a1a2e] rounded-xl p-4 hover:border-[#6C63FF]/30 transition-all border border-gray-700/50">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2 text-sm text-gray-300">
                  <span className="font-medium">{log.prompt}</span>
                </div>
                <div className="flex items-center gap-3 text-xs text-gray-500">
                  {log.execution_time && (
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {log.execution_time}ms
                    </span>
                  )}
                  <span>{new Date(log.createdAt).toLocaleString()}</span>
                </div>
              </div>
              <pre className="text-xs font-mono text-emerald-300 bg-black/40 p-3 rounded-lg overflow-auto">
                {log.sqlQuery}
              </pre>
              {log.result && log.result.length > 0 && (
                <div className="mt-2 text-xs text-gray-400">
                  {log.result.length} rows returned
                </div>
              )}
              {log.error && (
                <div className="mt-2 text-xs text-red-400">
                  Error: {log.error}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}