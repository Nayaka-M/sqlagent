import { Globe, Database, Sparkles, Shield, Users } from 'lucide-react';

export default function About() {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold gradient-text">About SQL Agent</h2>
        <p className="text-gray-400 mt-2">Your Global AI-Powered SQL Assistant</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-[#1a1a2e] rounded-xl p-6 border border-gray-700">
          <Globe className="w-6 h-6 text-[#6C63FF] mb-3" />
          <h3 className="text-lg font-semibold text-white">Global Access</h3>
          <p className="text-gray-400 text-sm">Connect from anywhere in the world</p>
        </div>
        <div className="bg-[#1a1a2e] rounded-xl p-6 border border-gray-700">
          <Database className="w-6 h-6 text-[#FF6584] mb-3" />
          <h3 className="text-lg font-semibold text-white">Any Database</h3>
          <p className="text-gray-400 text-sm">PostgreSQL, MySQL, and more</p>
        </div>
        <div className="bg-[#1a1a2e] rounded-xl p-6 border border-gray-700">
          <Sparkles className="w-6 h-6 text-[#FF8906] mb-3" />
          <h3 className="text-lg font-semibold text-white">AI-Powered</h3>
          <p className="text-gray-400 text-sm">Natural language to SQL</p>
        </div>
        <div className="bg-[#1a1a2e] rounded-xl p-6 border border-gray-700">
          <Shield className="w-6 h-6 text-emerald-400 mb-3" />
          <h3 className="text-lg font-semibold text-white">Secure & Private</h3>
          <p className="text-gray-400 text-sm">Your data stays with you</p>
        </div>
      </div>
    </div>
  );
}