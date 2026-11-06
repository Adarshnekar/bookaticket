import { BMTC_STOPS, PAYANA_ROUTES } from './stops';

/**
 * Standard Default Route Buses (Shivajinagar ➔ Whitefield TTMC)
 * Preserved for default initial load & backwards compatibility
 */
export const DEFAULT_BUS_ROUTES = [
  {
    id: 'bmtc-335e-morning',
    busNumber: '335E',
    serviceCategory: 'Non-AC',
    type: 'Non-AC Ordinary Express',
    routeLabel: 'Shivajinagar ➔ Whitefield TTMC via HAL Old Airport Rd',
    origin: 'Shivajinagar Bus Station',
    destination: 'Whitefield TTMC',
    via: 'HAL Old Airport Rd, Marathahalli',
    departureTime: '08:45 AM',
    arrivalTime: '09:40 AM',
    duration: '55 mins',
    availableSeats: 30,
    totalSeats: 48,
    adultFare: 35,
    childFare: 20,
    seniorFare: 18,
    platform: 'Platform 3',
    bay: 'Bay 2',
    isGpsActive: true,
    liveStatus: 'On Time • 1.2 km away',
    etaMinutes: 6,
    busCurrentLocation: {
      lat: 12.9815,
      lng: 77.6190,
      heading: 105,
      address: 'Near Trinity Circle / MG Road',
      speedKm: 28,
    },
    waypoints: [
      { name: 'Shivajinagar Bus Station', lat: 12.9863, lng: 77.6047, time: '08:45 AM', passed: true },
      { name: 'MG Road Metro', lat: 12.9756, lng: 77.6066, time: '08:52 AM', passed: true },
      { name: 'Domlur TTMC', lat: 12.9609, lng: 77.6387, time: '09:05 AM', passed: false },
      { name: 'HAL Old Airport Gate', lat: 12.9553, lng: 77.6682, time: '09:18 AM', passed: false },
      { name: 'Marathahalli Bridge', lat: 12.9562, lng: 77.7011, time: '09:28 AM', passed: false },
      { name: 'Kundalahalli Gate', lat: 12.9647, lng: 77.7183, time: '09:34 AM', passed: false },
      { name: 'Whitefield TTMC', lat: 12.9698, lng: 77.7499, time: '09:40 AM', passed: false },
    ],
  },
  {
    id: 'bmtc-500c-morning',
    busNumber: '500C',
    serviceCategory: 'AC Electric',
    type: 'AC Electric Metro Feeder',
    routeLabel: 'Shivajinagar ➔ Whitefield via Marathahalli Bridge',
    origin: 'Shivajinagar Bus Station',
    destination: 'Whitefield TTMC',
    via: 'Indiranagar 100ft Rd, Marathahalli',
    departureTime: '08:30 AM',
    arrivalTime: '09:22 AM',
    duration: '52 mins',
    availableSeats: 22,
    totalSeats: 42,
    adultFare: 55,
    childFare: 30,
    seniorFare: 28,
    platform: 'Platform 4',
    bay: 'Bay 1',
    isGpsActive: true,
    liveStatus: 'On Time • 2.5 km away',
    etaMinutes: 11,
    busCurrentLocation: {
      lat: 12.9780,
      lng: 77.6310,
      heading: 98,
      address: 'Domlur Flyover Ramp',
      speedKm: 34,
    },
    waypoints: [
      { name: 'Shivajinagar Bus Station', lat: 12.9863, lng: 77.6047, time: '08:30 AM', passed: true },
      { name: 'Ulsoor Lake', lat: 12.9819, lng: 77.6200, time: '08:38 AM', passed: true },
      { name: 'Indiranagar 100ft Rd', lat: 12.9698, lng: 77.6432, time: '08:48 AM', passed: false },
      { name: 'Marathahalli Bridge', lat: 12.9562, lng: 77.7011, time: '09:05 AM', passed: false },
      { name: 'Whitefield TTMC', lat: 12.9698, lng: 77.7499, time: '09:22 AM', passed: false },
    ],
  },
  {
    id: 'bmtc-v600-morning',
    busNumber: 'V600',
    serviceCategory: 'Volvo Vajra',
    type: 'Volvo Vajra Air-Conditioned',
    routeLabel: 'Banashankari ➔ Whitefield Express (via Shivajinagar)',
    origin: 'Shivajinagar Bus Station',
    destination: 'Whitefield TTMC',
    via: 'Richmond Circle, MG Rd, Varthur Rd',
    departureTime: '10:00 AM',
    arrivalTime: '10:50 AM',
    duration: '50 mins',
    availableSeats: 10,
    totalSeats: 38,
    adultFare: 90,
    childFare: 45,
    seniorFare: 45,
    platform: 'Platform 1',
    bay: 'Bay 3',
    isGpsActive: true,
    liveStatus: 'Starting in 20 mins',
    etaMinutes: 20,
    busCurrentLocation: {
      lat: 12.9855,
      lng: 77.6052,
      heading: 110,
      address: 'Shivajinagar Terminal Yard',
      speedKm: 0,
    },
    waypoints: [
      { name: 'Shivajinagar Bus Station', lat: 12.9863, lng: 77.6047, time: '10:00 AM', passed: false },
      { name: 'Mayo Hall / MG Road', lat: 12.9734, lng: 77.6105, time: '10:10 AM', passed: false },
      { name: 'HAL Helicopter Division', lat: 12.9560, lng: 77.6740, time: '10:28 AM', passed: false },
      { name: 'Whitefield TTMC', lat: 12.9698, lng: 77.7499, time: '10:50 AM', passed: false },
    ],
  },
  {
    id: 'bmtc-401k-morning',
    busNumber: '401K',
    serviceCategory: 'AC Electric',
    type: 'AC Electric Eco Express',
    routeLabel: 'Shivajinagar ➔ Whitefield Metro Concourse',
    origin: 'Shivajinagar Bus Station',
    destination: 'Whitefield TTMC',
    via: 'Baiyappanahalli, Hoodi Junction',
    departureTime: '09:15 AM',
    arrivalTime: '10:05 AM',
    duration: '50 mins',
    availableSeats: 18,
    totalSeats: 40,
    adultFare: 60,
    childFare: 30,
    seniorFare: 30,
    platform: 'Platform 2',
    bay: 'Bay 2',
    isGpsActive: true,
    liveStatus: 'On Time • 3.8 km away',
    etaMinutes: 14,
    busCurrentLocation: {
      lat: 12.9890,
      lng: 77.6400,
      heading: 85,
      address: 'Swami Vivekananda Road',
      speedKm: 31,
    },
    waypoints: [
      { name: 'Shivajinagar Bus Station', lat: 12.9863, lng: 77.6047, time: '09:15 AM', passed: true },
      { name: 'Baiyappanahalli Metro', lat: 12.9912, lng: 77.6521, time: '09:30 AM', passed: false },
      { name: 'Hoodi Circle', lat: 12.9918, lng: 77.7161, time: '09:48 AM', passed: false },
      { name: 'Whitefield TTMC', lat: 12.9698, lng: 77.7499, time: '10:05 AM', passed: false },
    ],
  },
  {
    id: 'bmtc-335exp-early',
    busNumber: '335-EXP',
    serviceCategory: 'Non-AC',
    type: 'Non-AC Fast Passenger',
    routeLabel: 'Shivajinagar ➔ Whitefield Express',
    origin: 'Shivajinagar Bus Station',
    destination: 'Whitefield TTMC',
    via: 'HAL Old Airport Rd Direct',
    departureTime: '07:45 AM',
    arrivalTime: '08:35 AM',
    duration: '50 mins',
    availableSeats: 26,
    totalSeats: 48,
    adultFare: 35,
    childFare: 20,
    seniorFare: 18,
    platform: 'Platform 3',
    bay: 'Bay 1',
    isGpsActive: true,
    liveStatus: 'Departs shortly',
    etaMinutes: 2,
    busCurrentLocation: {
      lat: 12.9865,
      lng: 77.6049,
      heading: 100,
      address: 'Shivajinagar Bay 1',
      speedKm: 5,
    },
    waypoints: [
      { name: 'Shivajinagar Bus Station', lat: 12.9863, lng: 77.6047, time: '07:45 AM', passed: false },
      { name: 'Domlur TTMC', lat: 12.9609, lng: 77.6387, time: '08:02 AM', passed: false },
      { name: 'Marathahalli', lat: 12.9562, lng: 77.7011, time: '08:20 AM', passed: false },
      { name: 'Whitefield TTMC', lat: 12.9698, lng: 77.7499, time: '08:35 AM', passed: false },
    ],
  },
  {
    id: 'bmtc-v335e-premium',
    busNumber: 'V-335E',
    serviceCategory: 'Volvo Vajra',
    type: 'Volvo Vajra Luxury',
    routeLabel: 'Shivajinagar ➔ ITPL & Whitefield',
    origin: 'Shivajinagar Bus Station',
    destination: 'Whitefield TTMC',
    via: 'HAL, Marathahalli, ITPL Main Rd',
    departureTime: '08:15 AM',
    arrivalTime: '09:05 AM',
    duration: '50 mins',
    availableSeats: 14,
    totalSeats: 36,
    adultFare: 80,
    childFare: 40,
    seniorFare: 40,
    platform: 'Platform 1',
    bay: 'Bay 2',
    isGpsActive: true,
    liveStatus: 'In Transit • 800m away',
    etaMinutes: 4,
    busCurrentLocation: {
      lat: 12.9840,
      lng: 77.6120,
      heading: 100,
      address: 'Dickenson Road Crossing',
      speedKm: 22,
    },
    waypoints: [
      { name: 'Shivajinagar Bus Station', lat: 12.9863, lng: 77.6047, time: '08:15 AM', passed: true },
      { name: 'Domlur Flyover', lat: 12.9609, lng: 77.6387, time: '08:30 AM', passed: false },
      { name: 'ITPL Main Gate', lat: 12.9868, lng: 77.7381, time: '08:55 AM', passed: false },
      { name: 'Whitefield TTMC', lat: 12.9698, lng: 77.7499, time: '09:05 AM', passed: false },
    ],
  },
];

