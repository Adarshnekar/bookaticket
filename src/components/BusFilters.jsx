import React from 'react';

export default function BusFilters({ activeFilter, onSelectFilter, counts = {} }) {
  const filters = [
    { id: 'all', label: 'All Services', count: counts.all || 0 },
    { id: 'Non-AC', label: 'Non-AC', count: counts['Non-AC'] || 0 },
    { id: 'AC Electric', label: 'AC Electric', count: counts['AC Electric'] || 0 },
    { id: 'Volvo Vajra', label: 'Volvo Vajra', count: counts['Volvo Vajra'] || 0 },
  ];

  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-0.5 no-scrollbar">
      {filters.map((f) => {
        const isActive = activeFilter === f.id;
        return (
          <button
            key={f.id}
            type="button"
            onClick={() => onSelectFilter(f.id)}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-150 ${
              isActive
                ? 'bg-[#C8102E] text-white shadow-sm ring-2 ring-red-200'
                : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200/80 shadow-2xs'
            }`}
          >
            <span>{f.label}</span>
            {f.count > 0 && (
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                  isActive ? 'bg-red-800 text-white' : 'bg-slate-100 text-slate-600'
                }`}
              >
                {f.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}

