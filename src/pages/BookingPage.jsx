import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowUpDown,
  Calendar,
  Ticket,
  Sparkles,
  Zap,
  CheckCircle2,
  ChevronRight,
  Info,
  Clock,
  ShieldAlert,
  MapPin,
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import BusCard from '../components/BusCard';
import BusFilters from '../components/BusFilters';
import BookingSummary from '../components/BookingSummary';
import RouteSelector from '../components/RouteSelector';
import { useBooking } from '../context/BookingContext';
import { BMTC_STOPS } from '../data/stops';
import { getBusesForRoute } from '../data/buses';
import toast from 'react-hot-toast';

export default function BookingPage() {
  const navigate = useNavigate();
  const {
    boardingStop,
    setBoardingStop,
    destinationStop,
    setDestinationStop,
    swapStops,
    travelDate,
    setTravelDate,
    selectedBus,
    setSelectedBus,
    adultCount,
    setInitialTicketCount,
    totalPassengers,
    totalFare,
  } = useBooking();

  const [activeFilter, setActiveFilter] = useState('all');
  const [passengerCountInput, setPassengerCountInput] = useState(totalPassengers || 2);

  // Group BMTC stops by categorized sectors
  const categorizedStops = useMemo(() => {
    const groups = {};
    BMTC_STOPS.forEach((stop) => {
      const cat = stop.category || 'Other Stops';
      if (!groups[cat]) groups[cat] = [];
      groups[cat].push(stop);
    });
    return groups;
  }, []);

  // Dynamically load buses matching the selected From & To stops
  const currentRouteBuses = useMemo(() => {
    return getBusesForRoute(boardingStop, destinationStop);
  }, [boardingStop, destinationStop]);

  // Synchronize selectedBus when route changes
  useEffect(() => {
    if (
      !selectedBus ||
      (selectedBus.origin !== boardingStop && !boardingStop.includes(selectedBus.origin.split(' ')[0])) ||
      (selectedBus.destination !== destinationStop && !destinationStop.includes(selectedBus.destination.split(' ')[0]))
    ) {
      if (currentRouteBuses.length > 0) {
        setSelectedBus(currentRouteBuses[0]);
      }
    }
  }, [boardingStop, destinationStop, currentRouteBuses, selectedBus, setSelectedBus]);

  // Calculate filter counts for the available buses
  const filterCounts = useMemo(() => {
    const counts = { all: currentRouteBuses.length, 'Non-AC': 0, 'AC Electric': 0, 'Volvo Vajra': 0 };
    currentRouteBuses.forEach((b) => {
      if (counts[b.serviceCategory] !== undefined) {
        counts[b.serviceCategory]++;
      }
    });
    return counts;
  }, [currentRouteBuses]);

  // Filtered buses
  const filteredBuses = useMemo(() => {
    if (activeFilter === 'all') return currentRouteBuses;
    return currentRouteBuses.filter((b) => b.serviceCategory === activeFilter);
  }, [currentRouteBuses, activeFilter]);

  const handleTicketStepperChange = (newCount) => {
    if (newCount < 1 || newCount > 6) return;
    setPassengerCountInput(newCount);
    setInitialTicketCount(newCount);
  };

  const handleSelectRouteFromSelector = (from, to) => {
    setBoardingStop(from);
    setDestinationStop(to);
    const buses = getBusesForRoute(from, to);
    if (buses.length > 0) {
      setSelectedBus(buses[0]);
    }
    toast.success(`Selected route: ${from.split(' ')[0]} ➔ ${to.split(' ')[0]}`);
  };

  const handleBoardingChange = (newFrom) => {
    setBoardingStop(newFrom);
    const buses = getBusesForRoute(newFrom, destinationStop);
    if (buses.length > 0) {
      setSelectedBus(buses[0]);
    }
  };

  const handleDestinationChange = (newTo) => {
    setDestinationStop(newTo);
    const buses = getBusesForRoute(boardingStop, newTo);
    if (buses.length > 0) {
      setSelectedBus(buses[0]);
    }
  };

  const handleBookNow = () => {
    if (!selectedBus) {
      toast.error('Please select a bus service to proceed');
      return;
    }
    if (boardingStop === destinationStop) {
      toast.error('Boarding and destination stops cannot be identical');
      return;
    }
    navigate('/checkout');
  };

  // Check if selected stop is outside predefined list (e.g. from all 2,400+ services)
  const isBoardingCustom = !BMTC_STOPS.some((s) => s.name === boardingStop);
  const isDestCustom = !BMTC_STOPS.some((s) => s.name === destinationStop);

  return (
    <div className="min-h-screen bg-[#F9F9FF] flex flex-col pb-36 sm:pb-24">
      {/* Top Header */}
      <Navbar title="Book Ticket" showBack={false} />

      <main className="flex-1 max-w-md md:max-w-xl mx-auto w-full px-4 pt-4 space-y-4">
        {/* Search & Booking Card */}
        <section className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-card">
          {/* Card Title */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="text-xl">🚌</span>
              <div>
                <h2 className="text-base font-extrabold text-slate-900 tracking-tight">
                  Book Your Ticket
                </h2>
                <p className="text-[11px] text-slate-500 font-medium">
                  Select BMTC route or search stops
                </p>
              </div>
            </div>
            <span className="bg-emerald-50 text-emerald-700 text-xs font-bold px-2.5 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Live Fares
            </span>
          </div>

          {/* Payana Route Search & Quick Corridor Picker */}
          <RouteSelector
            boardingStop={boardingStop}
            destinationStop={destinationStop}
            onSelectRoute={handleSelectRouteFromSelector}
          />

          {/* Stops Selector with Swap Button */}
          <div className="relative space-y-3 mb-4">
            {/* Boarding Point (From) */}
            <div className="bg-slate-50 rounded-2xl p-3 border border-slate-200/80 focus-within:border-red-400 transition-colors">
              <label className="block text-[11px] font-bold text-red-700 uppercase tracking-wider mb-1 flex items-center gap-1">
                <span className="w-2 h-2 rounded-full border-2 border-red-600 bg-white inline-block" />
                Boarding Point (From)
              </label>
              <select
                value={boardingStop}
                onChange={(e) => handleBoardingChange(e.target.value)}
                className="w-full bg-transparent text-sm font-bold text-slate-800 focus:outline-none cursor-pointer"
              >
                {isBoardingCustom && (
                  <option value={boardingStop}>
                    📍 {boardingStop} (Selected Terminal)
                  </option>
                )}
                {Object.entries(categorizedStops).map(([catName, stops]) => (
                  <optgroup key={catName} label={`📍 ${catName}`}>
                    {stops.map((s) => (
                      <option key={s.id} value={s.name}>
                        {s.shortName} — {s.name} ({s.kannada})
                      </option>
                    ))}
                  </optgroup>
                ))}
              </select>
            </div>

            {/* Swap Button Floating */}
            <div className="absolute right-4 top-1/2 -translate-y-1/2 z-10">
              <button
                type="button"
                onClick={swapStops}
                title="Swap Boarding & Destination"
                className="w-9 h-9 rounded-full bg-blue-50 text-blue-600 border border-blue-200 flex items-center justify-center shadow-sm hover:bg-blue-100 hover:rotate-180 transition-all duration-300 active:scale-90"
              >
                <ArrowUpDown className="w-4 h-4" />
              </button>
            </div>

            {/* Alighting Point (To) */}
            <div className="bg-slate-50 rounded-2xl p-3 border border-slate-200/80 focus-within:border-emerald-400 transition-colors">
              <label className="block text-[11px] font-bold text-emerald-700 uppercase tracking-wider mb-1 flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-600 inline-block" />
                Alighting Point (To)
              </label>
              <select
                value={destinationStop}
                onChange={(e) => handleDestinationChange(e.target.value)}
                className="w-full bg-transparent text-sm font-bold text-slate-800 focus:outline-none cursor-pointer"
              >
                {isDestCustom && (
                  <option value={destinationStop}>
                    🏁 {destinationStop} (Selected Terminal)
                  </option>
                )}
                {Object.entries(categorizedStops).map(([catName, stops]) => (
                  <optgroup key={catName} label={`🏁 ${catName}`}>
                    {stops.map((s) => (
                      <option key={s.id} value={s.name}>
                        {s.shortName} — {s.name} ({s.kannada})
                      </option>
                    ))}
                  </optgroup>
                ))}
              </select>
            </div>
          </div>

          {/* Travel Date */}
          <div className="bg-slate-50 rounded-2xl p-3 border border-slate-200/80 mb-4">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-500 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                Travel Date
              </span>
              <span className="text-[10px] font-bold bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full">
                Peak Hours
              </span>
            </div>

            <div className="mt-1.5 flex items-center justify-between">
              <span className="font-bold text-slate-900 text-sm">
                Today, {travelDate}
              </span>
              <input
                type="date"
                defaultValue={new Date().toISOString().split('T')[0]}
                onChange={(e) => {
                  const val = e.target.value;
                  if (val) {
                    const [y, m, d] = val.split('-');
                    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
                    setTravelDate(`${d} ${months[parseInt(m, 10) - 1]} ${y}`);
                  }
                }}
                className="text-xs bg-white border border-slate-200 rounded-lg px-2 py-1 text-slate-700 cursor-pointer"
              />
            </div>
          </div>

          {/* Number of Tickets Stepper */}
          <div className="bg-slate-50 rounded-2xl p-3 border border-slate-200/80">
            <div className="flex items-center justify-between">
              <div>
                <span className="font-bold text-sm text-slate-900 block">
                  Number of Tickets
                </span>
                <span className="text-[11px] text-slate-400">
                  ₹0 surcharge for digital payment
                </span>
              </div>

              {/* Stepper */}
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => handleTicketStepperChange(passengerCountInput - 1)}
                  disabled={passengerCountInput <= 1}
                  className="w-8 h-8 rounded-full bg-white border border-slate-200 text-slate-700 font-bold flex items-center justify-center hover:bg-slate-100 active:scale-95 disabled:opacity-40 transition-all shadow-2xs"
                >
                  -
                </button>
                <span className="w-6 text-center font-extrabold text-base text-slate-900">
                  {passengerCountInput}
                </span>
                <button
                  type="button"
                  onClick={() => handleTicketStepperChange(passengerCountInput + 1)}
                  disabled={passengerCountInput >= 6}
                  className="w-8 h-8 rounded-full bg-[#C8102E] text-white font-bold flex items-center justify-center hover:bg-red-700 active:scale-95 disabled:opacity-40 transition-all shadow-2xs"
                >
                  +
                </button>
              </div>
            </div>

            {/* Sub-badges matching design */}
            <div className="mt-3 pt-2 border-t border-slate-200/60 flex items-center justify-between text-[11px]">
              <div className="flex items-center gap-2">
                <span className="bg-blue-50 text-blue-700 font-semibold px-2 py-0.5 rounded-md border border-blue-100">
                  Adults: {adultCount}
                </span>
                <span className="bg-slate-100 text-slate-600 font-medium px-2 py-0.5 rounded-md">
                  Child (Under 12): 0
                </span>
              </div>
              <span className="text-emerald-600 font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Validated
              </span>
            </div>
          </div>
        </section>

        {/* Available Buses Section */}
        <section className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <h3 className="font-extrabold text-base text-slate-900 tracking-tight">
              Available Buses ({currentRouteBuses.length})
            </h3>
            <span className="text-xs font-semibold text-[#C8102E] truncate max-w-[200px] text-right">
              {boardingStop.split(' ')[0]} ➔ {destinationStop.split(' ')[0]}
            </span>
          </div>

          {/* Filter Pills */}
          <BusFilters
            activeFilter={activeFilter}
            onSelectFilter={setActiveFilter}
            counts={filterCounts}
          />

          {/* Buses List */}
          <div className="space-y-3">
            {filteredBuses.length === 0 ? (
              <div className="bg-white rounded-2xl p-6 text-center border border-slate-200">
                <p className="text-sm font-bold text-slate-700">No {activeFilter} buses available</p>
                <p className="text-xs text-slate-400 mt-1">Try switching to 'All Services'</p>
                <button
                  type="button"
                  onClick={() => setActiveFilter('all')}
                  className="mt-3 px-3 py-1.5 bg-[#C8102E] text-white rounded-xl text-xs font-bold"
                >
                  Show All Buses
                </button>
              </div>
            ) : (
              filteredBuses.map((bus) => (
                <BusCard
                  key={bus.id}
                  bus={bus}
                  isSelected={selectedBus?.id === bus.id}
                  onSelect={(b) => setSelectedBus(b)}
                />
              ))
            )}
          </div>
        </section>

        {/* Instant UPI Tap & Go Banner */}
        <div className="bg-blue-50/80 rounded-2xl p-3 border border-blue-100 flex items-center justify-between text-xs text-blue-900 cursor-pointer hover:bg-blue-50 transition-colors">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-xs">
              <Zap className="w-4 h-4" />
            </div>
            <div>
              <p className="font-bold">Instant UPI Tap & Go</p>
              <p className="text-[11px] text-blue-700">
                Conductor validates ticket directly on phone screen
              </p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-blue-500" />
        </div>
      </main>

      {/* Sticky Bottom Booking Summary */}
      <BookingSummary
        totalAmount={totalFare}
        busNumber={selectedBus?.busNumber}
        serviceCategory={selectedBus?.serviceCategory}
        passengerCount={totalPassengers}
        buttonLabel="Book Now"
        onAction={handleBookNow}
      />

      <Footer />
    </div>
  );
}
