import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ShieldCheck,
  CheckCircle2,
  Users,
  Clock,
  ArrowRight,
  AlertTriangle,
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import TicketStepper from '../components/TicketStepper';
import FareBreakdown from '../components/FareBreakdown';
import PaymentSelector from '../components/PaymentSelector';
import BookingSummary from '../components/BookingSummary';
import LoadingModal from '../components/LoadingModal';
import { useBooking } from '../context/BookingContext';
import toast from 'react-hot-toast';

export default function CheckoutPage() {
  const navigate = useNavigate();
  const {
    selectedBus,
    boardingStop,
    destinationStop,
    travelDate,
    adultCount,
    childCount,
    seniorCount,
    totalPassengers,
    updatePassengerCount,
    fareBreakdown,
    totalFare,
    paymentMethod,
    setPaymentMethod,
    finalizeBooking,
  } = useBooking();

  const [isProcessing, setIsProcessing] = useState(false);
  const [createdBooking, setCreatedBooking] = useState(null);

  // If no bus was selected or user navigated directly, fallback or redirect
  if (!selectedBus) {
    return (
      <div className="min-h-screen bg-[#F9F9FF] flex flex-col items-center justify-center p-4">
        <div className="bg-white p-6 rounded-3xl max-w-sm w-full text-center shadow-card border border-slate-200">
          <AlertTriangle className="w-12 h-12 text-amber-500 mx-auto mb-3" />
          <h3 className="font-extrabold text-base text-slate-900 mb-1">
            No Route Selected
          </h3>
          <p className="text-xs text-slate-500 mb-4">
            Please search and select a BMTC bus route first.
          </p>
          <button
            onClick={() => navigate('/')}
            className="w-full py-2.5 rounded-xl bg-[#C8102E] text-white font-bold text-xs"
          >
            Go to Search
          </button>
        </div>
      </div>
    );
  }

  const handlePayClick = () => {
    if (totalPassengers < 1) {
      toast.error('Please select at least 1 ticket');
      return;
    }

    if (!paymentMethod) {
      toast.error('Please select a payment method');
      return;
    }

    // Open processing modal
    setIsProcessing(true);
  };

  const handlePaymentSuccess = () => {
    // Finalize booking state and save to LocalStorage
    const booking = finalizeBooking();
    setCreatedBooking(booking);
    setIsProcessing(false);
    toast.success('Ticket Confirmed! Safe journey with BMTC.');
    navigate(`/confirmation/${booking.ticketId}`, { state: { booking } });
  };

  return (
    <div className="min-h-screen bg-[#F9F9FF] flex flex-col pb-28">
      {/* Top Header */}
      <Navbar title="Ticket Checkout" showBack={true} />

      <main className="flex-1 max-w-md md:max-w-xl mx-auto w-full px-4 pt-4 space-y-4">
        {/* Selected Bus Card Preview */}
        <section className="bg-white rounded-3xl p-4 border border-slate-200/90 shadow-card">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="text-base font-black text-slate-900 bg-slate-100 px-2 py-0.5 rounded-lg border border-slate-200">
                {selectedBus.busNumber}
              </span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700">
                {selectedBus.serviceCategory}
              </span>
            </div>

            <div className="flex items-center gap-1 text-xs font-bold text-slate-700">
              <Clock className="w-3.5 h-3.5 text-red-600" />
              <span>{selectedBus.departureTime}</span>
            </div>
          </div>

          {/* Route path with dots */}
          <div className="space-y-1.5 py-1 text-xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#C8102E]" />
                <span className="font-bold text-slate-800">{boardingStop}</span>
              </div>
              <span className="text-slate-500 font-medium">
                {selectedBus.platform || 'Platform 3'}
              </span>
            </div>

            <div className="w-0.5 h-3 bg-slate-300 ml-1" />

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                <span className="font-bold text-slate-800">{destinationStop}</span>
              </div>
              <span className="text-slate-500 font-medium">
                {selectedBus.bay || 'Bay 2'}
              </span>
            </div>
          </div>

          {/* Status info footer */}
          <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px]">
            <span className="text-emerald-700 font-semibold flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              Real-time GPS Tracking Active
            </span>
            <span className="text-slate-500 font-medium">
              {selectedBus.availableSeats} Seats Left
            </span>
          </div>
        </section>

        {/* Dynamic Passenger Steppers */}
        <section className="bg-white rounded-3xl p-4 border border-slate-200/90 shadow-card">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-extrabold text-sm text-slate-900">
              Select Passengers
            </h3>
            <span className="bg-red-50 text-[#C8102E] text-xs font-bold px-2 py-0.5 rounded-full border border-red-100">
              {totalPassengers} {totalPassengers === 1 ? 'Ticket' : 'Tickets'}
            </span>
          </div>

          <div className="space-y-1">
            <TicketStepper
              title="Adult"
              subtitle="Full fare"
              rate={selectedBus.adultFare || 35}
              count={adultCount}
              onChange={(c) => updatePassengerCount('Adult', c)}
              min={0}
              max={6}
            />

            <TicketStepper
              title="Child (5-12 yrs)"
              subtitle="Concession rate"
              rate={selectedBus.childFare || 20}
              count={childCount}
              onChange={(c) => updatePassengerCount('Child', c)}
              min={0}
              max={4}
            />

            <TicketStepper
              title="Senior / Concession"
              subtitle="Special transit fare"
              rate={selectedBus.seniorFare || 18}
              count={seniorCount}
              onChange={(c) => updatePassengerCount('Senior', c)}
              min={0}
              max={4}
            />
          </div>
        </section>

        {/* Complete Fare Breakdown */}
        <FareBreakdown fareBreakdown={fareBreakdown} />

        {/* Payment Selector */}
        <PaymentSelector
          selectedMethod={paymentMethod}
          onSelectMethod={setPaymentMethod}
        />
      </main>

      {/* Sticky Bottom Bar */}
      <BookingSummary
        totalAmount={totalFare}
        busNumber={selectedBus.busNumber}
        serviceCategory={selectedBus.serviceCategory}
        passengerCount={totalPassengers}
        buttonLabel="Book Now"
        onAction={handlePayClick}
      />

      {/* Simulated Payment Processing Modal */}
      <LoadingModal
        isOpen={isProcessing}
        onComplete={handlePaymentSuccess}
        amount={totalFare}
        paymentMethod={paymentMethod}
      />

      <Footer />
    </div>
  );
}

