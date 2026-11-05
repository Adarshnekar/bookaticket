import React from 'react';
import { Smartphone, CreditCard, Landmark, Check } from 'lucide-react';

export default function PaymentSelector({ selectedMethod, onSelectMethod }) {
  const paymentMethods = [
    {
      id: 'UPI Instant',
      title: 'UPI Instant',
      badge: 'Fast',
      badgeColor: 'bg-emerald-100 text-emerald-700',
      description: 'GPay, PhonePe, Paytm, BHIM',
      icon: Smartphone,
      iconBg: 'bg-emerald-100 text-emerald-600',
    },
    {
      id: 'BMTC Smart Card / Pass',
      title: 'BMTC Smart Card / Pass',
      description: 'Tap & Pay or Namma Pass ID',
      icon: CreditCard,
      iconBg: 'bg-blue-100 text-blue-600',
    },
    {
      id: 'Cards / Net Banking',
      title: 'Cards / Net Banking',
      description: 'Visa, Mastercard, RuPay',
      icon: Landmark,
      iconBg: 'bg-slate-100 text-slate-700',
    },
  ];

  return (
    <div className="space-y-3">
      <h3 className="font-bold text-sm text-slate-900">Payment Method</h3>

      <div className="space-y-2.5">
        {paymentMethods.map((method) => {
          const isSelected = selectedMethod === method.id;
          const Icon = method.icon;

          return (
            <div
              key={method.id}
              onClick={() => onSelectMethod(method.id)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  onSelectMethod(method.id);
                }
              }}
              className={`p-3.5 rounded-2xl flex items-center justify-between cursor-pointer border transition-all duration-150 ${
                isSelected
                  ? 'bg-white border-red-400 ring-2 ring-red-100 shadow-sm'
                  : 'bg-white border-slate-200/80 hover:border-slate-300'
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center ${method.iconBg}`}
                >
                  <Icon className="w-5 h-5" />
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 text-sm">
                      {method.title}
                    </span>
                    {method.badge && (
                      <span
                        className={`text-[10px] font-bold px-1.5 py-0.2 rounded ${method.badgeColor}`}
                      >
                        {method.badge}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">{method.description}</p>
                </div>
              </div>

              {/* Radio Indicator */}
              <div
                className={`w-5 h-5 rounded-full flex items-center justify-center transition-all ${
                  isSelected
                    ? 'border-2 border-[#C8102E] bg-white'
                    : 'border-2 border-slate-200 bg-white'
                }`}
              >
                {isSelected && (
                  <div className="w-2.5 h-2.5 rounded-full bg-[#C8102E]" />
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

