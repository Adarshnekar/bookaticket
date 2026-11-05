import React from 'react';
import { Minus, Plus } from 'lucide-react';

export default function TicketStepper({
  title,
  subtitle,
  rate,
  count,
  onChange,
  min = 0,
  max = 6,
}) {
  const subtotal = count * rate;

  return (
    <div className="flex items-center justify-between py-2 border-b border-slate-100 last:border-none">
      <div>
        <div className="flex items-center gap-2">
          <span className="font-semibold text-slate-800 text-sm">{title}</span>
        </div>
        <p className="text-xs text-slate-500">
          ₹{rate} per passenger
        </p>
      </div>

      <div className="flex items-center gap-4">
        {/* Subtotal */}
        <span className="text-xs font-bold text-slate-700 min-w-8 text-right">
          ₹{subtotal}
        </span>

        {/* Stepper controls */}
        <div className="flex items-center gap-2 bg-slate-50 p-1 rounded-full border border-slate-200">
          <button
            type="button"
            onClick={() => onChange(Math.max(min, count - 1))}
            disabled={count <= min}
            aria-label={`Decrease ${title} tickets`}
            className="w-7 h-7 rounded-full flex items-center justify-center bg-white text-slate-700 shadow-xs border border-slate-200 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-100 active:scale-95 transition-all"
          >
            <Minus className="w-3.5 h-3.5" />
          </button>

          <span className="w-5 text-center text-sm font-bold text-slate-900 select-none">
            {count}
          </span>

          <button
            type="button"
            onClick={() => onChange(Math.min(max, count + 1))}
            disabled={count >= max}
            aria-label={`Increase ${title} tickets`}
            className="w-7 h-7 rounded-full flex items-center justify-center bg-[#C8102E] text-white shadow-xs disabled:opacity-40 disabled:cursor-not-allowed hover:bg-red-700 active:scale-95 transition-all"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}

