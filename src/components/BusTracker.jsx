import React, { useState, useEffect, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import { Bus, MapPin, Navigation, Compass, AlertCircle, X, Maximize2, Radio, CheckCircle2 } from 'lucide-react';

// Custom Map center updater helper component
function ChangeView({ center, zoom }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, zoom);
  }, [center, zoom, map]);
  return null;
}

// Custom Leaflet DivIcons to prevent broken png assets
const createBusIcon = (heading = 0) =>
  L.divIcon({
    className: 'custom-bus-marker',
    html: `
      <div class="relative flex items-center justify-center">
        <div class="absolute w-10 h-10 bg-red-500 rounded-full bus-pulse-ring opacity-40"></div>
        <div class="w-9 h-9 bg-[#C8102E] text-white rounded-full flex items-center justify-center shadow-lg border-2 border-white transform transition-transform">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M8 6v6"/><path d="M15 6v6"/><path d="M2 12h19.6"/><path d="M18 18h3s.5-1.7.8-2.8c.1-.4.2-.8.2-1.2 0-.4-.1-.8-.2-1.2l-1.4-5C20.1 6.8 19.2 6 18.2 6H5.8C4.8 6 3.9 6.8 3.6 7.8l-1.4 5c-.1.4-.2.8-.2 1.2 0 .4.1.8.2 1.2.3 1.1.8 2.8.8 2.8h3"/><circle cx="7" cy="18" r="2"/><path d="M9 18h5"/><circle cx="16" cy="18" r="2"/></svg>
        </div>
      </div>
    `,
    iconSize: [40, 40],
    iconAnchor: [20, 20],
  });

const createStopIcon = (color = '#C8102E', label = 'Stop') =>
  L.divIcon({
    className: 'custom-stop-marker',
    html: `
      <div class="flex flex-col items-center">
        <div class="w-6 h-6 rounded-full flex items-center justify-center text-white shadow-md border-2 border-white" style="background-color: ${color}">
          <div class="w-2 h-2 rounded-full bg-white"></div>
        </div>
        <span class="text-[9px] font-bold px-1.5 py-0.5 rounded shadow-xs mt-0.5 whitespace-nowrap bg-white text-slate-800 border border-slate-200">${label}</span>
      </div>
    `,
    iconSize: [50, 40],
    iconAnchor: [25, 20],
  });

