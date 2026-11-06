import React, { createContext, useContext, useState, useEffect } from 'react';
import { BUS_ROUTES, getBusesForRoute } from '../data/buses';
import { DEFAULT_BOARDING, DEFAULT_DESTINATION } from '../data/stops';
import { calculateFare } from '../utils/fareCalculator';
import { generateTicketId, generateSeatAllocations, getFormattedTodayDate } from '../utils/ticketGenerator';
import { sendTicketToPayana } from '../utils/payanaSync';

const BookingContext = createContext(null);

const STORAGE_KEYS = {
  CURRENT_DRAFT: 'bmtc_ride_draft_v1',
  ACTIVE_BOOKING: 'bmtc_ride_active_v1',
  HISTORY: 'bmtc_ride_history_v1',
};

export function BookingProvider({ children }) {
  // Default values matching sample design
  const [boardingStop, setBoardingStop] = useState(DEFAULT_BOARDING);
  const [destinationStop, setDestinationStop] = useState(DEFAULT_DESTINATION);
  const [travelDate, setTravelDate] = useState(getFormattedTodayDate());
  const [selectedBus, setSelectedBus] = useState(() => BUS_ROUTES[0]);

  // Stepper counts on checkout
  const [adultCount, setAdultCount] = useState(2);
  const [childCount, setChildCount] = useState(1);
  const [seniorCount, setSeniorCount] = useState(0);

  // Default passenger tickets
  const [passengers, setPassengers] = useState([
    { id: 'ticket-1', type: 'Adult' },
    { id: 'ticket-2', type: 'Adult' },
    { id: 'ticket-3', type: 'Child' },
  ]);

  // Payment Selection
  const [paymentMethod, setPaymentMethod] = useState('UPI Instant');

  // Confirmation / Active Booking
  const [activeBooking, setActiveBooking] = useState(null);
  const [bookingHistory, setBookingHistory] = useState([]);

  // Load persistence on mount
  useEffect(() => {
    try {
      const storedActive = localStorage.getItem(STORAGE_KEYS.ACTIVE_BOOKING);
      if (storedActive) {
        setActiveBooking(JSON.parse(storedActive));
      }

      const storedHistory = localStorage.getItem(STORAGE_KEYS.HISTORY);
      if (storedHistory) {
        setBookingHistory(JSON.parse(storedHistory));
      }

      const storedDraft = localStorage.getItem(STORAGE_KEYS.CURRENT_DRAFT);
      if (storedDraft) {
        const draft = JSON.parse(storedDraft);
        if (draft.boardingStop) setBoardingStop(draft.boardingStop);
        if (draft.destinationStop) setDestinationStop(draft.destinationStop);
        if (draft.travelDate) setTravelDate(draft.travelDate);
        if (draft.selectedBusId) {
          const matched = BUS_ROUTES.find((b) => b.id === draft.selectedBusId);
          if (matched) setSelectedBus(matched);
        }
        if (typeof draft.adultCount === 'number') setAdultCount(draft.adultCount);
        if (typeof draft.childCount === 'number') setChildCount(draft.childCount);
        if (typeof draft.seniorCount === 'number') setSeniorCount(draft.seniorCount);
        if (Array.isArray(draft.passengers) && draft.passengers.length > 0) {
          setPassengers(draft.passengers);
        }
      }
    } catch (err) {
      console.warn('Could not restore from localStorage', err);
    }
  }, []);

  // Save draft whenever key inputs change
  useEffect(() => {
    try {
      const draft = {
        boardingStop,
        destinationStop,
        travelDate,
        selectedBusId: selectedBus?.id,
        adultCount,
        childCount,
        seniorCount,
        passengers,
      };
      localStorage.setItem(STORAGE_KEYS.CURRENT_DRAFT, JSON.stringify(draft));
    } catch (e) {
      console.warn('Failed to save draft to localStorage', e);
    }
  }, [boardingStop, destinationStop, travelDate, selectedBus, adultCount, childCount, seniorCount, passengers]);

  // Calculate fare breakdown
  const fareBreakdown = calculateFare({
    bus: selectedBus,
    adultCount,
    childCount,
    seniorCount,
  });

  const totalPassengers = adultCount + childCount + seniorCount;
  const totalFare = fareBreakdown.totalPayable;

  // Swap Boarding and Destination
  const swapStops = () => {
    setBoardingStop((prevBoarding) => {
      const oldDestination = destinationStop;
      setDestinationStop(prevBoarding);
      const newBuses = getBusesForRoute(oldDestination, prevBoarding);
      if (newBuses && newBuses.length > 0) {
        setSelectedBus(newBuses[0]);
      }
      return oldDestination;
    });
  };

  // Select complete route with matching buses
  const selectRoute = (from, to, bus = null) => {
    setBoardingStop(from);
    setDestinationStop(to);
    if (bus) {
      setSelectedBus(bus);
    } else {
      const available = getBusesForRoute(from, to);
      if (available && available.length > 0) {
        setSelectedBus(available[0]);
      }
    }
  };

  // Adjust passenger list when count of category changes
  const updatePassengerCount = (category, newCount) => {
    if (newCount < 0) return;

    // Must have at least 1 passenger overall across all categories
    let newAdult = category === 'Adult' ? newCount : adultCount;
    let newChild = category === 'Child' ? newCount : childCount;
    let newSenior = category === 'Senior' ? newCount : seniorCount;

    if (newAdult + newChild + newSenior < 1) {
      return; // Cannot drop below 1 passenger
    }

    if (category === 'Adult') setAdultCount(newCount);
    if (category === 'Child') setChildCount(newCount);
    if (category === 'Senior') setSeniorCount(newSenior);

    // Sync passengers array
    setPassengers((prev) => {
      const existingOfCategory = prev.filter((p) => p.type === category);
      const currentCount = existingOfCategory.length;

      if (newCount > currentCount) {
        // Add additional passenger slots for this category
        const added = [];
        for (let i = currentCount; i < newCount; i++) {
          added.push({
            id: `ticket-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
            type: category,
          });
        }
        return [...prev, ...added];
      } else if (newCount < currentCount) {
        // Remove the last passenger slots of this category
        const toKeep = newCount;
        let kept = 0;
        const newArray = [];
        for (const p of prev) {
          if (p.type === category) {
            if (kept < toKeep) {
              newArray.push(p);
              kept++;
            }
          } else {
            newArray.push(p);
          }
        }
        return newArray;
      }
      return prev;
    });
  };

  // Set initial total count from Screen 1 stepper
  const setInitialTicketCount = (count) => {
    if (count < 1) return;
    setAdultCount(count);
    setChildCount(0);
    setSeniorCount(0);

    setPassengers(() => {
      const tickets = [];
      for (let i = 0; i < count; i++) {
        tickets.push({
          id: `ticket-${Date.now()}-${i}`,
          type: 'Adult',
        });
      }
      return tickets;
    });
  };

  // Update specific passenger data
  const updatePassenger = (index, field, value) => {
    setPassengers((prev) => {
      const next = [...prev];
      if (next[index]) {
        next[index] = { ...next[index], [field]: value };
      }
      return next;
    });
  };

  // Complete Booking & generate confirmed ticket
  const finalizeBooking = () => {
    const ticketId = generateTicketId();
    const allocatedPassengers = generateSeatAllocations(passengers);

    const newBooking = {
      ticketId,
      bookingTimestamp: new Date().toLocaleString('en-IN', {
        dateStyle: 'medium',
        timeStyle: 'short',
      }),
      busRoute: selectedBus,
      boardingStop,
      destinationStop,
      travelDate,
      passengers: allocatedPassengers,
      fareBreakdown,
      totalFare,
      paymentMethod,
      paymentStatus: 'SUCCESS',
      bookingStatus: 'CONFIRMED',
      validUntil: 'Valid for 3h remaining',
    };

    // Dispatch live ticket and seat occupancy sync to Payana.si
    const payanaSync = sendTicketToPayana(newBooking);
    newBooking.payanaSync = payanaSync;

    setActiveBooking(newBooking);

    // Save to LocalStorage
    try {
      localStorage.setItem(STORAGE_KEYS.ACTIVE_BOOKING, JSON.stringify(newBooking));

      const updatedHistory = [newBooking, ...bookingHistory.filter((b) => b.ticketId !== ticketId)];
      setBookingHistory(updatedHistory);
      localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(updatedHistory));
    } catch (e) {
      console.error('LocalStorage booking write error', e);
    }

    return newBooking;
  };

  // Retrieve a booking by ID (from active or history or localStorage)
  const getBookingById = (ticketId) => {
    if (activeBooking && activeBooking.ticketId === ticketId) {
      return activeBooking;
    }
    const fromHistory = bookingHistory.find((b) => b.ticketId === ticketId);
    if (fromHistory) return fromHistory;

    // Check localStorage fallback
    try {
      const rawActive = localStorage.getItem(STORAGE_KEYS.ACTIVE_BOOKING);
      if (rawActive) {
        const parsed = JSON.parse(rawActive);
        if (parsed.ticketId === ticketId) return parsed;
      }
      const rawHistory = localStorage.getItem(STORAGE_KEYS.HISTORY);
      if (rawHistory) {
        const historyList = JSON.parse(rawHistory);
        const match = historyList.find((b) => b.ticketId === ticketId);
        if (match) return match;
      }
    } catch (e) {
      console.warn('Failed to retrieve ticket from storage', e);
    }
    return null;
  };

  // Reset booking draft to book another ticket
  const resetBookingState = () => {
    setAdultCount(1);
    setChildCount(0);
    setSeniorCount(0);
    setPassengers([
      {
        id: 'ticket-default',
        type: 'Adult',
      },
    ]);
  };

  const value = {
    boardingStop,
    setBoardingStop,
    destinationStop,
    setDestinationStop,
    swapStops,
    selectRoute,
    travelDate,
    setTravelDate,
    selectedBus,
    setSelectedBus,
    adultCount,
    childCount,
    seniorCount,
    totalPassengers,
    updatePassengerCount,
    setInitialTicketCount,
    passengers,
    updatePassenger,
    paymentMethod,
    setPaymentMethod,
    fareBreakdown,
    totalFare,
    activeBooking,
    setActiveBooking,
    bookingHistory,
    finalizeBooking,
    getBookingById,
    resetBookingState,
  };

  return <BookingContext.Provider value={value}>{children}</BookingContext.Provider>;
}

export function useBooking() {
  const context = useContext(BookingContext);
  if (!context) {
    throw new Error('useBooking must be used within a BookingProvider');
  }
  return context;
}