export const BUS_ROUTES = DEFAULT_BUS_ROUTES;

export const SERVICE_FILTERS = [
  { id: 'all', label: 'All Services', count: 6 },
  { id: 'Non-AC', label: 'Non-AC', count: 2 },
  { id: 'AC Electric', label: 'AC Electric', count: 2 },
  { id: 'Volvo Vajra', label: 'Volvo Vajra', count: 2 },
];

/**
 * Calculate Approximate Distance between two lat/lng coordinates (km)
 */
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Earth radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.max(3, Math.round(R * c));
}

/**
 * Determine a realistic Route Number based on origin/destination
 */
function deriveRouteNumber(originName, destName) {
  const combined = (originName + ' ' + destName).toLowerCase();
  if (combined.includes('airport') || combined.includes('kia')) return 'KIA-9';
  if (combined.includes('silk board') && combined.includes('hebbal')) return '500-C';
  if (combined.includes('silk board') && combined.includes('marathahalli')) return '500-D';
  if (combined.includes('electronic city') && combined.includes('majestic')) return '401-E';
  if (combined.includes('whitefield') && combined.includes('majestic')) return '210-D';
  if (combined.includes('whitefield') && combined.includes('shivajinagar')) return '335-E';
  if (combined.includes('jayanagar') && combined.includes('indiranagar')) return '600-B';
  if (combined.includes('koramangala') && combined.includes('hebbal')) return '335-G';
  if (combined.includes('kengeri') && combined.includes('electronic city')) return '378';
  if (combined.includes('banashankari') && combined.includes('btm')) return '2-F';
  if (combined.includes('bannerghatta')) return '365';
  if (combined.includes('malleshwaram')) return '252-F';
  if (combined.includes('yelahanka')) return '285-M';
  if (combined.includes('banashankari') && combined.includes('domlur')) return '201-G';

  // Fallback to route hash
  const hash = Math.abs(
    combined.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
  );
  const prefixes = ['335', '500', '401', '210', '201', 'G-', 'V-', '600', '252', '365'];
  const p = prefixes[hash % prefixes.length];
  const letters = ['A', 'C', 'D', 'E', 'K', 'M', 'G', 'F'];
  return `${p}${letters[hash % letters.length]}`;
}

