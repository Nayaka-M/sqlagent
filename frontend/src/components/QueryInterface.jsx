import { useState } from 'react';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import { Send, Loader2, Sparkles, Copy, Check, FileSpreadsheet } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const API_URL = 'https://sql-query-agent-backend.onrender.com';

export default function QueryInterface({ databases }) {
  const { token } = useAuth();
  const [prompt, setPrompt] = useState('');
  const [selectedDb, setSelectedDb] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [copied, setCopied] = useState(false);
  const [exporting, setExporting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!prompt.trim()) {
      toast.error('Please enter a question');
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post(
        `${API_URL}/api/query`,
        { 
          prompt: prompt,
          db_id: selectedDb || null
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setResult(res.data);
      if (res.data.success) {
        toast.success('Query executed successfully!');
      } else {
        toast.error(res.data.error || 'Query execution failed');
      }
      setPrompt('');
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Failed to process query');
    }
    setLoading(false);
  };

  const copyToClipboard = () => {
    if (result?.sqlQuery) {
      navigator.clipboard.writeText(result.sqlQuery);
      setCopied(true);
      toast.success('Copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const exportToExcel = async () => {
    if (!result || !result.result || result.result.length === 0) {
      toast.error('No data to export');
      return;
    }

    setExporting(true);
    try {
      const data = {
        columns: Object.keys(result.result[0]),
        rows: result.result
      };

      const response = await axios.post(
        `${API_URL}/api/export/excel`,
        data,
        {
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          responseType: 'blob'
        }
      );

      const blob = new Blob([response.data], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `query_results_${new Date().toISOString().slice(0, 10)}.xlsx`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast.success('Excel file downloaded successfully! 📊');
    } catch (error) {
      console.error('Export error:', error);
      toast.error('Failed to export to Excel');
    }
    setExporting(false);
  };

  const examples = [
    "Show me all users",
    "Get total revenue from orders",
    "List top 5 customers",
    "Find products out of stock"
  ];

  return (
    <div>
      <Toaster position="top-center" />
      
      <div>
        <h2 className="text-2xl font-bold text-white mb-2">Ask in Natural Language</h2>
        <p className="text-gray-400 text-sm mb-6">AI will generate and execute SQL</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Type your question in plain English..."
            className="w-full min-h-[100px] bg-[#1a1a2e] border border-gray-700 rounded-xl p-4 text-white placeholder:text-gray-500 focus:outline-none focus:border-[#6C63FF] focus:ring-2 focus:ring-[#6C63FF]/20 transition-all resize-none"
          />

          <div className="flex flex-wrap gap-2">
            {examples.map((example, index) => (
              <button
                key={index}
                type="button"
                onClick={() => setPrompt(example)}
                className="text-xs px-4 py-2 bg-[#1a1a2e] hover:bg-[#2a2a4e] border border-gray-700 rounded-full text-gray-400 hover:text-white transition-all"
              >
                {example}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap gap-3">
            <select
              value={selectedDb}
              onChange={(e) => setSelectedDb(e.target.value)}
              className="px-4 py-2.5 bg-[#1a1a2e] border border-gray-700 rounded-xl text-white focus:outline-none focus:border-[#6C63FF] min-w-[180px]"
            >
              <option value="">All Databases</option>
              {databases.map((db) => (
                <option key={db.id} value={db.id}>
                  {db.db_name}
                </option>
              ))}
            </select>

            <button
              type="submit"
              disabled={loading || !prompt.trim()}
              className="flex-1 bg-gradient-to-r from-[#6C63FF] to-[#5a52d5] hover:opacity-90 disabled:opacity-50 text-white py-2.5 rounded-xl font-medium flex items-center justify-center gap-2 transition-all"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  Generate & Execute
                  <Send className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </form>

        {result && (
          <div className="mt-6 space-y-4">
            {/* SQL Query */}
            <div className="bg-[#1a1a2e] rounded-xl p-4 border border-gray-700">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-[#6C63FF] flex items-center gap-2">
                  Generated SQL
                </h3>
                <button
                  onClick={copyToClipboard}
                  className="text-gray-400 hover:text-white transition"
                >
                  {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
              <pre className="text-sm font-mono text-emerald-300 bg-black/40 p-4 rounded-lg overflow-auto">
                {result.sqlQuery}
              </pre>
            </div>

            {/* Results */}
            {result.result && result.result.length > 0 && (
              <div className="border border-gray-700 rounded-xl overflow-hidden">
                <div className="bg-[#1a1a2e] px-4 py-2 text-sm font-medium text-gray-300 flex items-center justify-between">
                  <span>Results ({result.row_count} rows)</span>
                  <button
                    onClick={exportToExcel}
                    disabled={exporting}
                    className="flex items-center gap-2 bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white px-4 py-1.5 rounded-lg text-xs font-medium transition-all"
                  >
                    {exporting ? (
                      <>
                        <Loader2 className="w-3 h-3 animate-spin" />
                        Exporting...
                      </>
                    ) : (
                      <>
                        <FileSpreadsheet className="w-3 h-3" />
                        Export to Excel
                      </>
                    )}
                  </button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-[#0f0e17]">
                      <tr>
                        {Object.keys(result.result[0]).map((key) => (
                          <th key={key} className="px-4 py-3 text-left text-gray-400 border-b border-gray-700">
                            {key}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {result.result.slice(0, 20).map((row, i) => (
                        <tr key={i} className="hover:bg-[#1a1a2e]">
                          {Object.values(row).map((val, j) => (
                            <td key={j} className="px-4 py-3 border-b border-gray-700 text-gray-300">
                              {val !== null ? String(val) : <span className="text-gray-500">NULL</span>}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {result.row_count > 20 && (
                    <div className="px-4 py-2 text-sm text-gray-500 bg-[#1a1a2e]">
                      Showing first 20 of {result.row_count} rows
                    </div>
                  )}
                </div>
              </div>
            )}

            {result.error && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 text-red-400 text-sm">
                Error: {result.error}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}