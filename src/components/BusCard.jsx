import React from 'react';
import { Clock, Users, CheckCircle2, Check, Radio } from 'lucide-react';

export default function BusCard({ bus, isSelected, onSelect }) {
  const getBadgeStyle = (category) => {
    switch (category) {
      case 'Volvo Vajra':
        return 'bg-blue-100 text-blue-700 border border-blue-200';
      case 'AC Electric':
        return 'bg-emerald-100 text-emerald-800 border border-emerald-200';
      default:
        return 'bg-slate-100 text-slate-700 border border-slate-200';
    }
  };

  const isLowSeats = bus.availableSeats <= 12;

  return (
    <div
      onClick={() => onSelect(bus)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          onSelect(bus);
        }
      }}
      className={`relative w-full text-left bg-white rounded-2xl p-4 cursor-pointer transition-all duration-200 border ${
        isSelected
          ? 'border-red-400 ring-2 ring-red-100 shadow-md border-l-4 border-l-[#C8102E]'
          : 'border-slate-200/90 hover:border-slate-300 shadow-xs hover:shadow-sm'
      }`}
    >
      {/* Top row: Bus Number, Badge, and Selected State */}
      <div className="flex items-center justify-between mb-1.5">
        <div className="flex items-center gap-2">
          <span className="text-xl font-extrabold text-slate-900 tracking-tight">
            {bus.busNumber}
          </span>
          <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-md ${getBadgeStyle(bus.serviceCategory)}`}>
            {bus.serviceCategory}
          </span>
        </div>

        <div>
          {isSelected ? (
            <div className="flex items-center gap-1 bg-red-50 text-[#C8102E] border border-red-200/80 px-2 py-0.5 rounded-full text-xs font-bold">
              <span>Selected</span>
              <Check className="w-3.5 h-3.5 stroke-[3]" />
            </div>
          ) : (
            <div className="w-5 h-5 rounded-full border-2 border-slate-200 bg-white" />
          )}
        </div>
      </div>

      {/* Route Path */}
      <p className="text-xs text-slate-600 line-clamp-1 mb-3">
        {bus.routeLabel || `${bus.origin} ➔ ${bus.destination} via ${bus.via}`}
      </p>

      {/* Bottom Info: Time, Seats, Price */}
      <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 font-medium text-slate-700">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <span>{bus.departureTime}</span>
          </div>

          <div
            className={`flex items-center gap-1 font-medium ${
              isLowSeats ? 'text-amber-600 font-semibold' : 'text-slate-600'
            }`}
          >
            <Users className="w-3.5 h-3.5 text-slate-400" />
            <span>
              {bus.availableSeats} {isLowSeats ? 'seats left' : 'seats'}
            </span>
          </div>
        </div>

        <div className="text-right">
          <span className="text-base font-extrabold text-[#C8102E]">₹{bus.adultFare}</span>
          <span className="text-[10px] text-slate-500 font-medium">/ticket</span>
        </div>
      </div>
    </div>
  );
}