/**
 * Generate Dynamic Realistic BMTC Buses for ANY Route
 */
export function getBusesForRoute(originName, destName) {
  if (!originName || !destName) return DEFAULT_BUS_ROUTES;

  // Direct match with default route
  if (
    originName.includes('Shivajinagar') &&
    destName.includes('Whitefield')
  ) {
    return DEFAULT_BUS_ROUTES;
  }

  // Find stop metadata
  const originStop = BMTC_STOPS.find(
    (s) => s.name === originName || originName.includes(s.shortName)
  ) || {
    name: originName,
    shortName: originName.split(' ')[0],
    lat: 12.9774,
    lng: 77.5708,
    platforms: ['Platform 1', 'Bay 1'],
  };

  const destStop = BMTC_STOPS.find(
    (s) => s.name === destName || destName.includes(s.shortName)
  ) || {
    name: destName,
    shortName: destName.split(' ')[0],
    lat: 12.9698,
    lng: 77.7499,
    platforms: ['Platform 2', 'Bay 2'],
  };

  const distanceKm = calculateDistance(originStop.lat, originStop.lng, destStop.lat, destStop.lng);
  const travelMins = Math.max(15, Math.round(distanceKm * 2.8 + 8));
  const baseRouteNo = deriveRouteNumber(originName, destName);

  // Intermediate midpoint for realistic waypoints and live GPS simulation
  const midLat = (originStop.lat + destStop.lat) / 2 + (Math.random() - 0.5) * 0.01;
  const midLng = (originStop.lng + destStop.lng) / 2 + (Math.random() - 0.5) * 0.01;

  // Realistic fare calculation by distance & BMTC tariff
  const nonAcAdult = Math.min(60, Math.max(15, Math.round(distanceKm * 1.5 + 10)));
  const acAdult = Math.min(100, Math.max(35, Math.round(distanceKm * 2.5 + 20)));
  const volvoAdult = Math.min(160, Math.max(60, Math.round(distanceKm * 4.0 + 35)));

  return [
    {
      id: `bmtc-${baseRouteNo.toLowerCase()}-exp`,
      busNumber: baseRouteNo,
      serviceCategory: 'Non-AC',
      type: 'Non-AC Ordinary Express',
      routeLabel: `${originStop.shortName} ➔ ${destStop.shortName} Express`,
      origin: originStop.name,
      destination: destStop.name,
      via: `Main Corridor, ${originStop.shortName} Junction`,
      departureTime: '08:30 AM',
      arrivalTime: '09:15 AM',
      duration: `${travelMins} mins`,
      availableSeats: 26,
      totalSeats: 48,
      adultFare: nonAcAdult,
      childFare: Math.round(nonAcAdult * 0.55),
      seniorFare: Math.round(nonAcAdult * 0.5),
      platform: originStop.platforms?.[0] || 'Platform 1',
      bay: 'Bay 1',
      isGpsActive: true,
      liveStatus: 'On Time • 1.4 km away',
      etaMinutes: 5,
      busCurrentLocation: {
        lat: originStop.lat + (destStop.lat - originStop.lat) * 0.15,
        lng: originStop.lng + (destStop.lng - originStop.lng) * 0.15,
        heading: 95,
        address: `Approaching ${originStop.shortName}`,
        speedKm: 27,
      },
      waypoints: [
        { name: originStop.name, lat: originStop.lat, lng: originStop.lng, time: '08:30 AM', passed: true },
        { name: `${originStop.shortName} Circle`, lat: originStop.lat + 0.01, lng: originStop.lng + 0.01, time: '08:42 AM', passed: true },
        { name: 'City Transit Mid-point', lat: midLat, lng: midLng, time: '08:58 AM', passed: false },
        { name: `${destStop.shortName} Bypass`, lat: destStop.lat - 0.008, lng: destStop.lng - 0.008, time: '09:08 AM', passed: false },
        { name: destStop.name, lat: destStop.lat, lng: destStop.lng, time: '09:15 AM', passed: false },
      ],
    },
    {
      id: `bmtc-${baseRouteNo.toLowerCase()}-electric`,
      busNumber: `${baseRouteNo}-E`,
      serviceCategory: 'AC Electric',
      type: 'AC Electric Metro Feeder',
      routeLabel: `${originStop.shortName} ➔ ${destStop.shortName} Eco Express`,
      origin: originStop.name,
      destination: destStop.name,
      via: 'Fast Concourse, Ring Road Flyover',
      departureTime: '08:45 AM',
      arrivalTime: '09:28 AM',
      duration: `${Math.max(12, travelMins - 4)} mins`,
      availableSeats: 19,
      totalSeats: 42,
      adultFare: acAdult,
      childFare: Math.round(acAdult * 0.55),
      seniorFare: Math.round(acAdult * 0.5),
      platform: originStop.platforms?.[1] || 'Platform 2',
      bay: 'Bay 2',
      isGpsActive: true,
      liveStatus: 'On Time • 3.2 km away',
      etaMinutes: 12,
      busCurrentLocation: {
        lat: originStop.lat + (destStop.lat - originStop.lat) * 0.25,
        lng: originStop.lng + (destStop.lng - originStop.lng) * 0.25,
        heading: 102,
        address: 'Outer Ring Corridor',
        speedKm: 35,
      },
      waypoints: [
        { name: originStop.name, lat: originStop.lat, lng: originStop.lng, time: '08:45 AM', passed: true },
        { name: 'Metro Interchange Station', lat: midLat + 0.005, lng: midLng + 0.005, time: '09:05 AM', passed: false },
        { name: destStop.name, lat: destStop.lat, lng: destStop.lng, time: '09:28 AM', passed: false },
      ],
    },
    {
      id: `bmtc-v${baseRouteNo.toLowerCase()}-luxury`,
      busNumber: `V-${baseRouteNo}`,
      serviceCategory: 'Volvo Vajra',
      type: 'Volvo Vajra Luxury AC',
      routeLabel: `${originStop.shortName} ➔ ${destStop.shortName} Luxury AC`,
      origin: originStop.name,
      destination: destStop.name,
      via: 'Elevated Corridor Direct Express',
      departureTime: '09:05 AM',
      arrivalTime: '09:45 AM',
      duration: `${Math.max(10, travelMins - 8)} mins`,
      availableSeats: 8,
      totalSeats: 36,
      adultFare: volvoAdult,
      childFare: Math.round(volvoAdult * 0.5),
      seniorFare: Math.round(volvoAdult * 0.5),
      platform: originStop.platforms?.[0] || 'Platform 1',
      bay: 'Bay 3',
      isGpsActive: true,
      liveStatus: 'Starting in 18 mins',
      etaMinutes: 18,
      busCurrentLocation: {
        lat: originStop.lat,
        lng: originStop.lng,
        heading: 110,
        address: `${originStop.shortName} Departure Bay`,
        speedKm: 0,
      },
      waypoints: [
        { name: originStop.name, lat: originStop.lat, lng: originStop.lng, time: '09:05 AM', passed: false },
        { name: 'Elevated Flyover Ramp', lat: midLat, lng: midLng, time: '09:25 AM', passed: false },
        { name: destStop.name, lat: destStop.lat, lng: destStop.lng, time: '09:45 AM', passed: false },
      ],
    },
    {
      id: `bmtc-${baseRouteNo.toLowerCase()}-regular`,
      busNumber: `${baseRouteNo}-R`,
      serviceCategory: 'Non-AC',
      type: 'Non-AC Regular Passenger',
      routeLabel: `${originStop.shortName} ➔ ${destStop.shortName} Local`,
      origin: originStop.name,
      destination: destStop.name,
      via: 'All Intermediate City Stages',
      departureTime: '09:20 AM',
      arrivalTime: '10:10 AM',
      duration: `${travelMins + 5} mins`,
      availableSeats: 34,
      totalSeats: 48,
      adultFare: nonAcAdult,
      childFare: Math.round(nonAcAdult * 0.55),
      seniorFare: Math.round(nonAcAdult * 0.5),
      platform: originStop.platforms?.[originStop.platforms.length - 1] || 'Platform 3',
      bay: 'Bay 1',
      isGpsActive: true,
      liveStatus: 'Scheduled on time',
      etaMinutes: 30,
      busCurrentLocation: {
        lat: originStop.lat - 0.005,
        lng: originStop.lng - 0.005,
        heading: 80,
        address: 'Depot Yard',
        speedKm: 0,
      },
      waypoints: [
        { name: originStop.name, lat: originStop.lat, lng: originStop.lng, time: '09:20 AM', passed: false },
        { name: 'City Market Halt', lat: midLat - 0.005, lng: midLng - 0.005, time: '09:45 AM', passed: false },
        { name: destStop.name, lat: destStop.lat, lng: destStop.lng, time: '10:10 AM', passed: false },
      ],
    },
  ];
}
