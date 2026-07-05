import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    { q: "What is SQL Query Agent?", a: "AI-powered tool that converts natural language to SQL." },
    { q: "Do I need to install anything?", a: "No! Just open your browser and start querying." },
    { q: "Is my data secure?", a: "Yes! All credentials are encrypted." },
    { q: "What databases are supported?", a: "PostgreSQL and MySQL." },
    { q: "Can I export my data?", a: "Yes! Export to Excel with one click." },
    { q: "Is there a free plan?", a: "Yes! The Free plan includes unlimited queries." }
  ];

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold gradient-text">FAQ</h2>
        <p className="text-gray-400 mt-2">Frequently asked questions</p>
      </div>
      <div className="space-y-3">
        {faqs.map((faq, index) => (
          <div key={index} className="bg-[#1a1a2e] rounded-xl border border-gray-700 overflow-hidden">
            <button
              onClick={() => setOpenIndex(openIndex === index ? null : index)}
              className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-[#2a2a4e] transition-all"
            >
              <span className="text-white font-medium">{faq.q}</span>
              {openIndex === index ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
            </button>
            {openIndex === index && <div className="px-6 pb-4 text-gray-400 text-sm">{faq.a}</div>}
          </div>
        ))}
      </div>
    </div>
  );
}