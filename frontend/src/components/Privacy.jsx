import { Shield, Database, Lock, Eye } from 'lucide-react';

export default function Privacy() {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold gradient-text">Privacy Policy</h2>
        <p className="text-gray-400 mt-2">How we handle your data</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-[#1a1a2e] rounded-xl p-6 border border-gray-700">
          <Shield className="w-6 h-6 text-[#6C63FF] mb-3" />
          <h3 className="text-lg font-semibold text-white">Data We Collect</h3>
          <ul className="text-gray-400 text-sm mt-2 space-y-1">
            <li>• Account info (username, email)</li>
            <li>• Encrypted database credentials</li>
            <li>• Query history</li>
          </ul>
        </div>
        <div className="bg-[#1a1a2e] rounded-xl p-6 border border-gray-700">
          <Database className="w-6 h-6 text-[#FF6584] mb-3" />
          <h3 className="text-lg font-semibold text-white">Data We DO NOT Collect</h3>
          <ul className="text-gray-400 text-sm mt-2 space-y-1">
            <li>• Your actual database data</li>
            <li>• Passwords (only encrypted)</li>
            <li>• Payment information</li>
          </ul>
        </div>
        <div className="bg-[#1a1a2e] rounded-xl p-6 border border-gray-700">
          <Lock className="w-6 h-6 text-emerald-400 mb-3" />
          <h3 className="text-lg font-semibold text-white">Data Security</h3>
          <ul className="text-gray-400 text-sm mt-2 space-y-1">
            <li>• Encrypted connections</li>
            <li>• Secure HTTPS</li>
            <li>• Regular security audits</li>
          </ul>
        </div>
        <div className="bg-[#1a1a2e] rounded-xl p-6 border border-gray-700">
          <Eye className="w-6 h-6 text-[#FF8906] mb-3" />
          <h3 className="text-lg font-semibold text-white">Your Rights</h3>
          <ul className="text-gray-400 text-sm mt-2 space-y-1">
            <li>• Access your data</li>
            <li>• Request deletion</li>
            <li>• Export your data</li>
          </ul>
        </div>
      </div>
    </div>
  );
}