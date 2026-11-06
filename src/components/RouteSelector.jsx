import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Search, Bus, X, ArrowRight, Sparkles, Compass, MapPin } from 'lucide-react';
import { PAYANA_ROUTES, BMTC_STOPS } from '../data/stops';
import { loadAllPayanaServices, searchRoutesInList } from '../utils/transitRoutes';

export default function RouteSelector({
  boardingStop,
  destinationStop,
  onSelectRoute,
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [allServices, setAllServices] = useState([]);
  const [modalSearch, setModalSearch] = useState('');
  const [modalCategory, setModalCategory] = useState('All');
  const dropdownRef = useRef(null);

  // Lazy load all 2,487 services from Payana dataset
  useEffect(() => {
    loadAllPayanaServices().then((services) => {
      setAllServices(services);
    });
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Matching routes for the quick search input
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const query = searchQuery.trim().toLowerCase();

    // 1. Check curated PAYANA_ROUTES first
    const curatedMatches = PAYANA_ROUTES.filter(
      (r) =>
        r.routeNumber.toLowerCase().includes(query) ||
        r.from.toLowerCase().includes(query) ||
        r.to.toLowerCase().includes(query) ||
        (r.via && r.via.toLowerCase().includes(query))
    ).map((r) => ({
      routeNo: r.routeNumber,
      from: r.from,
      to: r.to,
      via: r.via,
      badge: r.badge || 'Express',
      isCurated: true,
    }));

    // 2. Check all BMTC services
    const serviceMatches = searchRoutesInList(allServices, query, 12).map((s) => ({
      routeNo: s.routeNo,
      from: s.from,
      to: s.to,
      via: '',
      badge: 'BMTC Service',
      isCurated: false,
    }));

    // Combine and deduplicate by routeNo + from + to
    const seen = new Set();
    const combined = [];
    for (const item of [...curatedMatches, ...serviceMatches]) {
      const key = `${item.routeNo}-${item.from}-${item.to}`;
      if (!seen.has(key)) {
        seen.add(key);
        combined.push(item);
      }
    }
    return combined.slice(0, 10);
  }, [searchQuery, allServices]);

  const handleSelect = (from, to) => {
    onSelectRoute(from, to);
    setSearchQuery('');
    setIsDropdownOpen(false);
    setIsModalOpen(false);
  };

  // Find if a curated route is currently active
  const activeCuratedId = useMemo(() => {
    const match = PAYANA_ROUTES.find(
      (r) =>
        (r.from === boardingStop && r.to === destinationStop) ||
        (boardingStop.includes(r.from.split(' ')[0]) && destinationStop.includes(r.to.split(' ')[0]))
    );
    return match ? match.id : null;
  }, [boardingStop, destinationStop]);

  // Filtered list for the full browser modal
  const filteredModalServices = useMemo(() => {
    let list = allServices.length > 0 ? allServices : PAYANA_ROUTES.map((r) => ({
      routeNo: r.routeNumber,
      from: r.from,
      to: r.to,
      name: `${r.from} ⇔ ${r.to}`,
    }));

    if (modalSearch.trim()) {
      list = searchRoutesInList(list, modalSearch, 80);
    }
    return list.slice(0, 50);
  }, [allServices, modalSearch]);

  return (
    <div className="space-y-3 mb-4">
      {/* Search Input Bar with Autocomplete */}
      <div ref={dropdownRef} className="relative">
        <div className="relative flex items-center">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setIsDropdownOpen(true);
            }}
            onFocus={() => {
              if (searchQuery.trim()) setIsDropdownOpen(true);
            }}
            placeholder="Search route (e.g. 500-D, 401-E, KIA-9) or stop..."
            className="w-full bg-slate-50 border border-slate-200/90 rounded-2xl pl-9 pr-9 py-2 text-xs font-semibold text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#C8102E]/20 focus:border-red-400 transition-all"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setIsDropdownOpen(false);
              }}
              className="absolute right-3 text-slate-400 hover:text-slate-600 p-0.5"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Autocomplete Dropdown */}
        {isDropdownOpen && searchResults.length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-1.5 bg-white border border-slate-200 rounded-2xl shadow-xl z-50 overflow-hidden max-h-72 overflow-y-auto divide-y divide-slate-100">
            <div className="px-3 py-1.5 bg-slate-50/80 flex items-center justify-between text-[10px] font-bold text-slate-500 uppercase tracking-wider">
              <span>Matching BMTC Routes ({searchResults.length})</span>
              <span className="text-[#C8102E] font-medium">Click to set From & To</span>
            </div>
            {searchResults.map((item, idx) => (
              <button
                key={`${item.routeNo}-${idx}`}
                type="button"
                onClick={() => handleSelect(item.from, item.to)}
                className="w-full px-3 py-2 text-left hover:bg-red-50/60 transition-colors flex items-center justify-between group"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <span className="shrink-0 text-xs font-black px-2 py-0.5 rounded-lg bg-slate-100 text-slate-800 group-hover:bg-[#C8102E] group-hover:text-white transition-colors">
                    {item.routeNo}
                  </span>
                  <div className="truncate">
                    <p className="text-xs font-bold text-slate-800 truncate">
                      {item.from} <span className="text-[#C8102E]">➔</span> {item.to}
                    </p>
                    {item.via && (
                      <p className="text-[10px] text-slate-400 truncate">via {item.via}</p>
                    )}
                  </div>
                </div>
                <span className="shrink-0 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
                  {item.badge}
                </span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Popular Payana Corridors Quick-Select Horizontal Chips */}
      <div>
        <div className="flex items-center justify-between mb-1.5 px-0.5">
          <span className="text-[11px] font-extrabold text-slate-600 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-[#C8102E]" />
            Popular Routes (from Payana.si)
          </span>
          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="text-[11px] font-bold text-[#C8102E] hover:underline flex items-center gap-0.5"
          >
            <span>Browse All ({allServices.length || '2,400+'})</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1.5 scrollbar-none text-xs">
          {PAYANA_ROUTES.slice(0, 10).map((r) => {
            const isSelected = activeCuratedId === r.id;
            return (
              <button
                key={r.id}
                type="button"
                onClick={() => handleSelect(r.from, r.to)}
                className={`shrink-0 flex items-center gap-1.5 px-2.5 py-1 rounded-xl font-bold transition-all border ${
                  isSelected
                    ? 'bg-[#C8102E] text-white border-[#C8102E] shadow-xs'
                    : 'bg-white text-slate-700 border-slate-200/90 hover:border-slate-300 hover:bg-slate-50'
                }`}
              >
                <span className={`text-[10px] px-1 rounded font-black ${isSelected ? 'bg-white/20' : 'bg-slate-100 text-slate-800'}`}>
                  {r.routeNumber}
                </span>
                <span className="text-[11px] whitespace-nowrap">
                  {r.from.split(' ')[0]} ➔ {r.to.split(' ')[0]}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Full Modal for Browsing 2,400+ BMTC Routes */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-lg w-full max-h-[85vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden">
            {/* Modal Header */}
            <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <div>
                <h3 className="font-extrabold text-sm text-slate-900 flex items-center gap-1.5">
                  <Compass className="w-4 h-4 text-[#C8102E]" />
                  BMTC Transit Network Routes
                </h3>
                <p className="text-[11px] text-slate-500">
                  Select any authentic route from Payana's 2,487 services database
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-500 hover:text-slate-800 hover:bg-slate-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Search Input */}
            <div className="p-3 border-b border-slate-100 bg-white">
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={modalSearch}
                  onChange={(e) => setModalSearch(e.target.value)}
                  placeholder="Filter by route number (e.g. 500, 335, KIA, 12) or location..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-2 text-xs font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#C8102E]/20"
                />
              </div>
            </div>

            {/* Modal Routes List */}
            <div className="flex-1 overflow-y-auto divide-y divide-slate-100 p-2">
              {filteredModalServices.length === 0 ? (
                <div className="text-center py-10 text-xs text-slate-400">
                  No matching BMTC routes found. Try another search.
                </div>
              ) : (
                filteredModalServices.map((r, idx) => (
                  <button
                    key={`${r.routeNo}-${idx}`}
                    type="button"
                    onClick={() => handleSelect(r.from, r.to)}
                    className="w-full p-2.5 text-left rounded-xl hover:bg-red-50/60 transition-colors flex items-center justify-between group"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className="shrink-0 text-xs font-black px-2 py-1 rounded-lg bg-slate-100 text-slate-800 group-hover:bg-[#C8102E] group-hover:text-white transition-colors">
                        {r.routeNo}
                      </span>
                      <div className="truncate">
                        <p className="text-xs font-bold text-slate-800 truncate">
                          {r.from} <span className="text-[#C8102E]">➔</span> {r.to}
                        </p>
                        <p className="text-[10px] text-slate-400">BMTC Scheduled Route</p>
                      </div>
                    </div>
                    <span className="shrink-0 text-xs font-bold text-[#C8102E] group-hover:translate-x-0.5 transition-transform flex items-center gap-1">
                      <span>Select</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </button>
                ))
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
              <span>Showing {filteredModalServices.length} routes</span>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-3 py-1.5 bg-slate-200 text-slate-700 font-bold rounded-lg hover:bg-slate-300"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

