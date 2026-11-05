import React from 'react';
import { User, ShieldCheck } from 'lucide-react';

export default function PassengerForm({
  passenger,
  index,
  total,
  onUpdate,
  errors = {},
}) {
  const isPrimary = index === 0;

  const getRoleLabel = () => {
    if (isPrimary) return 'Primary Passenger';
    if (passenger.type === 'Child') return 'Child Passenger';
    if (passenger.type === 'Senior') return 'Senior Passenger';
    return 'Co-Passenger';
  };

  const getBadgeStyle = () => {
    if (passenger.type === 'Child') {
      return 'bg-blue-100 text-blue-700 border-blue-200';
    }
    if (passenger.type === 'Senior') {
      return 'bg-amber-100 text-amber-800 border-amber-200';
    }
    return 'bg-emerald-100 text-emerald-800 border-emerald-200';
  };

  return (
    <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs relative">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div
            className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
              isPrimary
                ? 'bg-red-100 text-[#C8102E]'
                : 'bg-slate-100 text-slate-700'
            }`}
          >
            {index + 1}
          </div>
          <span className="font-bold text-sm text-slate-800">{getRoleLabel()}</span>
        </div>

        <span
          className={`text-[11px] font-semibold px-2 py-0.5 rounded-full border ${getBadgeStyle()}`}
        >
          {passenger.type || 'Adult'}
        </span>
      </div>

      {/* Form Fields */}
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 text-xs">
        {/* Full Name */}
        <div className="sm:col-span-8">
          <label className="block text-slate-500 font-medium mb-1">
            Full Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={passenger.fullName || ''}
            onChange={(e) => onUpdate('fullName', e.target.value)}
            placeholder="e.g. Rohan Sharma"
            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#C8102E]/30 focus:border-[#C8102E] transition-all"
          />
        </div>

        {/* Age */}
        <div className="sm:col-span-4">
          <label className="block text-slate-500 font-medium mb-1">
            Age <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            min="1"
            max="120"
            value={passenger.age || ''}
            onChange={(e) => onUpdate('age', e.target.value)}
            placeholder="Age"
            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#C8102E]/30 focus:border-[#C8102E] transition-all"
          />
        </div>

        {/* Gender */}
        <div className={isPrimary ? 'sm:col-span-5' : 'sm:col-span-12'}>
          <label className="block text-slate-500 font-medium mb-1">
            Gender <span className="text-red-500">*</span>
          </label>
          <select
            value={passenger.gender || 'Male'}
            onChange={(e) => onUpdate('gender', e.target.value)}
            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#C8102E]/30 focus:border-[#C8102E] transition-all"
          >
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
        </div>

        {/* Mobile Number (for primary passenger) */}
        {isPrimary && (
          <div className="sm:col-span-7">
            <label className="block text-slate-500 font-medium mb-1">
              Mobile Number (+91) <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <span className="absolute left-3 top-2 text-slate-400 font-medium">+91</span>
              <input
                type="tel"
                maxLength="10"
                value={passenger.mobile ? passenger.mobile.replace('+91', '').trim() : ''}
                onChange={(e) => {
                  const val = e.target.value.replace(/\D/g, '');
                  onUpdate('mobile', val);
                }}
                placeholder="98450 12345"
                className="w-full pl-11 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#C8102E]/30 focus:border-[#C8102E] transition-all"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

