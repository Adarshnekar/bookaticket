import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import {
  Download,
  Share2,
  Compass,
  RotateCcw,
  CheckCircle2,
  ShieldCheck,
  AlertCircle,
  Copy,
  Ticket,
  Radio,
  Users,
  ExternalLink,
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import TicketCard from '../components/TicketCard';
import BusTracker from '../components/BusTracker';
import { useBooking } from '../context/BookingContext';
import { generateTicketPDF } from '../utils/pdfGenerator';
import { sendTicketToPayana, getRouteOccupancyState } from '../utils/payanaSync';
import toast from 'react-hot-toast';

export default function ConfirmationPage() {
  const { ticketId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { getBookingById, activeBooking, resetBookingState } = useBooking();

  const [booking, setBooking] = useState(() => {
    // 1. From route state
    if (location.state?.booking) return location.state.booking;
    // 2. From context
    if (activeBooking && activeBooking.ticketId === ticketId) return activeBooking;
    // 3. Fallback from storage
    return getBookingById(ticketId);
  });

  useEffect(() => {
    if (!booking && ticketId) {
      const retrieved = getBookingById(ticketId);
      if (retrieved) {
        setBooking(retrieved);
      }
    }
  }, [ticketId, booking, getBookingById]);

  // If no booking found even after checking localStorage
  if (!booking) {
    return (
      <div className="min-h-screen bg-[#F9F9FF] flex flex-col items-center justify-center p-4">
        <div className="bg-white rounded-3xl p-6 max-w-sm w-full text-center shadow-card border border-slate-200">
          <AlertCircle className="w-12 h-12 text-amber-500 mx-auto mb-3" />
          <h3 className="font-extrabold text-base text-slate-900 mb-1">
            Ticket Not Found
          </h3>
          <p className="text-xs text-slate-500 mb-4">
            Could not find a confirmed ticket with ID: {ticketId}.
          </p>
          <button
            onClick={() => navigate('/')}
            className="w-full py-2.5 rounded-xl bg-[#C8102E] text-white font-bold text-xs"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  // Handle PDF Receipt Download
  const handleDownloadPDF = () => {
    try {
      generateTicketPDF(booking);
      toast.success('BMTC PDF Ticket Receipt downloaded successfully!');
    } catch (err) {
      console.error('PDF error', err);
      toast.error('Failed to generate PDF. Please try again.');
    }
  };

  // Handle Web Share API with Clipboard Fallback
  const handleShareTicket = async () => {
    const shareText = `BMTC Namma Ride Digital Ticket: ${booking.ticketId}\nRoute: ${booking.busRoute?.busNumber || '335E'} (${booking.boardingStop} ➔ ${booking.destinationStop})\nSeats: ${booking.passengers?.map((p) => `#${p.seatNumber}`).join(', ')}\nFare: ₹${booking.totalFare} Paid`;
    const shareUrl = window.location.href;

    if (navigator.share) {
      try {
        await navigator.share({
          title: `BMTC Pass: ${booking.ticketId}`,
          text: shareText,
          url: shareUrl,
        });
        toast.success('Ticket shared successfully!');
        return;
      } catch (e) {
        // user aborted or not supported
      }
    }

    // Fallback: Copy link to clipboard
    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(`${shareText}\n${shareUrl}`);
        toast.success('Ticket details & link copied to clipboard!');
      } else {
        toast('Link: ' + shareUrl, { icon: '📋' });
      }
    } catch (err) {
      toast.error('Could not copy link');
    }
  };

  // Book Another Ticket
  const handleBookAnother = () => {
    resetBookingState();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-[#F9F9FF] flex flex-col pb-16">
      {/* Top Header matching screenshot */}
      <Navbar title="Active Ticket" showBack={true} />

      <main className="flex-1 max-w-md md:max-w-xl mx-auto w-full px-4 pt-3 space-y-4">
        {/* Top Badges */}
        <div className="flex items-center justify-between text-xs px-1">
          <div className="flex items-center gap-1.5 font-bold text-slate-800">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Active Digital Pass</span>
          </div>
          <span className="bg-blue-50 text-blue-700 font-semibold px-2.5 py-0.5 rounded-full border border-blue-200 text-[11px]">
            Valid for 3h remaining
          </span>
        </div>

        {/* Digital Ticket Card */}
        <TicketCard booking={booking} />

        {/* Payana Live Real-time Sync Card */}
        <div className="bg-white rounded-2xl p-4 border border-indigo-100 shadow-xs relative overflow-hidden">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-indigo-50 border border-indigo-200 text-indigo-700 flex items-center justify-center font-bold">
                <Radio className="w-4 h-4 text-indigo-600 animate-pulse" />
              </div>
              <div>
                <h4 className="text-xs font-black text-slate-900 tracking-tight flex items-center gap-1.5">
                  Payana.si Real-Time Sync
                  <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.2 rounded-full border border-emerald-200">
                    🟢 Dispatched
                  </span>
                </h4>
                <p className="text-[11px] text-slate-500">
                  Seat occupancy broadcast to Payana Transit Network
                </p>
              </div>
            </div>
          </div>

          <div className="bg-slate-50 rounded-xl p-2.5 border border-slate-200/80 text-xs space-y-1.5">
            <div className="flex justify-between items-center">
              <span className="text-slate-500 font-medium">Route:</span>
              <span className="font-extrabold text-slate-800 bg-white px-2 py-0.5 rounded border border-slate-200">
                {booking.busRoute?.busNumber || '335-E'}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-500 font-medium">Seats Occupied Added:</span>
              <span className="font-bold text-emerald-600">
                +{booking.passengers?.length || 1} Seat{(booking.passengers?.length || 1) > 1 ? 's' : ''} Occupied
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-500 font-medium">Payana Live Occupancy:</span>
              <span className="font-bold text-indigo-700">
                {booking.payanaSync?.newOccupancy || 45}% Occupied
              </span>
            </div>
          </div>

          <div className="mt-2.5 flex items-center justify-between pt-2 border-t border-slate-100 text-[11px]">
            <span className="text-slate-400">Sync: BroadcastChannel & LocalStorage</span>
            <button
              type="button"
              onClick={() => {
                sendTicketToPayana(booking);
                toast.success('Re-broadcast ticket sync to Payana.si!');
              }}
              className="font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 cursor-pointer"
            >
              <span>Re-send Sync Ping</span>
              <Radio className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* Live Bus Tracker with React Leaflet Map */}
        <BusTracker
          busRoute={booking.busRoute}
          boardingStop={booking.boardingStop}
          destinationStop={booking.destinationStop}
        />

        {/* Action Buttons Section */}
        <div className="space-y-2.5 pt-1">
          {/* Download PDF Receipt / Share Button */}
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={handleDownloadPDF}
              className="w-full py-3 px-4 rounded-2xl bg-blue-50 hover:bg-blue-100 text-blue-900 border border-blue-200 text-xs font-bold flex items-center justify-center gap-2 transition-all active:scale-98 shadow-xs"
            >
              <Download className="w-4 h-4 text-blue-700" />
              <span>Download PDF</span>
            </button>

            <button
              type="button"
              onClick={handleShareTicket}
              className="w-full py-3 px-4 rounded-2xl bg-blue-50 hover:bg-blue-100 text-blue-900 border border-blue-200 text-xs font-bold flex items-center justify-center gap-2 transition-all active:scale-98 shadow-xs"
            >
              <Share2 className="w-4 h-4 text-blue-700" />
              <span>Share Ticket</span>
            </button>
          </div>

          {/* Book Another Ticket Button */}
          <button
            type="button"
            onClick={handleBookAnother}
            className="w-full py-3.5 rounded-2xl bg-[#C8102E] hover:bg-[#A30D25] active:scale-98 text-white font-extrabold text-sm flex items-center justify-center gap-2 transition-all shadow-md shadow-red-700/20"
          >
            <Ticket className="w-4 h-4" />
            <span>Book Another Ticket</span>
          </button>
        </div>
      </main>

      <Footer />
    </div>
  );
}

