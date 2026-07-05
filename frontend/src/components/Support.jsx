import { BookOpen, Video, MessageCircle, FileText, HelpCircle, Settings, Code } from 'lucide-react';

export default function Support() {
  const resources = [
    { icon: BookOpen, title: "Documentation", desc: "Detailed guides" },
    { icon: Video, title: "Video Tutorials", desc: "Step-by-step videos" },
    { icon: MessageCircle, title: "Community", desc: "Connect with users" },
    { icon: FileText, title: "Blog", desc: "Latest updates" },
    { icon: HelpCircle, title: "FAQ", desc: "Common questions" },
    { icon: Settings, title: "API Reference", desc: "Complete API docs" },
  ];

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold gradient-text">Support Center</h2>
        <p className="text-gray-400 mt-2">Everything you need to get started</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {resources.map((resource, index) => (
          <div key={index} className="bg-[#1a1a2e] rounded-xl p-6 border border-gray-700 text-center hover:border-[#6C63FF]/50 transition-all">
            <resource.icon className="w-6 h-6 mx-auto text-[#6C63FF] mb-3" />
            <h3 className="text-white font-medium">{resource.title}</h3>
            <p className="text-gray-400 text-xs mt-1">{resource.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}