export default function BusTracker({ busRoute, boardingStop, destinationStop }) {
  const [isLiveModalOpen, setIsLiveModalOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  const busNumber = busRoute?.busNumber || '335E';
  const platform = busRoute?.platform || 'Platform 3';

  // Coordinate coordinates for route polyline
  const waypoints = useMemo(() => {
    if (busRoute?.waypoints && busRoute.waypoints.length > 0) {
      return busRoute.waypoints;
    }
    // Fallback coordinates between Shivajinagar & Whitefield
    return [
      { name: 'Shivajinagar Bus Stn', lat: 12.9863, lng: 77.6047, time: '08:45 AM', passed: true },
      { name: 'MG Road Trinity', lat: 12.9756, lng: 77.6180, time: '08:52 AM', passed: true },
      { name: 'Domlur TTMC', lat: 12.9609, lng: 77.6387, time: '09:05 AM', passed: false },
      { name: 'HAL Old Airport Rd', lat: 12.9553, lng: 77.6682, time: '09:18 AM', passed: false },
      { name: 'Marathahalli Bridge', lat: 12.9562, lng: 77.7011, time: '09:28 AM', passed: false },
      { name: 'Whitefield TTMC', lat: 12.9698, lng: 77.7499, time: '09:40 AM', passed: false },
    ];
  }, [busRoute]);

  // Simulated live bus coordinates
  const [busPosition, setBusPosition] = useState(() => ({
    lat: waypoints[1]?.lat || 12.9756,
    lng: waypoints[1]?.lng || 77.6180,
    speed: 28,
    distanceKm: '1.2',
    etaMins: 6,
  }));

  // Interval simulation of moving bus slightly along route
  useEffect(() => {
    const timer = setInterval(() => {
      setBusPosition((prev) => {
        const nextLat = prev.lat + (Math.random() - 0.48) * 0.0006;
        const nextLng = prev.lng + (Math.random() - 0.45) * 0.0008;
        const speed = Math.floor(24 + Math.random() * 12);
        return {
          ...prev,
          lat: nextLat,
          lng: nextLng,
          speed,
        };
      });
    }, 3500);

    return () => clearInterval(timer);
  }, []);

  const polylineCoords = waypoints.map((w) => [w.lat, w.lng]);
  const originCoord = waypoints[0] ? [waypoints[0].lat, waypoints[0].lng] : [12.9863, 77.6047];
  const destCoord = waypoints[waypoints.length - 1]
    ? [waypoints[waypoints.length - 1].lat, waypoints[waypoints.length - 1].lng]
    : [12.9698, 77.7499];

  return (
    <>
      {/* Tracker Card matching Screen 3 */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-xs">
        {/* Header */}
        <div className="flex items-center justify-between mb-2.5">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-red-50 text-[#C8102E] flex items-center justify-center">
              <Bus className="w-4 h-4" />
            </div>
            <div>
              <h4 className="font-extrabold text-sm text-slate-900">
                Bus {busNumber} Tracking
              </h4>
              <p className="text-[11px] text-slate-500">
                Arriving {platform.toLowerCase()} in {busPosition.etaMins} mins
              </p>
            </div>
          </div>

          <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            ON TIME
          </span>
        </div>

        {/* Embedded Leaflet Map Preview */}
        <div className="relative w-full h-44 rounded-xl overflow-hidden border border-slate-200 bg-slate-100 mb-3 shadow-inner">
          <MapContainer
            center={[busPosition.lat, busPosition.lng]}
            zoom={12}
            scrollWheelZoom={false}
            attributionControl={false}
            className="w-full h-full"
          >
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <ChangeView center={[busPosition.lat, busPosition.lng]} zoom={12} />

            {/* Route Line */}
            <Polyline
              positions={polylineCoords}
              color="#C8102E"
              weight={4}
              opacity={0.8}
              dashArray="6, 8"
            />

            {/* Origin Stop Marker */}
            <Marker position={originCoord} icon={createStopIcon('#C8102E', 'Boarding')}>
              <Popup>Boarding: {boardingStop}</Popup>
            </Marker>

            {/* Destination Stop Marker */}
            <Marker position={destCoord} icon={createStopIcon('#10B981', 'Alighting')}>
              <Popup>Destination: {destinationStop}</Popup>
            </Marker>

            {/* Bus GPS Marker */}
            <Marker
              position={[busPosition.lat, busPosition.lng]}
              icon={createBusIcon()}
            >
              <Popup>
                <div className="text-xs">
                  <strong>Bus {busNumber}</strong>
                  <br />
                  Speed: {busPosition.speed} km/h
                  <br />
                  Status: Simulated Live GPS
                </div>
              </Popup>
            </Marker>
          </MapContainer>

          {/* Map Bottom Overlay Badge matching screenshot */}
          <div className="absolute bottom-2 left-2 right-2 z-10 flex items-center justify-between bg-slate-900/85 backdrop-blur-md px-3 py-1.5 rounded-xl text-white text-xs">
            <div className="flex items-center gap-1.5">
              <Navigation className="w-3.5 h-3.5 text-emerald-400 rotate-45" />
              <span className="text-[11px] font-medium">
                {busPosition.distanceKm} km away from boarding stop
              </span>
            </div>

            <button
              type="button"
              onClick={() => setIsLiveModalOpen(true)}
              className="bg-white text-slate-900 px-2.5 py-0.5 rounded-lg text-[10px] font-bold hover:bg-slate-100 flex items-center gap-1 transition-colors"
            >
              <span>Map View</span>
              <span>➔</span>
            </button>
          </div>
        </div>

        {/* Live Track Trigger button */}
        <button
          type="button"
          onClick={() => setIsLiveModalOpen(true)}
          className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-98 text-white text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-sm"
        >
          <Compass className="w-4 h-4 text-blue-200" />
          <span>Live Track Bus {busNumber}</span>
        </button>

        <p className="text-[10px] text-center text-slate-400 mt-1.5">
          *Real-time GPS telemetry is currently simulated for demonstration.
        </p>
      </div>

      {/* Expanded Live Tracking Modal */}
      {isLiveModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/75 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden border border-slate-100">
            {/* Modal Header */}
            <div className="bg-[#C8102E] text-white p-4 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                  <Bus className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h3 className="font-extrabold text-sm sm:text-base flex items-center gap-2">
                    <span>BMTC Fleet Telemetry: Route {busNumber}</span>
                    <span className="text-[10px] bg-red-800 text-amber-200 px-1.5 py-0.2 rounded border border-amber-300/30">
                      LIVE
                    </span>
                  </h3>
                  <p className="text-xs text-red-100 opacity-90">
                    {boardingStop} ➔ {destinationStop}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsLiveModalOpen(false)}
                className="p-1.5 rounded-full hover:bg-white/20 transition-colors"
              >
                <X className="w-5 h-5 text-white" />
              </button>
            </div>

            {/* Telemetry Stats Bar */}
            <div className="grid grid-cols-3 gap-2 bg-slate-50 p-3 border-b border-slate-200 text-center text-xs">
              <div className="bg-white p-2 rounded-xl border border-slate-200/80">
                <span className="text-[10px] text-slate-400 uppercase font-semibold block">
                  Speed
                </span>
                <span className="font-black text-slate-900 text-sm">
                  {busPosition.speed} km/h
                </span>
              </div>
              <div className="bg-white p-2 rounded-xl border border-slate-200/80">
                <span className="text-[10px] text-slate-400 uppercase font-semibold block">
                  Distance to You
                </span>
                <span className="font-black text-[#C8102E] text-sm">
                  {busPosition.distanceKm} km
                </span>
              </div>
              <div className="bg-white p-2 rounded-xl border border-slate-200/80">
                <span className="text-[10px] text-slate-400 uppercase font-semibold block">
                  Estimated Arrival
                </span>
                <span className="font-black text-emerald-600 text-sm">
                  ~{busPosition.etaMins} mins
                </span>
              </div>
            </div>

            {/* Large Interactive Leaflet Map */}
            <div className="relative h-64 sm:h-80 w-full bg-slate-100">
              <MapContainer
                center={[busPosition.lat, busPosition.lng]}
                zoom={13}
                scrollWheelZoom={true}
                className="w-full h-full"
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <ChangeView center={[busPosition.lat, busPosition.lng]} zoom={13} />

                {/* Polyline route */}
                <Polyline
                  positions={polylineCoords}
                  color="#C8102E"
                  weight={5}
                  opacity={0.85}
                />

                {/* All waypoints */}
                {waypoints.map((wp, i) => (
                  <Marker
                    key={i}
                    position={[wp.lat, wp.lng]}
                    icon={createStopIcon(
                      i === 0 ? '#C8102E' : i === waypoints.length - 1 ? '#10B981' : '#64748B',
                      wp.name.split(' ')[0]
                    )}
                  >
                    <Popup>
                      <div className="text-xs">
                        <strong>{wp.name}</strong>
                        <br />
                        Scheduled: {wp.time}
                        <br />
                        {wp.passed ? 'Passed' : 'Upcoming stop'}
                      </div>
                    </Popup>
                  </Marker>
                ))}

                {/* Live Bus Marker */}
                <Marker
                  position={[busPosition.lat, busPosition.lng]}
                  icon={createBusIcon()}
                >
                  <Popup>
                    <strong>Bus {busNumber}</strong>
                    <br />
                    Active GPS Signal
                  </Popup>
                </Marker>
              </MapContainer>
            </div>

            {/* Stop Progression Timeline */}
            <div className="p-4 bg-white overflow-y-auto max-h-48 border-t border-slate-100">
              <h5 className="font-bold text-xs text-slate-800 mb-2.5 flex items-center justify-between">
                <span>Route Stops & Schedule</span>
                <span className="text-[10px] text-slate-400 font-normal">
                  GPS ping active every 3s
                </span>
              </h5>

              <div className="space-y-2">
                {waypoints.map((wp, idx) => (
                  <div key={idx} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-3.5 h-3.5 rounded-full flex items-center justify-center text-[9px] ${
                          wp.passed
                            ? 'bg-emerald-500 text-white'
                            : idx === 1
                            ? 'bg-[#C8102E] text-white animate-pulse'
                            : 'border-2 border-slate-300'
                        }`}
                      >
                        {wp.passed && '✓'}
                      </div>
                      <span
                        className={
                          wp.passed
                            ? 'text-slate-400 line-through'
                            : idx === 1
                            ? 'font-bold text-slate-900'
                            : 'text-slate-600'
                        }
                      >
                        {wp.name}
                      </span>
                    </div>
                    <span className="text-[11px] font-mono text-slate-400">{wp.time}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs">
              <div className="flex items-center gap-1.5 text-slate-500 text-[11px]">
                <AlertCircle className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                <span>Simulated transit tracking data</span>
              </div>
              <button
                type="button"
                onClick={() => setIsLiveModalOpen(false)}
                className="px-4 py-1.5 rounded-lg bg-slate-800 text-white font-bold text-xs hover:bg-slate-700"
              >
                Close View
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

