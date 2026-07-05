import { Check } from 'lucide-react';

export default function Pricing() {
  const plans = [
    { name: "Free", price: "$0", features: ["Unlimited queries", "1 database", "Query history", "Excel export"] },
    { name: "Pro", price: "$29", features: ["Everything in Free", "Unlimited databases", "Team collaboration", "Priority support"], popular: true }
  ];

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold gradient-text">Pricing</h2>
        <p className="text-gray-400 mt-2">Start free, scale as you grow</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
        {plans.map((plan, index) => (
          <div key={index} className={`bg-[#1a1a2e] rounded-2xl p-6 border ${plan.popular ? 'border-[#6C63FF]' : 'border-gray-700'}`}>
            {plan.popular && <div className="text-xs bg-[#6C63FF] text-white px-3 py-1 rounded-full inline-block mb-3">Popular</div>}
            <h3 className="text-xl font-bold text-white">{plan.name}</h3>
            <p className="text-3xl font-bold text-white mt-2">{plan.price}<span className="text-sm text-gray-400">/month</span></p>
            <ul className="space-y-2 mt-4">
              {plan.features.map((feature, i) => (
                <li key={i} className="flex items-center gap-2 text-sm text-gray-300">
                  <Check className="w-4 h-4 text-emerald-400" /> {feature}
                </li>
              ))}
            </ul>
            <button className={`w-full mt-4 py-2 rounded-xl font-medium text-white ${plan.popular ? 'bg-gradient-to-r from-[#6C63FF] to-[#FF6584]' : 'bg-[#1a1a2e] border border-gray-700'}`}>
              {plan.popular ? 'Start Free Trial' : 'Get Started'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}