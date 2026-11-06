import { BMTC_STOPS, PAYANA_ROUTES } from '../data/stops';

let cachedServices = null;

/**
 * Load all 2,487 authentic BMTC services from Payana dataset
 */
export async function loadAllPayanaServices() {
  if (cachedServices) return cachedServices;

  try {
    const res = await fetch('/data/transit/services.min.json');
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const rawServices = await res.json();

    const list = [];
    for (const [routeNo, obj] of Object.entries(rawServices)) {
      const name = obj.name || `Route ${routeNo}`;
      const parts = name.split('⇔').map((s) => s.trim());
      const from = parts[0] || '';
      const to = parts[1] || '';

      list.push({
        id: `payana-${routeNo}`,
        routeNo,
        name,
        from,
        to,
      });
    }

    cachedServices = list;
    return list;
  } catch (err) {
    console.warn('Could not load services.min.json, falling back to curated routes', err);
    return PAYANA_ROUTES.map((r) => ({
      id: r.id,
      routeNo: r.routeNumber,
      name: `${r.from} ⇔ ${r.to}`,
      from: r.from,
      to: r.to,
    }));
  }
}

/**
 * Search all BMTC routes by route number or place name
 */
export function searchRoutesInList(servicesList, query, limit = 20) {
  if (!query || !query.trim()) return servicesList.slice(0, limit);
  const q = query.trim().toLowerCase();

  const exactMatches = [];
  const startMatches = [];
  const includeMatches = [];

  for (const s of servicesList) {
    const rNo = s.routeNo.toLowerCase();
    const fromL = s.from.toLowerCase();
    const toL = s.to.toLowerCase();
    const nameL = s.name.toLowerCase();

    if (rNo === q) {
      exactMatches.push(s);
    } else if (rNo.startsWith(q)) {
      startMatches.push(s);
    } else if (rNo.includes(q) || fromL.includes(q) || toL.includes(q) || nameL.includes(q)) {
      includeMatches.push(s);
    }

    if (exactMatches.length + startMatches.length + includeMatches.length >= limit * 2) {
      break;
    }
  }

  return [...exactMatches, ...startMatches, ...includeMatches].slice(0, limit);
}

