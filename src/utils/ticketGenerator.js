/**
 * Ticket and seat number generator utility
 */

export function generateTicketId() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let randomStr = '';
  for (let i = 0; i < 8; i++) {
    randomStr += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `NR-${randomStr}`;
}

export function generateSeatAllocations(passengers = []) {
  // Generate random non-overlapping seat numbers between 1 and 42
  const usedSeats = new Set();
  return passengers.map((p, idx) => {
    let seatNum;
    do {
      seatNum = Math.floor(Math.random() * 38) + 1;
    } while (usedSeats.has(seatNum));
    usedSeats.add(seatNum);

    const type = p.type || 'Adult';

    return {
      ...p,
      seatNumber: seatNum,
      seatBadge: `#${seatNum}`,
      displayTag: `${type} Seat #${seatNum}`,
    };
  });
}

export function formatQRData({
  ticketId,
  busNumber,
  boardingStop,
  destinationStop,
  travelDate,
  passengerCount,
  totalFare,
}) {
  return JSON.stringify({
    app: 'BMTC-Namma-Ride',
    ticketId,
    bus: busNumber,
    from: boardingStop,
    to: destinationStop,
    date: travelDate,
    passengers: passengerCount,
    fare: `INR ${totalFare}`,
    status: 'ACTIVE_VALID',
    securityHash: Math.random().toString(36).substring(2, 10).toUpperCase(),
    validUntil: '3 Hours from issuance',
  });
}

export function getFormattedTodayDate() {
  const d = new Date();
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const day = String(d.getDate()).padStart(2, '0');
  const month = months[d.getMonth()];
  const year = d.getFullYear();
  return `${day} ${month} ${year}`;
}

