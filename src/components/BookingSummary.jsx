import React from 'react';
import { Ticket, ArrowRight } from 'lucide-react';

export default function BookingSummary({
  totalAmount,
  busNumber,
  serviceCategory,
  passengerCount,
  buttonLabel = 'Book Now',
  onAction,
  disabled = false,
}) {
  return (
    <div className="fixed bottom-[58px] sm:bottom-0 left-0 right-0 z-30 bg-white/95 backdrop-blur-md border-t border-slate-200/90 py-2.5 sm:py-3 px-4 shadow-sticky-bar">
      <div className="max-w-md md:max-w-2xl mx-auto flex items-center justify-between gap-3">
        {/* Left: Total Fare & Details */}
        <div>
          <div className="flex items-baseline gap-1">
            <span className="text-xs text-slate-500 font-medium">Total:</span>
            <span className="text-lg sm:text-xl font-extrabold text-[#C8102E]">
              ₹{totalAmount}
            </span>
          </div>
          <p className="text-[10px] sm:text-[11px] text-slate-500 font-medium truncate max-w-[160px] sm:max-w-none">
            {passengerCount} {passengerCount === 1 ? 'Passenger' : 'Passengers'} •{' '}
            {busNumber ? `Route ${busNumber}` : 'Select Route'}
            {serviceCategory ? ` (${serviceCategory})` : ''}
          </p>
        </div>

        {/* Right: Action Button */}
        <button
          type="button"
          onClick={onAction}
          disabled={disabled}
          className="flex items-center gap-2 px-5 sm:px-6 py-2.5 rounded-xl bg-[#C8102E] hover:bg-[#A30D25] active:scale-95 text-white font-bold text-xs sm:text-sm shadow-md shadow-red-600/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          <span>{buttonLabel}</span>
          <Ticket className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

