import { jsPDF } from 'jspdf';

/**
 * Generate and download BMTC Digital Bus Ticket Receipt PDF
 */
export function generateTicketPDF(booking) {
  if (!booking) return;

  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const primaryRed = [200, 16, 46];
  const darkRed = [163, 13, 37];
  const slateDark = [30, 41, 59];
  const slateMuted = [100, 116, 139];
  const bgLight = [249, 249, 255];

  // Header background banner
  doc.setFillColor(...primaryRed);
  doc.rect(0, 0, 210, 40, 'F');

  // Decorative accent line
  doc.setFillColor(255, 215, 0); // Gold
  doc.rect(0, 40, 210, 2, 'F');

  // Header Title
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.text('BMTC NAMMA RIDE', 14, 18);

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text('Bangalore Metropolitan Transport Corporation | ನಮ್ಮ ಬಸ್', 14, 25);
  doc.text('Official Commuter E-Ticket & Payment Receipt', 14, 32);

  // Status Badge on top right
  doc.setFillColor(16, 185, 129); // Green
  doc.roundedRect(150, 12, 46, 10, 2, 2, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.text('VALID & ACTIVE', 155, 18.5);

  // Ticket Meta Card
  doc.setFillColor(...bgLight);
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(14, 48, 182, 30, 3, 3, 'FD');

  doc.setTextColor(...slateMuted);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.text('TICKET ID', 20, 56);
  doc.text('BOOKING DATE & TIME', 80, 56);
  doc.text('PAYMENT STATUS', 145, 56);

  doc.setTextColor(...primaryRed);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text(booking.ticketId || 'NR-UNKNOWN', 20, 65);

  doc.setTextColor(...slateDark);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(booking.bookingTimestamp || new Date().toLocaleString(), 80, 64);

  doc.setTextColor(16, 185, 129);
  doc.setFont('helvetica', 'bold');
  doc.text('SUCCESS (PAID)', 145, 64);

  // Route & Journey Details Card
  doc.setFillColor(255, 255, 255);
  doc.setDrawColor(203, 213, 225);
  doc.roundedRect(14, 84, 182, 54, 3, 3, 'FD');

  doc.setTextColor(...slateDark);
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text('JOURNEY & SERVICE INFORMATION', 20, 92);

  doc.setDrawColor(241, 245, 249);
  doc.line(20, 95, 190, 95);

  // Route Grid
  doc.setFontSize(9);
  doc.setTextColor(...slateMuted);
  doc.text('BUS ROUTE NUMBER', 20, 102);
  doc.text('SERVICE TYPE', 75, 102);
  doc.text('PLATFORM / BAY', 135, 102);

  doc.setTextColor(...slateDark);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text(booking.busRoute?.busNumber || '335E', 20, 109);

  doc.setFontSize(10);
  doc.text(booking.busRoute?.serviceCategory || 'Non-AC', 75, 109);
  doc.text(`${booking.busRoute?.platform || 'Platform 3'}, ${booking.busRoute?.bay || 'Bay 2'}`, 135, 109);

  // Stops
  doc.setFontSize(9);
  doc.setTextColor(...slateMuted);
  doc.text('BOARDING STOP', 20, 118);
  doc.text('DESTINATION STOP', 75, 118);
  doc.text('DEPARTURE TIME', 135, 118);

  doc.setTextColor(...slateDark);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text(booking.boardingStop || 'Shivajinagar Bus Station', 20, 125);
  doc.text(booking.destinationStop || 'Whitefield TTMC', 75, 125);
  doc.text(`${booking.busRoute?.departureTime || '08:45 AM'} (${booking.travelDate})`, 135, 125);

  // Passengers Section
  let currentY = 146;
  doc.setTextColor(...slateDark);
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text(`TICKET & SEAT ALLOCATION (${booking.passengers?.length || 0} SEATS RESERVED)`, 14, currentY);

  currentY += 4;
  // Table Header
  doc.setFillColor(241, 245, 249);
  doc.rect(14, currentY, 182, 8, 'F');
  doc.setTextColor(...slateMuted);
  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'bold');
  doc.text('SEAT #', 18, currentY + 5.5);
  doc.text('TICKET CATEGORY', 50, currentY + 5.5);
  doc.text('FARE TYPE', 115, currentY + 5.5);
  doc.text('STATUS', 170, currentY + 5.5);

  currentY += 8;
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...slateDark);
  doc.setFontSize(9);

  (booking.passengers || []).forEach((p, idx) => {
    const isEven = idx % 2 === 0;
    if (isEven) {
      doc.setFillColor(250, 250, 252);
      doc.rect(14, currentY, 182, 8, 'F');
    }

    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...primaryRed);
    doc.text(`#${p.seatNumber || idx + 14}`, 20, currentY + 5.5);

    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...slateDark);
    doc.text(`${p.type || 'Adult'} Commuter Ticket`, 50, currentY + 5.5);
    doc.text(p.type === 'Child' ? '50% Concession' : p.type === 'Senior' ? 'Senior Concession' : 'Standard Full Fare', 115, currentY + 5.5);

    doc.setTextColor(16, 185, 129);
    doc.text('CONFIRMED', 170, currentY + 5.5);

    currentY += 8;
  });

  // Fare Breakdown & Payment
  currentY += 6;
  doc.setFillColor(...bgLight);
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(14, currentY, 182, 44, 3, 3, 'FD');

  doc.setTextColor(...slateDark);
  doc.setFontSize(10.5);
  doc.setFont('helvetica', 'bold');
  doc.text('FARE BREAKDOWN & PAYMENT RECEIPT', 20, currentY + 8);

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...slateMuted);

  const fb = booking.fareBreakdown || {};
  doc.text(`Adults (${fb.adultCount || 0} × ₹${fb.adultRate || 35}):`, 20, currentY + 16);
  doc.text(`₹${fb.adultSubtotal || 0}`, 90, currentY + 16);

  if (fb.childCount > 0) {
    doc.text(`Children (${fb.childCount} × ₹${fb.childRate || 20}):`, 20, currentY + 22);
    doc.text(`₹${fb.childSubtotal || 0}`, 90, currentY + 22);
  }

  if (fb.seniorCount > 0) {
    doc.text(`Senior Concession (${fb.seniorCount} × ₹${fb.seniorRate || 18}):`, 20, currentY + 28);
    doc.text(`₹${fb.seniorSubtotal || 0}`, 90, currentY + 28);
  }

  doc.text('Digital Convenience / GST:', 20, currentY + 34);
  doc.setTextColor(16, 185, 129);
  doc.text('₹0 (Free / No Surcharge)', 90, currentY + 34);

  // Right side: Total Paid
  doc.setFillColor(...primaryRed);
  doc.roundedRect(125, currentY + 12, 65, 24, 2, 2, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'normal');
  doc.text('TOTAL AMOUNT PAID', 130, currentY + 19);

  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text(`₹${booking.totalFare || 0}`, 130, currentY + 28);

  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.text(`Via: ${booking.paymentMethod || 'UPI Instant'}`, 130, currentY + 33);

  // Instructions & Disclaimer
  currentY += 50;
  doc.setFontSize(8);
  doc.setTextColor(...slateMuted);
  doc.setFont('helvetica', 'bold');
  doc.text('INSTRUCTIONS FOR COMMUTERS:', 14, currentY);

  doc.setFont('helvetica', 'normal');
  currentY += 5;
  doc.text('1. Please carry this digital receipt or show the active QR code on your mobile device to the conductor.', 14, currentY);
  currentY += 4;
  doc.text('2. Ticket is non-transferable and valid for single journey on the specified date & route.', 14, currentY);
  currentY += 4;
  doc.text('3. For customer support or grievance redressal, contact BMTC helpline 080-22483777 or support@bmtc.gov.in.', 14, currentY);
  currentY += 4;
  doc.text('4. Simulated / Demo ticket generated for BMTC Namma Ride system demonstration.', 14, currentY);

  // Bottom line
  doc.setDrawColor(...primaryRed);
  doc.setLineWidth(0.5);
  doc.line(14, 280, 196, 280);

  doc.setFontSize(7.5);
  doc.setTextColor(148, 163, 184);
  doc.text('BMTC Namma Ride E-Transit • Govt of Karnataka • Verified Digital Ticket', 14, 285);
  doc.text(`Page 1 of 1 • Generated ${new Date().toLocaleDateString()}`, 155, 285);

  // Save the PDF
  const filename = `BMTC_Ticket_${booking.ticketId || 'receipt'}.pdf`;
  doc.save(filename);
}

