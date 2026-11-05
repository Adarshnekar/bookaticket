# BMTC Namma Ride | ನಮ್ಮ ಬಸ್ - Bus Ticket Booking System

A complete, responsive digital ticketing and live tracking web application for the Bangalore Metropolitan Transport Corporation (BMTC). Built with React, Vite, Tailwind CSS, React Router DOM, React Leaflet, OpenStreetMap, qrcode.react, jsPDF, and LocalStorage persistence.

## 🚀 Key Features

1. **Screen 1: Booking & Search (`/`)**
   - Boarding stop selector (default: *Shivajinagar Bus Station*) and Destination selector (default: *Whitefield TTMC*)
   - Instant stop swap button with smooth animation
   - Passenger details input & travel date picker with *Peak Hours* badge
   - Ticket quantity stepper with digital zero-surcharge validation
   - Service filters: *All Services*, *Non-AC*, *AC Electric*, *Volvo Vajra*
   - Interactive bus cards displaying route number, service category, departure time, seat availability, and fare
   - Sticky booking summary with live totals and one-click navigation to Checkout

2. **Screen 2: Multi-Passenger Checkout (`/checkout`)**
   - Route and bus overview with platform/bay information and live GPS status
   - Dynamic passenger steppers for Adult (₹35), Child (₹20), and Senior Concession (₹18)
   - Synchronized dynamic passenger detail forms (Full Name, Age, Gender, Mobile Number) that automatically add/remove cards based on ticket quantity
   - Itemized fare breakdown with ₹0 service fee and instant discount
   - Payment method selector: *UPI Instant (GPay/PhonePe/Paytm)*, *BMTC Smart Card / Pass*, *Cards / Net Banking*
   - Simulated 4-stage payment modal with loading progression and celebratory confetti animation

3. **Screen 3: Confirmed Ticket (`/confirmation/:ticketId`)**
   - Digital e-ticket card styled with authentic perforated dashed edges and semicircular side cutouts
   - Real-time cryptographic QR code generated with `qrcode.react`
   - Fullscreen QR zoom modal with high-contrast screen toggle for conductor scanning
   - Dynamic non-duplicate commuter seat allocation chips (e.g. *Rohan (A) Seat #14*, *Priya (A) Seat #15*, *Aarav (C) Seat #16*)
   - Interactive OpenStreetMap route tracker powered by React Leaflet with simulated moving bus marker, speed telemetry, and route timeline
   - Downloadable official BMTC PDF ticket receipt using `jsPDF`
   - Web Share API integration with clipboard fallback
   - "Book Another Ticket" flow with state cleanup

## 🛠️ Tech Stack

- **Framework**: React 19 + Vite
- **Styling**: Tailwind CSS
- **Routing**: React Router DOM (v7)
- **State & Persistence**: React Context API + LocalStorage
- **Icons**: Lucide React
- **QR Code**: `qrcode.react`
- **Mapping & GIS**: React Leaflet + Leaflet + OpenStreetMap
- **PDF Generation**: `jsPDF`
- **Notifications**: `react-hot-toast`
- **Animations**: `canvas-confetti`

## 🏃‍♂️ How to Run Locally

```bash
# 1. Install dependencies (if not already installed)
npm install

# 2. Start Vite development server
npm run dev

# 3. Open browser at
http://localhost:5173
```

