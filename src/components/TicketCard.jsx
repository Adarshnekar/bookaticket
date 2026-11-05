import React from 'react';
import { CheckCircle2, ShieldCheck, Check } from 'lucide-react';
import QRCodeCard from './QRCodeCard';
import { formatQRData } from '../utils/ticketGenerator';

export default function TicketCard({ booking }) {
  if (!booking) return null;

  const {
    ticketId = 'NR-MW3W0FRR',
    busRoute = {},
    boardingStop = 'Shivajinagar Bus Station',
    destinationStop = 'Whitefield TTMC',
    travelDate = '05 Nov 2026',
    passengers = [],
    totalFare = 90,
    paymentMethod = 'UPI Instant',
  } = booking;

  const qrString = formatQRData({
    ticketId,
    busNumber: busRoute?.busNumber || '335E',
    boardingStop,
    destinationStop,
    travelDate,
    passengerCount: passengers.length,
    totalFare,
  });

  return (
    <div className="relative w-full max-w-sm mx-auto shadow-ticket rounded-3xl overflow-hidden bg-white border border-slate-200/90 transition-all">
      {/* Top Red Section */}
      <div className="bg-[#C8102E] text-white pt-6 pb-6 px-6 text-center relative overflow-hidden">
        {/* Subtle decorative circles */}
        <div className="absolute -top-10 -right-10 w-28 h-28 bg-white/10 rounded-full pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-28 h-28 bg-white/10 rounded-full pointer-events-none" />

        {/* Checkmark */}
        <div className="w-12 h-12 bg-emerald-400 rounded-full flex items-center justify-center mx-auto mb-2.5 shadow-md">
          <Check className="w-7 h-7 text-white stroke-[3.5]" />
        </div>

        <h2 className="text-xl font-black tracking-tight">Ticket Confirmed!</h2>
        <p className="text-xs font-mono font-medium text-red-100 tracking-wider mt-0.5 mb-4">
          Ticket ID: {ticketId}
        </p>

        {/* High-density QR code component */}
        <QRCodeCard qrData={qrString} ticketId={ticketId} />
      </div>

      {/* Perforation Cut-outs and Dashed Line */}
      <div className="relative bg-[#C8102E]">
        <div className="h-6 bg-white flex items-center justify-between px-3 relative">
          {/* Left Notch */}
          <div className="w-6 h-6 rounded-full bg-[#F9F9FF] absolute -left-3 top-1/2 -translate-y-1/2 shadow-inner border-r border-slate-200" />

          {/* Center Perforated Dashed Line */}
          <div className="w-full border-b-2 border-dashed border-slate-300 mx-3" />

          {/* Right Notch */}
          <div className="w-6 h-6 rounded-full bg-[#F9F9FF] absolute -right-3 top-1/2 -translate-y-1/2 shadow-inner border-l border-slate-200" />
        </div>
      </div>

      {/* Bottom White Section */}
      <div className="p-5 bg-white space-y-4">
        {/* Passenger Seats Allocation */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              PASSENGER SEATS
            </span>
            <span className="text-[10px] font-bold bg-red-50 text-[#C8102E] px-2 py-0.5 rounded-full border border-red-100">
              {passengers.length} {passengers.length === 1 ? 'Passenger' : 'Passengers'}
            </span>
          </div>

          {/* Dynamic Seat Chips */}
          <div className="grid grid-cols-3 gap-2">
            {passengers.map((p, idx) => {
              const typeLabel = p.type || 'Adult';
              return (
                <div
                  key={p.id || idx}
                  className="bg-slate-50 border border-slate-200/90 rounded-xl p-2 text-center"
                >
                  <p className="text-[11px] font-semibold text-slate-700 truncate">
                    {typeLabel}
                  </p>
                  <p className="text-xs font-black text-emerald-600 mt-0.5">
                    Seat #{p.seatNumber || idx + 14}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Details Table */}
        <div className="space-y-2.5 text-xs border-t border-slate-100 pt-3">
          <div className="flex justify-between items-center">
            <span className="text-slate-500">Route</span>
            <div className="flex items-center gap-1.5 font-bold text-slate-900">
              <span>{busRoute?.busNumber || '335E'}</span>
              <span className="text-[10px] bg-slate-100 text-slate-700 px-1.5 py-0.2 rounded border border-slate-200">
                {busRoute?.serviceCategory || 'Non-AC'}
              </span>
            </div>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-slate-500">Boarding</span>
            <span className="font-bold text-slate-900 text-right max-w-[190px] truncate">
              {boardingStop}
            </span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-slate-500">Alighting</span>
            <span className="font-bold text-slate-900 text-right max-w-[190px] truncate">
              {destinationStop}
            </span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-slate-500">Travel Date</span>
            <span className="font-bold text-slate-900">{travelDate}</span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-slate-500">Departure</span>
            <span className="font-bold text-slate-900">{busRoute?.departureTime || '08:45 AM'}</span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-slate-500">Pass Status</span>
            <div className="flex items-center gap-1 bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full text-[10px] font-bold border border-emerald-200">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>VALID & ACTIVE</span>
            </div>
          </div>
        </div>

        {/* Fare Banner */}
        <div className="bg-slate-50 rounded-2xl p-3 border border-slate-200 flex items-center justify-between">
          <div>
            <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">
              Total Fare Paid
            </span>
            <span className="text-[11px] text-slate-600 font-medium">
              {paymentMethod} • <span className="text-emerald-600 font-bold">Successful</span>
            </span>
          </div>
          <span className="text-2xl font-black text-slate-900">₹{totalFare}</span>
        </div>
      </div>
    </div>
  );
}

