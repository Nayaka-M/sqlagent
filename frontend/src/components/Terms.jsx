import { CheckCircle } from 'lucide-react';

export default function Terms() {
  const terms = [
    "Acceptance of Terms - By using SQL Agent, you agree to these terms.",
    "User Accounts - You are responsible for your account credentials.",
    "Data Privacy - We store only connection details, not your actual data.",
    "Usage Limits - Unlimited queries on the free plan.",
    "Disclaimer - Service provided 'as is' without warranties.",
    "Termination - We reserve the right to suspend access for violations."
  ];

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold gradient-text">Terms & Conditions</h2>
        <p className="text-gray-400 mt-2">Last updated: July 2026</p>
      </div>
      <div className="space-y-3">
        {terms.map((term, index) => (
          <div key={index} className="bg-[#1a1a2e] rounded-xl p-4 border border-gray-700 flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-emerald-400 mt-0.5 flex-shrink-0" />
            <p className="text-gray-300 text-sm">{term}</p>
          </div>
        ))}
      </div>
    </div>
  );
}