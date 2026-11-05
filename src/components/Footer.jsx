import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Ticket, CreditCard, Clock, User, PhoneCall, Info } from 'lucide-react';

export default function Footer() {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { id: 'book', label: 'Book Ticket', icon: Ticket, path: '/' },
    { id: 'passes', label: 'Passes', icon: CreditCard, path: '/checkout' },
    { id: 'trips', label: 'My Trips', icon: Clock, path: '/' },
    { id: 'profile', label: 'Profile', icon: User, path: '/' },
  ];

  const isCurrentActive = (item) => {
    if (item.id === 'book') return location.pathname === '/';
    if (item.id === 'passes') return location.pathname.startsWith('/checkout');
    if (item.id === 'trips') return location.pathname.startsWith('/confirmation');
    return false;
  };

  return (
    <>
      {/* Desktop / Tablet Informational Footer */}
      <footer className="mt-12 mb-20 md:mb-0 bg-white border-t border-slate-200 text-slate-600 text-xs py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="font-bold text-sm text-[#C8102E]">BMTC Namma Ride</span>
                <span className="text-[10px] bg-red-100 text-red-800 font-semibold px-1.5 py-0.5 rounded">
                  ನಮ್ಮ ಬಸ್
                </span>
              </div>
              <p className="text-slate-500 leading-relaxed">
                Bangalore Metropolitan Transport Corporation (BMTC) digital commuter pass and real-time ticketing platform.
              </p>
            </div>

            <div>
              <h5 className="font-semibold text-slate-900 mb-2">24x7 Commuter Helpline</h5>
              <p className="flex items-center gap-1.5 text-slate-700 font-medium mb-1">
                <PhoneCall className="w-3.5 h-3.5 text-[#C8102E]" />
                080-22483777 / 1800-425-1663
              </p>
              <p className="text-slate-500">Email: complaints@bmtc.karnataka.gov.in</p>
            </div>

            <div>
              <h5 className="font-semibold text-slate-900 mb-2">Commuter Guarantee</h5>
              <p className="text-slate-500 leading-relaxed flex items-start gap-1.5">
                <Info className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                <span>Zero surcharge on UPI tickets. Real-time GPS tracking enabled on all electric & Volvo Vajra routes.</span>
              </p>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-400 gap-2">
            <div>© {new Date().getFullYear()} BMTC Namma Ride • Government of Karnataka</div>
            <div className="text-slate-500 italic">Simulated GPS & Ticket Verification Environment</div>
          </div>
        </div>
      </footer>

      {/* Mobile Bottom Navigation Bar (Matches Screenshot) */}
      <nav className="fixed bottom-0 left-0 right-0 z-30 bg-white/95 backdrop-blur-md border-t border-slate-200 py-2 px-3 sm:hidden shadow-lg">
        <div className="max-w-md mx-auto grid grid-cols-4 gap-1 text-center">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isCurrentActive(item);
            return (
              <button
                key={item.id}
                onClick={() => navigate(item.path)}
                className={`flex flex-col items-center justify-center py-1 transition-all ${
                  active ? 'text-[#C8102E]' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <div className={`p-1 rounded-full transition-colors ${active ? 'bg-red-50' : ''}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <span className={`text-[10px] mt-0.5 ${active ? 'font-bold' : 'font-medium'}`}>
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </nav>
    </>
  );
}

