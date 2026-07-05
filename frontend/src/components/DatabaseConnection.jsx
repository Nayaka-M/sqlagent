import { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { Plus, Server, CheckCircle, Database, Edit2, Trash2, X } from 'lucide-react';

const API_URL = 'http://localhost:3001';

export default function DatabaseConnection({ databases, onRefresh }) {
  const { token } = useAuth();
  const [showForm, setShowForm] = useState(false);
  const [editingDb, setEditingDb] = useState(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    db_name: '',
    db_type: 'postgresql',
    host: 'localhost',
    port: 5432,
    username: 'postgres',
    password: '',
    database_name: 'postgres'
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.db_name || !formData.host || !formData.username || !formData.password || !formData.database_name) {
      toast.error('Please fill in all fields');
      return;
    }

    setLoading(true);
    try {
      if (editingDb) {
        // Update existing database
        await axios.put(`${API_URL}/api/databases/${editingDb.id}`, formData, {
          headers: { Authorization: `Bearer ${token}` }
        });
        toast.success('Database updated successfully! ✅');
      } else {
        // Add new database
        await axios.post(`${API_URL}/api/databases`, formData, {
          headers: { Authorization: `Bearer ${token}` }
        });
        toast.success('Database connected successfully! 🎉');
      }
      
      setShowForm(false);
      setEditingDb(null);
      setFormData({
        db_name: '',
        db_type: 'postgresql',
        host: 'localhost',
        port: 5432,
        username: 'postgres',
        password: '',
        database_name: 'postgres'
      });
      await onRefresh();
    } catch (error) {
      console.error('Error:', error);
      toast.error(error.response?.data?.detail || 'Operation failed');
    }
    setLoading(false);
  };

  const handleEdit = (db) => {
    setEditingDb(db);
    setFormData({
      db_name: db.db_name,
      db_type: db.db_type,
      host: db.host,
      port: db.port,
      username: db.username,
      password: '',  // Password is not shown, user needs to re-enter
      database_name: db.database_name
    });
    setShowForm(true);
  };

  const handleDelete = async (dbId, dbName) => {
    if (!confirm(`Are you sure you want to delete "${dbName}"?`)) return;

    try {
      await axios.delete(`${API_URL}/api/databases/${dbId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success(`"${dbName}" deleted successfully! 🗑️`);
      await onRefresh();
    } catch (error) {
      console.error('Error deleting database:', error);
      toast.error('Failed to delete database');
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingDb(null);
    setFormData({
      db_name: '',
      db_type: 'postgresql',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: '',
      database_name: 'postgres'
    });
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-white">Database Connections</h2>
          <p className="text-sm text-gray-400">{databases.length} databases connected</p>
        </div>
        <button
          onClick={() => {
            setEditingDb(null);
            setFormData({
              db_name: '',
              db_type: 'postgresql',
              host: 'localhost',
              port: 5432,
              username: 'postgres',
              password: '',
              database_name: 'postgres'
            });
            setShowForm(!showForm);
          }}
          className="bg-gradient-to-r from-[#6C63FF] to-[#FF6584] hover:opacity-90 text-white px-5 py-2.5 rounded-xl text-sm font-medium flex items-center gap-2 transition-all"
        >
          <Plus className="w-4 h-4" />
          {editingDb ? 'Edit Database' : 'Add Database'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-[#1a1a2e] rounded-xl p-6 mb-6 border border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">
              {editingDb ? 'Edit Database' : 'Add New Database'}
            </h3>
            <button type="button" onClick={handleCancel} className="text-gray-400 hover:text-white">
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Connection Name</label>
              <input
                type="text"
                name="db_name"
                value={formData.db_name}
                onChange={handleChange}
                placeholder="My Database"
                className="w-full px-4 py-3 bg-[#0F0E17] border border-gray-700 rounded-xl text-white placeholder:text-gray-500 focus:outline-none focus:border-[#6C63FF]"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Database Type</label>
              <select
                name="db_type"
                value={formData.db_type}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-[#0F0E17] border border-gray-700 rounded-xl text-white focus:outline-none focus:border-[#6C63FF]"
              >
                <option value="postgresql">PostgreSQL</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Host</label>
              <input
                type="text"
                name="host"
                value={formData.host}
                onChange={handleChange}
                placeholder="localhost"
                className="w-full px-4 py-3 bg-[#0F0E17] border border-gray-700 rounded-xl text-white placeholder:text-gray-500 focus:outline-none focus:border-[#6C63FF]"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Port</label>
              <input
                type="number"
                name="port"
                value={formData.port}
                onChange={handleChange}
                placeholder="5432"
                className="w-full px-4 py-3 bg-[#0F0E17] border border-gray-700 rounded-xl text-white placeholder:text-gray-500 focus:outline-none focus:border-[#6C63FF]"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Username</label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="postgres"
                className="w-full px-4 py-3 bg-[#0F0E17] border border-gray-700 rounded-xl text-white placeholder:text-gray-500 focus:outline-none focus:border-[#6C63FF]"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder={editingDb ? 'Enter new password (optional)' : '••••••••'}
                className="w-full px-4 py-3 bg-[#0F0E17] border border-gray-700 rounded-xl text-white placeholder:text-gray-500 focus:outline-none focus:border-[#6C63FF]"
                required={!editingDb}
              />
              {editingDb && <p className="text-xs text-gray-500 mt-1">Leave blank to keep current password</p>}
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-300 mb-2">Database Name</label>
              <input
                type="text"
                name="database_name"
                value={formData.database_name}
                onChange={handleChange}
                placeholder="postgres"
                className="w-full px-4 py-3 bg-[#0F0E17] border border-gray-700 rounded-xl text-white placeholder:text-gray-500 focus:outline-none focus:border-[#6C63FF]"
                required
              />
            </div>
          </div>
          <div className="flex gap-3 mt-6">
            <button
              type="submit"
              disabled={loading}
              className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:opacity-90 text-white px-8 py-3 rounded-xl font-medium transition-all disabled:opacity-50"
            >
              {loading ? 'Saving...' : editingDb ? 'Update Database' : 'Connect'}
            </button>
            <button
              type="button"
              onClick={handleCancel}
              className="bg-[#1a1a2e] hover:bg-[#2a2a4e] text-gray-300 px-8 py-3 rounded-xl font-medium transition-all"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {databases.length === 0 ? (
        <div className="text-center py-12">
          <Server className="w-16 h-16 mx-auto text-gray-600" />
          <p className="text-gray-400 mt-4">No database connections yet</p>
          <p className="text-sm text-gray-500">Click "Add Database" to connect</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {databases.map((db) => (
            <div key={db.id} className="bg-[#1a1a2e] border border-emerald-500/30 rounded-xl p-5 hover:shadow-lg transition-all group">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-emerald-500/20 rounded-xl">
                    <Database className="w-5 h-5 text-emerald-400" />
                  </div>
                  <div>
                    <h4 className="font-medium text-white">{db.db_name}</h4>
                    <p className="text-xs text-gray-400">{db.host}:{db.port}/{db.database_name}</p>
                  </div>
                </div>
                <span className="text-xs bg-emerald-500/20 text-emerald-400 px-3 py-1 rounded-full border border-emerald-500/30">
                  {db.db_type} ✓
                </span>
              </div>
              <div className="flex items-center justify-between mt-3">
                <div className="flex items-center gap-4 text-xs text-gray-500">
                  <span>User: {db.username}</span>
                  <span>Added: {new Date(db.created_at).toLocaleDateString()}</span>
                </div>
                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => handleEdit(db)}
                    className="p-1.5 hover:bg-blue-500/20 rounded-lg text-blue-400 hover:text-blue-300 transition"
                    title="Edit"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(db.id, db.db_name)}
                    className="p-1.5 hover:bg-red-500/20 rounded-lg text-red-400 hover:text-red-300 transition"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}