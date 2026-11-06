/**
 * Payana Real-Time Transit Ticket Sync Bridge
 *
 * Broadcasts confirmed ticket purchases to Payana.si across:
 * 1. BroadcastChannel API ('payana_transit_tickets' & 'payana_transit_sync')
 * 2. Window LocalStorage Event ('payana_ticket_sync_event')
 * 3. Cross-origin / Cross-window postMessage (window.opener / window.parent)
 * 4. Safe HTTP webhook ping to local development servers
 */

const STORAGE_KEYS = {
  SYNC_EVENT: 'payana_ticket_sync_event',
  OCCUPANCY_MAP: 'payana_live_bus_occupancy',
  TICKET_HISTORY: 'payana_all_tickets',
};

// Initial base occupancy percentages per route matching Payana mockData
const BASE_ROUTE_OCCUPANCY = {
  '401-E': 35,
  '500-C': 72,
  '210-D': 55,
  '335-G': 88,
  '600-B': 28,
  '201-A': 62,
  '252-F': 45,
  '285-M': 95,
  '2-F': 68,
  '500-D': 82,
  '335-E': 48,
  'KIA-9': 30,
  '365': 50,
  '378': 42,
  '201-G': 32,
  'V-600': 40,
};

const TOTAL_BUS_CAPACITY = 48;

/**
 * Retrieve current occupancy state for a route from LocalStorage or default
 */
export function getRouteOccupancyState(routeNo) {
  const normRoute = (routeNo || '').toUpperCase().trim();
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.OCCUPANCY_MAP);
    if (raw) {
      const map = JSON.parse(raw);
      if (map[normRoute]) return map[normRoute];
    }
  } catch (e) {
    console.warn('Could not read occupancy map', e);
  }

  // Calculate default based on base occupancy
  const basePercent = BASE_ROUTE_OCCUPANCY[normRoute] || 40;
  const occupiedSeats = Math.round((basePercent / 100) * TOTAL_BUS_CAPACITY);
  return {
    route: normRoute,
    totalSeats: TOTAL_BUS_CAPACITY,
    occupiedSeats,
    availableSeats: TOTAL_BUS_CAPACITY - occupiedSeats,
    occupancyPercent: basePercent,
    crowdLevel: basePercent > 85 ? 'full' : basePercent > 65 ? 'crowded' : basePercent > 40 ? 'moderate' : 'low',
    lastUpdated: new Date().toISOString(),
  };
}

/**
 * Dispatches ticket purchase details to Payana.si
 */
export function sendTicketToPayana(booking) {
  if (!booking) return null;

  const rawRouteNo = booking.busRoute?.busNumber || '335-E';
  const normRoute = rawRouteNo.toUpperCase().trim();
  const passengerCount = booking.passengers?.length || 1;
  const boarding = booking.boardingStop || 'Origin';
  const destination = booking.destinationStop || 'Destination';

  // 1. Calculate new occupancy state
  const prevState = getRouteOccupancyState(normRoute);
  const newOccupiedSeats = Math.min(TOTAL_BUS_CAPACITY, prevState.occupiedSeats + passengerCount);
  const newAvailableSeats = Math.max(0, TOTAL_BUS_CAPACITY - newOccupiedSeats);
  const newOccupancyPercent = Math.min(100, Math.round((newOccupiedSeats / TOTAL_BUS_CAPACITY) * 100));
  const newCrowdLevel =
    newOccupancyPercent > 85
      ? 'full'
      : newOccupancyPercent > 65
      ? 'crowded'
      : newOccupancyPercent > 40
      ? 'moderate'
      : 'low';

  const updatedState = {
    route: normRoute,
    totalSeats: TOTAL_BUS_CAPACITY,
    occupiedSeats: newOccupiedSeats,
    availableSeats: newAvailableSeats,
    occupancyPercent: newOccupancyPercent,
    crowdLevel: newCrowdLevel,
    lastAddedPassengers: passengerCount,
    lastTicketId: booking.ticketId,
    lastUpdated: new Date().toISOString(),
  };

  // 2. Persist updated occupancy map in LocalStorage
  try {
    const rawMap = localStorage.getItem(STORAGE_KEYS.OCCUPANCY_MAP);
    const map = rawMap ? JSON.parse(rawMap) : {};
    map[normRoute] = updatedState;
    localStorage.setItem(STORAGE_KEYS.OCCUPANCY_MAP, JSON.stringify(map));
  } catch (e) {
    console.warn('Failed to update occupancy map', e);
  }

  // 3. Construct the comprehensive synchronization payload
  const syncPayload = {
    type: 'TICKET_PURCHASED',
    source: 'bookaticket',
    target: 'payana',
    ticketId: booking.ticketId,
    route: normRoute,
    routeName: `${boarding} ➔ ${destination}`,
    from: boarding,
    to: destination,
    passengerCount,
    seats: booking.passengers?.map((p) => p.seatNumber || p.id) || [],
    fare: booking.totalFare,
    travelDate: booking.travelDate,
    timestamp: new Date().toISOString(),
    previousOccupancy: prevState.occupancyPercent,
    newOccupancy: newOccupancyPercent,
    occupiedSeats: newOccupiedSeats,
    availableSeats: newAvailableSeats,
    crowdLevel: newCrowdLevel,
  };

  // 4. Dispatch via BroadcastChannel ('payana_transit_tickets' & 'payana_transit_sync')
  try {
    const channel1 = new BroadcastChannel('payana_transit_tickets');
    channel1.postMessage(syncPayload);
    setTimeout(() => channel1.close(), 1000);

    const channel2 = new BroadcastChannel('payana_transit_sync');
    channel2.postMessage(syncPayload);
    setTimeout(() => channel2.close(), 1000);
  } catch (err) {
    console.warn('BroadcastChannel error', err);
  }

  // 5. Dispatch via LocalStorage event (triggers window.addEventListener('storage') in Payana tabs)
  try {
    localStorage.setItem(
      STORAGE_KEYS.SYNC_EVENT,
      JSON.stringify({
        ...syncPayload,
        _nonce: Date.now() + Math.random(),
      })
    );

    // Append to ticket history
    const rawHistory = localStorage.getItem(STORAGE_KEYS.TICKET_HISTORY);
    const history = rawHistory ? JSON.parse(rawHistory) : [];
    history.unshift(syncPayload);
    localStorage.setItem(STORAGE_KEYS.TICKET_HISTORY, JSON.stringify(history.slice(0, 50)));
  } catch (err) {
    console.warn('LocalStorage sync error', err);
  }

  // 6. Cross-Window / Parent / Opener postMessage
  try {
    if (window.opener && !window.opener.closed) {
      window.opener.postMessage(syncPayload, '*');
    }
    if (window.parent && window.parent !== window) {
      window.parent.postMessage(syncPayload, '*');
    }
  } catch (err) {
    console.warn('postMessage error', err);
  }

  // 7. Dispatch custom DOM event in the current window
  window.dispatchEvent(
    new CustomEvent('payana-ticket-purchased', {
      detail: syncPayload,
    })
  );

  // 8. Safe background fetch ping if local server/backend is running on typical dev ports
  const potentialEndpoints = [
    'http://localhost:3000/api/tickets',
    'http://localhost:5174/api/tickets',
  ];
  potentialEndpoints.forEach((url) => {
    fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(syncPayload),
      mode: 'no-cors',
    }).catch(() => {
      // Safe no-op if local port is not listening
    });
  });

  return syncPayload;
}

