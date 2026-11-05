import React from 'react';
import { Receipt, CheckCircle2 } from 'lucide-react';

export default function FareBreakdown({ fareBreakdown }) {
  const {
    adultCount = 0,
    adultRate = 35,
    adultSubtotal = 0,
    childCount = 0,
    childRate = 20,
    childSubtotal = 0,
    seniorCount = 0,
    seniorRate = 18,
    seniorSubtotal = 0,
    totalPayable = 0,
  } = fareBreakdown || {};

  return (
    <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs">
      {/* Title */}
      <div className="flex items-center gap-2 pb-3 border-b border-slate-100 text-slate-800">
        <Receipt className="w-4 h-4 text-[#C8102E]" />
        <h3 className="font-bold text-sm">Fare Breakdown</h3>
      </div>

      {/* Itemized lines */}
      <div className="py-3 space-y-2 text-xs border-b border-slate-100">
        {adultCount > 0 && (
          <div className="flex items-center justify-between text-slate-600">
            <span>
              {adultCount}× Adult Base Fare
            </span>
            <span className="font-semibold text-slate-900">₹{adultSubtotal}</span>
          </div>
        )}

        {childCount > 0 && (
          <div className="flex items-center justify-between text-slate-600">
            <span>
              {childCount}× Child Fare (50% Off)
            </span>
            <span className="font-semibold text-slate-900">₹{childSubtotal}</span>
          </div>
        )}

        {seniorCount > 0 && (
          <div className="flex items-center justify-between text-slate-600">
            <span>
              {seniorCount}× Senior Concession Fare
            </span>
            <span className="font-semibold text-slate-900">₹{seniorSubtotal}</span>
          </div>
        )}

        <div className="flex items-center justify-between text-slate-600">
          <span className="flex items-center gap-1">
            Service & GST
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 inline" />
          </span>
          <span className="font-bold text-emerald-600">₹0 Free</span>
        </div>
      </div>

      {/* Total Payable */}
      <div className="pt-3 flex items-baseline justify-between">
        <div>
          <span className="font-bold text-sm text-slate-900 block">Total Payable</span>
          <span className="text-[10px] text-slate-400">Instant digital ticket delivery</span>
        </div>
        <div className="text-right">
          <span className="text-2xl font-extrabold text-[#C8102E]">
            ₹{totalPayable}
          </span>
        </div>
      </div>
    </div>
  );
}

